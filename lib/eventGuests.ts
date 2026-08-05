import type { EventItem, OrganizationMember } from './mockEventsData';
import { SIGEP_ROSTER } from './mockEventsData';
import { GPB_ROSTER } from './gpbRoster';
import { SAE_ROSTER } from './saeRoster';

/**
 * Named attendees behind an event's Going / Pending / Declined counts.
 *
 * Organizers keep asking "who", not "how many" — a headcount alone can't tell you
 * which fifteen people never answered. Names are derived deterministically from the
 * event id so the same event always shows the same list.
 */
export type EventGuest = {
  id: string;
  name: string;
  status: 'going' | 'pending' | 'declined';
  isMember: boolean;
  detail: string;
};

const ROSTERS: Record<string, OrganizationMember[]> = {
  program_board: GPB_ROSTER,
  sigma_phi_epsilon: SIGEP_ROSTER,
  sae: SAE_ROSTER,
};

const FIRST_NAMES = [
  'Aidan', 'Blake', 'Cameron', 'Diego', 'Ethan', 'Felix', 'Gavin', 'Henry', 'Isaac', 'Jonah',
  'Kellen', 'Liam', 'Miles', 'Nico', 'Owen', 'Patrick', 'Quentin', 'Rowan', 'Sean', 'Tomas',
  'Umar', 'Vincent', 'Wesley', 'Xander', 'Yosef', 'Zach', 'Andre', 'Brooks', 'Colin', 'Dominic',
  'Eli', 'Finn', 'Grady', 'Hugo', 'Ian', 'Jamal', 'Kyle', 'Lucas', 'Marco', 'Nathan',
];

const LAST_NAMES = [
  'Alvarez', 'Bennett', 'Carrington', 'Delgado', 'Eastwood', 'Fitzpatrick', 'Guerrero', 'Hollins',
  'Ibrahim', 'Jennings', 'Kowalski', 'Lindstrom', 'Moretti', 'Nakashima', 'Oduya', 'Prescott',
  'Quintana', 'Rasmussen', 'Sullivan', 'Tremblay', 'Ueda', 'Valdez', 'Whitaker', 'Xiong',
  'Yardley', 'Zamora', 'Ashford', 'Boone', 'Castillo', 'Donnelly', 'Ellison', 'Farrow',
  'Gallagher', 'Hoffman', 'Iverson', 'Jacobsen', 'Keller', 'Lombardi', 'Mahoney', 'Novak',
];

const CLASS_YEARS = ['Class of 2030', 'Class of 2030', 'Class of 2030', 'Class of 2029', 'Class of 2028'];

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Members-only events draw entirely from the roster; open events are mostly non-members. */
function memberShare(event: EventItem): number {
  return event.visibility === 'members_only' ? 1 : 0.15;
}

export function getEventGuests(event: EventItem): EventGuest[] {
  const going = event.goingCount || 0;
  const pending = event.pendingCount || 0;
  const declined = event.declinedCount || 0;
  const total = going + pending + declined;
  if (total === 0) return [];

  const rand = seededRandom(hashString(String(event.id)));
  const roster = ROSTERS[event.hostOrganizationId] || [];

  const wantMembers = Math.min(roster.length, Math.round(total * memberShare(event)));
  const memberPool = shuffled(roster, rand)
    .slice(0, wantMembers)
    .map((m, i) => ({
      id: `m-${i}-${m.email}`,
      name: m.name,
      isMember: true,
      detail: m.title || 'Member',
    }));

  const guestPool: Omit<EventGuest, 'status'>[] = [];
  const usedNames = new Set(memberPool.map(m => m.name));
  let attempts = 0;
  while (guestPool.length < total - memberPool.length && attempts < 10000) {
    attempts++;
    const name = `${FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]}`;
    if (usedNames.has(name)) continue;
    usedNames.add(name);
    guestPool.push({
      id: `g-${guestPool.length}-${name}`,
      name,
      isMember: false,
      detail: CLASS_YEARS[Math.floor(rand() * CLASS_YEARS.length)],
    });
  }

  const everyone = shuffled([...memberPool, ...guestPool], rand);

  return everyone.map((person, i) => ({
    ...person,
    status: i < going ? 'going' : i < going + pending ? 'pending' : 'declined',
  }));
}
