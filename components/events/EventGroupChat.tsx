"use client";
import React, { useState, useEffect } from 'react';
import { EventItem } from '../../lib/mockEventsData';
import { USERS } from '../../lib/users';
import { EVI } from './Icons';

export type ThreadMessage = {
  id: number;
  sender: string;
  userId?: string;
  text: string;
  time: string;
  isMe?: boolean;
};

export function seedEventThread(event: EventItem, currentUserId?: string): ThreadMessage[] {
  const name = (event.name || '').toLowerCase();
  const orgId = (event.hostOrganizationId || '').toLowerCase();
  const isSae = orgId === 'sae' || (event.host || '').toLowerCase().includes('sae');

  const markMine = (msg: ThreadMessage): ThreadMessage => {
    if (currentUserId && msg.userId === currentUserId) {
      return { ...msg, isMe: true, sender: 'You' };
    }
    return msg;
  };

  // 1. Fall Rush Event Chat
  if (name.includes('fall rush') || name.includes('rush kickoff') || event.id === 'sae-rush-open-house') {
    return [
      { id: 1, sender: 'Owen Marchetti', text: 'Doors at 7. Brothers try to be there by 6:45.', time: '6:14 PM' },
      { id: 2, sender: 'Cole Brennan', userId: 'cole', text: 'Food should be there around 6:30.', time: '6:16 PM' },
      { id: 3, sender: 'Jasper Lowell', text: 'what food', time: '6:18 PM' },
      { id: 4, sender: 'Cole Brennan', userId: 'cole', text: 'pizza', time: '6:18 PM' },
      { id: 5, sender: 'Jasper Lowell', text: 'elite', time: '6:19 PM' },
      { id: 6, sender: 'Reid Vandenberg', text: 'If you invited someone personally just make sure they know where they’re going.', time: '6:24 PM' },
      { id: 7, sender: 'Asher Quinlan', text: 'we expecting a lot?', time: '6:27 PM' },
      { id: 8, sender: 'Owen Marchetti', text: 'Probably 40ish throughout the night.', time: '6:28 PM' },
      { id: 9, sender: 'Miles Thackeray', text: 'And please actually talk to people this time instead of all standing together 😭', time: '6:31 PM' },
      { id: 10, sender: 'Elias Whitmore', text: 'no promises', time: '6:33 PM' },
    ].map(markMine);
  }

  // 2. Fall Formal Chat
  if (name.includes('formal')) {
    return [
      { id: 1, sender: 'Cole Brennan', userId: 'cole', text: 'Final headcount is 72 including dates.', time: '11:04 AM' },
      { id: 2, sender: 'Grant Ellsworth', text: 'Everyone who still owes for their date please pay today.', time: '11:07 AM' },
      { id: 3, sender: 'Vaughn Castellano', text: 'transportation locked?', time: '11:12 AM' },
      { id: 4, sender: 'Miles Thackeray', text: 'Yeah buses leave Georgetown at 7:20.', time: '11:15 AM' },
      { id: 5, sender: 'Reid Vandenberg', text: 'Be there at 7. We are not holding a bus because someone is changing shirts.', time: '11:18 AM' },
      { id: 6, sender: 'Jasper Lowell', text: 'very specific', time: '11:19 AM' },
      { id: 7, sender: 'Reid Vandenberg', text: 'because it has happened', time: '11:20 AM' },
      { id: 8, sender: 'Beau Lindqvist', text: 'Venue details are in the event info now.', time: '11:24 AM' },
      { id: 9, sender: 'Oscar Beaumont', text: 'afterparty 👀', time: '11:32 AM' },
      { id: 10, sender: 'Cole Brennan', userId: 'cole', text: 'one thing at a time', time: '11:35 AM' },
    ].map(markMine);
  }

  // 3. Champagne & Shackles Chat
  if (name.includes('shackles') || name.includes('champagne')) {
    return [
      { id: 1, sender: 'Owen Marchetti', text: '46 rushes confirmed right now.', time: '2:10 PM' },
      { id: 2, sender: 'Cole Brennan', userId: 'cole', text: 'Nice. Brothers there by 7:30.', time: '2:12 PM' },
      { id: 3, sender: 'Tate Kowalczyk', text: 'Please keep the address inside this chat / invite list.', time: '2:15 PM' },
      { id: 4, sender: 'Callum Rhodes', text: 'dress code actually matter or no', time: '2:18 PM' },
      { id: 5, sender: 'Owen Marchetti', text: 'Just look normal bro 😭', time: '2:19 PM' },
      { id: 6, sender: 'Miles Thackeray', text: 'Smart casual. This should not require a committee meeting.', time: '2:21 PM' },
      { id: 7, sender: 'Asher Quinlan', text: 'anything we need to set up?', time: '2:24 PM' },
      { id: 8, sender: 'Cole Brennan', userId: 'cole', text: 'Come early and help with drinks + downstairs.', time: '2:26 PM' },
      { id: 9, sender: 'Jasper Lowell', text: 'champagne acquired?', time: '2:28 PM' },
      { id: 10, sender: 'Grant Ellsworth', text: 'Unfortunately yes', time: '2:30 PM' },
    ].map(markMine);
  }

  // Non-SAE seeded demos (e.g. GPB Kickoff / Midnight Breakfast)
  if (name.includes('kickoff') && !isSae) {
    return [
      { id: 1, sender: 'Cole Brennan', userId: 'cole', text: "Kickoff is Thursday 7–8:30 in Leavey Program Room. Dinner's covered — please be there.", time: '2:14 PM' },
      { id: 2, sender: 'Maya Thompson', text: 'Can Programming bring a rough Sept/Oct list so we can assign teams on the spot?', time: '2:16 PM' },
      { id: 3, sender: 'Elena Rossi', text: "Already drafting it. I'll drop a doc in here before Thursday.", time: '2:18 PM' },
      { id: 4, sender: 'Jordan Davis', userId: 'jordan', text: 'Production can cover AV for Leavey if we need mics / speaker.', time: '2:21 PM' },
      { id: 5, sender: 'Priya Shah', text: "I'll bring a one-pager for marketing asks so chairs know what to request.", time: '2:24 PM' },
    ].map(markMine);
  }

  if (name.includes('midnight breakfast') && !isSae) {
    return [
      { id: 1, sender: 'Cole Brennan', userId: 'cole', text: 'Midnight Breakfast is locked for Dec 10 — HFSC Great Room, 10pm–12:30. Food while it lasts.', time: '11:02 AM' },
      { id: 2, sender: 'Maya Thompson', text: 'Marketing — can we get a campus push + Instagram the week of?', time: '11:08 AM' },
      { id: 3, sender: 'Priya Shah', text: 'Yep. Flyer is ready. I’ll queue stories for Dec 8–10.', time: '11:12 AM' },
      { id: 4, sender: 'Jordan Davis', userId: 'jordan', text: 'Production can run games + playlist. Who’s on food vendor check-in?', time: '11:20 AM' },
      { id: 5, sender: 'Elena Rossi', text: 'I’ll take vendor liaison. Need 4 people on plate/line duty that night.', time: '11:24 AM' },
    ].map(markMine);
  }

  // All other events start in empty state
  return [];
}

export function EventGroupChat({
  event,
  currentUserId,
  onClose,
  onOpenDetails,
}: {
  event: EventItem;
  currentUserId?: string;
  onClose: () => void;
  onOpenDetails?: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState<ThreadMessage[]>(() => seedEventThread(event, currentUserId));

  useEffect(() => {
    setThread(seedEventThread(event, currentUserId));
    setDraft('');
  }, [event.id, currentUserId]);

  const send = () => {
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setThread(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'You',
        userId: currentUserId,
        text: draft.trim(),
        time,
        isMe: true,
      },
    ]);
    setDraft('');
  };

  return (
    <div className="screen-fade" style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'var(--ligo-paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 'max(env(safe-area-inset-top, 56px), 56px) 20px 16px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '2px solid var(--ink)', flexShrink: 0 }}>
        <button onClick={onClose} aria-label="Back" style={{ background: 'var(--ink)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <EVI.Back />
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 2 }}>
            Event group chat
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-display)', textTransform: 'uppercase', lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.name}
          </div>
        </div>
        {onOpenDetails && (
          <button
            onClick={onOpenDetails}
            style={{ background: 'rgba(20,17,13,0.06)', border: 'none', padding: '10px 14px', borderRadius: 100, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)', cursor: 'pointer', flexShrink: 0 }}
          >
            Details
          </button>
        )}
      </div>

      <div style={{ padding: '10px 20px 12px', borderBottom: '1px solid rgba(20,17,13,0.06)', flexShrink: 0 }}>
        <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', fontWeight: 500, lineHeight: 1.4 }}>
          Chat about this event only — plans, logistics, questions.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {thread.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(20,17,13,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)', marginBottom: 16 }}>
              <EVI.Group style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 500, fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginBottom: 8, color: 'var(--ink)' }}>
              No messages yet
            </div>
            <div style={{ fontSize: 14, color: 'rgba(20,17,13,0.5)', maxWidth: 280, lineHeight: 1.5, fontWeight: 500 }}>
              Send a message below to kick off planning and get this event's logistics moving.
            </div>
          </div>
        ) : (
          thread.map(msg => {
            const avatar = msg.userId ? USERS[msg.userId]?.avatar : null;
            const initials = msg.sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: msg.isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 10,
                }}
              >
                {!msg.isMe && (
                  avatar ? (
                    <img src={avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                      {initials}
                    </div>
                  )
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                  {!msg.isMe && (
                    <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.45)', fontWeight: 500, marginBottom: 4, marginLeft: 4 }}>
                      {msg.sender}
                    </div>
                  )}
                  <div style={{
                    background: msg.isMe ? 'var(--orange)' : 'rgba(20,17,13,0.06)',
                    color: msg.isMe ? '#fff' : 'var(--ink)',
                    padding: '12px 16px',
                    borderRadius: 18,
                    borderBottomRightRadius: msg.isMe ? 4 : 18,
                    borderBottomLeftRadius: msg.isMe ? 18 : 4,
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(20,17,13,0.35)', marginTop: 4, fontWeight: 500 }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: '12px 16px max(20px, env(safe-area-inset-bottom, 20px))', borderTop: '1px solid rgba(20,17,13,0.06)', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, background: 'var(--ligo-paper)' }}>
        <div style={{ flex: 1, background: 'rgba(20,17,13,0.05)', borderRadius: 100, padding: '14px 18px' }}>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="Message this event..."
            autoFocus
            style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: 15, color: 'var(--ink)' }}
          />
        </div>
        <button
          onClick={send}
          aria-label="Send"
          style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--ink)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>
  );
}
