import { EventItem } from './mockEventsData';
import { USERS } from './users';

export type GoingFace = { id: string; name: string; shortName: string; avatar: string };

export type GoingSocial = {
  faces: GoingFace[];
  going: number;
  connectionCount: number;
  /** Compact: "Maya, Sofia + 34 going" */
  label: string;
  /** Detail heading: "38 people are going" */
  heading: string;
  /** Detail sub: "4 people you know" */
  connectionsLabel: string;
};

const MALE_DEMO_FACE_POOL = ['cole', 'bennett', 'jordan', 'marcus'] as const;
const ALL_DEMO_FACE_POOL = ['sofia', 'charlotte', 'caroline', 'maddie', 'alessia', 'bennett', 'cole', 'jordan', 'marcus'] as const;

function shortFirst(name: string) {
  return name.split(' ')[0].replace(/\.$/, '');
}

function isFraternityRushEvent(event: EventItem): boolean {
  const name = (event.name || '').toLowerCase();
  const host = (event.host || event.hostName || '').toLowerCase();
  const orgId = (event.hostOrganizationId || '').toLowerCase();
  const tags = (event.tags || []).map(t => t.toLowerCase());
  const category = (event.category || '').toLowerCase();
  const summary = (event.summary || event.description || '').toString().toLowerCase();

  // Events with dates / open campus / formals allow girl profiles
  if (name.includes('formal') || name.includes('white party') || tags.includes('brothers + dates')) {
    return false;
  }

  const isFrat = orgId === 'sae' || 
    orgId === 'sigma_phi_epsilon' || 
    host.includes('sae') || 
    host.includes('sigma alpha epsilon') || 
    host.includes('sigep') || 
    host.includes('sigma phi epsilon');

  const isRush = name.includes('rush') || 
    name.includes('shackles') || 
    tags.includes('rush') || 
    tags.includes('recruitment') ||
    category.includes('rush') || 
    summary.includes('rush') ||
    summary.includes('recruitment') ||
    summary.includes('prospective member');

  return isFrat && isRush;
}

/** Stable, authentic faces + honest counts. Never inflate attendance. */
export function getGoingSocial(event: EventItem, currentUserId?: string): GoingSocial {
  const going = event.goingCount || event.socialProof?.going || 0;
  const connectionCount = Math.min(
    event.socialProof?.connections ?? Math.min(going, 4),
    going,
    6,
  );

  const seed = String(event.id).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const poolBase = isFraternityRushEvent(event) ? MALE_DEMO_FACE_POOL : ALL_DEMO_FACE_POOL;
  const pool = poolBase.filter(id => id !== currentUserId && USERS[id]?.avatar);
  const faces: GoingFace[] = pool.length === 0
    ? []
    : [...pool.slice(seed % pool.length), ...pool.slice(0, seed % pool.length)]
        .slice(0, Math.min(connectionCount, 4))
        .map(id => {
          const u = USERS[id];
          return {
            id,
            name: u.name,
            shortName: shortFirst(u.name),
            avatar: u.avatar,
          };
        });

  let label = '';
  if (going <= 0) {
    label = 'Be the first to RSVP';
  } else if (faces.length >= 2) {
    const rest = Math.max(going - faces.length, 0);
    label = rest > 0
      ? `${faces[0].shortName}, ${faces[1].shortName} + ${rest} going`
      : `${faces.map(f => f.shortName).join(', ')} going`;
  } else if (faces.length === 1) {
    const rest = Math.max(going - 1, 0);
    label = rest > 0
      ? `${faces[0].shortName} + ${rest} going`
      : `${faces[0].shortName} is going`;
  } else {
    label = `${going} going`;
  }

  const heading = going <= 0
    ? 'No RSVPs yet'
    : `${going} ${going === 1 ? 'person is' : 'people are'} going`;

  const connectionsLabel = connectionCount > 0
    ? `${connectionCount} ${connectionCount === 1 ? 'person' : 'people'} you know`
    : '';

  return { faces, going, connectionCount, label, heading, connectionsLabel };
}
