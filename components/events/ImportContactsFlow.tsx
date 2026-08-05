import React, { useEffect, useState } from 'react';
import { EVI } from './Icons';

type Step =
  | 'choose'
  | 'text'
  | 'email'
  | 'csv-picker'
  | 'uploading'
  | 'matching'
  | 'results'
  | 'sending'
  | 'upload-done'
  | 'native-done';

type RosterUploadMock = {
  fileName: string;
  rowCount: number;
  onLigo: number;
  notOnLigo: number;
  alreadyMembers: number;
  sampleRows: Array<{ name: string; phone: string; email: string; note?: string }>;
};

const ROSTER_UPLOAD_BY_ORG: Record<string, RosterUploadMock> = {
  program_board: {
    fileName: 'ProgramBoard_Roster.csv',
    rowCount: 28,
    onLigo: 12,
    notOnLigo: 14,
    alreadyMembers: 2,
    sampleRows: [
      { name: 'Maya Lin', phone: '202-555-0101', email: 'maya.lin@georgetown.edu', note: 'Concerts' },
      { name: 'David Park', phone: '202-555-0102', email: 'david.park@georgetown.edu', note: 'Marketing' },
      { name: 'Sarah Jenkins', phone: '202-555-0103', email: 'sarah.j@georgetown.edu', note: 'Finance' },
      { name: 'Alex Rivera', phone: '202-555-0104', email: 'alex.r@georgetown.edu', note: 'Operations' },
    ],
  },
  phantoms: {
    fileName: 'Phantoms_Roster.csv',
    rowCount: 22,
    onLigo: 9,
    notOnLigo: 11,
    alreadyMembers: 2,
    sampleRows: [
      { name: 'Sofia Rodriguez', phone: '202-555-0201', email: 'sofia.r@georgetown.edu', note: 'Soprano' },
      { name: 'Chris Miller', phone: '202-555-0202', email: 'chris.m@georgetown.edu', note: 'Tenor' },
      { name: 'Emily Chen', phone: '202-555-0203', email: 'emily.c@georgetown.edu', note: 'Alto' },
      { name: 'Nate Wright', phone: '202-555-0204', email: 'nate.w@georgetown.edu', note: 'Bass' },
    ],
  },
  sigma_phi_epsilon: {
    fileName: 'MemberRoster.csv',
    rowCount: 24,
    onLigo: 10,
    notOnLigo: 12,
    alreadyMembers: 2,
    sampleRows: [
      { name: 'Justin Vance', phone: '202-555-0311', email: 'justin.v@georgetown.edu', note: 'Brother' },
      { name: 'Tyler Brooks', phone: '202-555-0312', email: 'tyler.b@georgetown.edu', note: 'Brother' },
      { name: 'Sammy Cruz', phone: '202-555-0313', email: 'sammy.c@georgetown.edu', note: 'New Member' },
      { name: 'Kyle O’Connor', phone: '202-555-0314', email: 'kyle.o@georgetown.edu', note: 'New Member' },
    ],
  },
  sae: {
    fileName: 'SAE_Rush_Signups_Fall2026.csv',
    rowCount: 58,
    onLigo: 26,
    notOnLigo: 30,
    alreadyMembers: 2,
    sampleRows: [
      { name: 'Aiden Vance', phone: '202-555-0301', email: 'aiden.vance@georgetown.edu', note: 'Fall \'26 Rush' },
      { name: 'Liam Gallagher', phone: '202-555-0302', email: 'liam.g@georgetown.edu', note: 'Fall \'26 Rush' },
      { name: 'Lucas Hayes', phone: '202-555-0303', email: 'lucas.h@georgetown.edu', note: 'Fall \'26 Rush' },
      { name: 'Julian Mercer', phone: '202-555-0304', email: 'julian.m@georgetown.edu', note: 'Fall \'26 Rush' },
    ],
  },
};

const DEFAULT_ROSTER_UPLOAD: RosterUploadMock = {
  fileName: 'MemberRoster.csv',
  rowCount: 20,
  onLigo: 8,
  notOnLigo: 10,
  alreadyMembers: 2,
  sampleRows: [
    { name: 'Jordan Hayes', phone: '202-555-0401', email: 'jordan.h@georgetown.edu' },
    { name: 'Marcus Bell', phone: '202-555-0402', email: 'marcus.b@georgetown.edu' },
    { name: 'Charlotte Drake', phone: '202-555-0403', email: 'charlotte.d@georgetown.edu' },
  ],
};

function inviteUrlForOrg(orgId?: string) {
  const slug = orgId || 'club';
  return `https://ligo.app/join/${slug}`;
}

function inviteMessage(clubName: string, url: string) {
  return `Hey — join ${clubName} on Ligo: ${url}`;
}

function inviteEmailSubject(clubName: string) {
  return `Join ${clubName} on Ligo`;
}

function inviteEmailBody(clubName: string, url: string) {
  return `Hey,\n\nYou're invited to join ${clubName} on Ligo.\n\nIf you already have the app, open this link to join the org.\nIf not, it'll take you to download Ligo first:\n\n${url}\n\nSee you there.`;
}

export function ImportContactsFlow({
  orgId,
  orgName,
  onBack,
  onClose,
}: {
  orgId?: string;
  orgName?: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const clubName = orgName || 'your organization';
  const rosterMock = (orgId && ROSTER_UPLOAD_BY_ORG[orgId]) || DEFAULT_ROSTER_UPLOAD;
  const inviteUrl = inviteUrlForOrg(orgId);
  const textBody = inviteMessage(clubName, inviteUrl);
  const mailSubject = inviteEmailSubject(clubName);
  const mailBody = inviteEmailBody(clubName, inviteUrl);

  const [step, setStep] = useState<Step>('choose');
  const [nativeChannel, setNativeChannel] = useState<'share' | 'text' | 'email' | 'copy'>('share');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(rosterMock.fileName);
  const [resultOnLigo, setResultOnLigo] = useState(0);
  const [resultNotOnLigo, setResultNotOnLigo] = useState(0);
  const [resultAlreadyMembers, setResultAlreadyMembers] = useState(0);

  useEffect(() => {
    if (step === 'uploading') {
      const t = setTimeout(() => setStep('matching'), 1300);
      return () => clearTimeout(t);
    }
    if (step === 'matching') {
      const t = setTimeout(() => setStep('results'), 1500);
      return () => clearTimeout(t);
    }
    if (step === 'sending') {
      const t = setTimeout(() => setStep('upload-done'), 1400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const startRosterUpload = () => {
    setSelectedFile(rosterMock.fileName);
    setResultOnLigo(rosterMock.onLigo);
    setResultNotOnLigo(rosterMock.notOnLigo);
    setResultAlreadyMembers(rosterMock.alreadyMembers);
    setStep('uploading');
  };

  const leave = () => onBack();

  const goBack = () => {
    if (step === 'choose' || step === 'native-done' || step === 'upload-done') {
      leave();
      return;
    }
    if (step === 'text' || step === 'email' || step === 'csv-picker') {
      setStep('choose');
      return;
    }
    if (step === 'results') {
      setStep('csv-picker');
      return;
    }
    leave();
  };

  const markNativeDone = (channel: typeof nativeChannel) => {
    setNativeChannel(channel);
    setStep('native-done');
  };

  const handleShareLink = async () => {
    const payload = {
      title: `Join ${clubName} on Ligo`,
      text: textBody,
      url: inviteUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share(payload);
        markNativeDone('share');
        return;
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
    }

    try {
      await navigator.clipboard.writeText(`${textBody}`);
      setCopyHint('Invite message copied');
      markNativeDone('copy');
    } catch {
      setCopyHint('Copy this link: ' + inviteUrl);
      markNativeDone('copy');
    }
  };

  const handleOpenMessages = () => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    const href = cleaned
      ? `sms:${cleaned}&body=${encodeURIComponent(textBody)}`
      : `sms:&body=${encodeURIComponent(textBody)}`;
    window.location.href = href;
    markNativeDone('text');
  };

  const handleOpenMail = () => {
    const to = email.trim();
    const href = to
      ? `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
      : `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = href;
    markNativeDone('email');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid rgba(20,17,13,0.12)',
    background: '#fff',
    fontSize: 15,
    color: 'var(--ink)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const optionBtn: React.CSSProperties = {
    padding: 20,
    background: '#fff',
    borderRadius: 16,
    border: '1px solid rgba(20,17,13,0.08)',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    width: '100%',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--ligo-paper)',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      padding: 'max(env(safe-area-inset-top, 56px), 56px) 24px max(env(safe-area-inset-bottom, 40px), 40px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button
          onClick={goBack}
          aria-label="Back"
          style={{
            background: 'var(--ink)',
            color: '#fff',
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <EVI.Back />
        </button>
        <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)' }}>
          {step === 'csv-picker' || step === 'uploading' || step === 'matching' || step === 'results' || step === 'upload-done' ? 'CSV Roster Import' : 'Invite Members'}
        </div>
        <button onClick={leave} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EVI.Close />
        </button>
      </div>

      {step === 'choose' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 36, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 12 }}>
            Invite people to<br/>{clubName}.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(20,17,13,0.6)', lineHeight: 1.4, marginBottom: 28 }}>
            Get your members on Ligo so they can find events, stay in the loop, and show up.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => setStep('csv-picker')} style={{ ...optionBtn, border: '2px solid rgba(249,115,22,0.3)', background: 'linear-gradient(180deg, #ffffff 0%, rgba(249,115,22,0.04) 100%)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <EVI.Group />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Upload CSV Roster</div>
                  <span style={{ fontSize: 10, fontWeight: 600, background: 'rgba(249,115,22,0.15)', color: 'var(--orange)', padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase' }}>Rush / Tabling</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', marginTop: 4 }}>
                  Import tabling list, Google Sheet, or chapter roster at once
                </div>
              </div>
            </button>

            <button onClick={handleShareLink} style={optionBtn}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,17,13,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', flexShrink: 0 }}>
                <EVI.Share />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>Share link</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 4 }}>
                  Send your invite link anywhere
                </div>
              </div>
            </button>

            <button onClick={() => setStep('text')} style={optionBtn}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,17,13,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', flexShrink: 0 }}>
                <EVI.Invite />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>Text invite</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 4 }}>
                  Message someone directly
                </div>
              </div>
            </button>

            <button onClick={() => setStep('email')} style={optionBtn}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,17,13,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', flexShrink: 0 }}>
                <EVI.Mail />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>Email invite</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 4 }}>
                  Send it to their inbox
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {step === 'csv-picker' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 32, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 8 }}>
            Upload CSV Roster
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(20,17,13,0.6)', lineHeight: 1.4, marginBottom: 20 }}>
            Upload signups from rush tabling or spreadsheets. Ligo matches contacts to student profiles and queues invitations.
          </p>

          {/* Interactive File Dropzone Box */}
          <div 
            onClick={() => setSelectedFile(rosterMock.fileName)}
            style={{
              padding: 20,
              background: '#fff',
              borderRadius: 20,
              border: '2px dashed var(--orange)',
              cursor: 'pointer',
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 4px 16px rgba(249,115,22,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)', flexShrink: 0 }}>
                <EVI.Paperclip style={{ width: 22, height: 22 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {rosterMock.fileName}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 2 }}>
                  {rosterMock.rowCount} contacts · 14.8 KB · CSV
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(34,197,94,0.12)', color: '#16a34a', padding: '4px 10px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Loaded ✓
              </span>
            </div>

            {/* CSV Preview Table */}
            <div style={{ background: 'rgba(20,17,13,0.03)', borderRadius: 12, padding: 12, fontSize: 13 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Parsed Columns: Name, Phone, Email</span>
                <span>Top 4 of {rosterMock.rowCount}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {rosterMock.sampleRows.map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink)', fontSize: 13, padding: '4px 0', borderBottom: i < rosterMock.sampleRows.length - 1 ? '1px solid rgba(20,17,13,0.05)' : 'none' }}>
                    <span style={{ fontWeight: 500 }}>{row.name}</span>
                    <span style={{ color: 'rgba(20,17,13,0.5)', fontSize: 12 }}>{row.phone}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--orange)', fontWeight: 500, textAlign: 'center' }}>
                + {rosterMock.rowCount - rosterMock.sampleRows.length} more signups ready
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
            <button
              onClick={startRosterUpload}
              style={{
                width: '100%',
                padding: 18,
                borderRadius: 16,
                background: 'var(--ink)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(20,17,13,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>Upload & Match Contacts ({rosterMock.rowCount})</span>
              <EVI.Chevron style={{ width: 14, height: 14, transform: 'rotate(-90deg)' }} />
            </button>
            <button
              onClick={() => setStep('choose')}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 16,
                background: 'transparent',
                color: 'rgba(20,17,13,0.5)',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Choose another invite method
            </button>
          </div>
        </div>
      )}

      {step === 'text' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setStep('choose')}
            style={{ background: 'none', border: 'none', padding: 0, marginBottom: 16, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'rgba(20,17,13,0.5)', textAlign: 'left' }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: 32, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 8 }}>
            Text invite
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(20,17,13,0.55)', lineHeight: 1.4, marginBottom: 24 }}>
            Add a number or pick who to text next.
          </p>

          <div style={{
            padding: 16,
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(20,17,13,0.08)',
            marginBottom: 16,
            fontSize: 14,
            lineHeight: 1.45,
            color: 'var(--ink)',
            whiteSpace: 'pre-wrap',
          }}>
            {textBody}
          </div>

          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone number"
            inputMode="tel"
            style={{ ...inputStyle, marginBottom: 16 }}
          />

          <button
            onClick={handleOpenMessages}
            style={{
              width: '100%',
              padding: 18,
              borderRadius: 16,
              background: 'var(--ink)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              marginTop: 'auto',
            }}
          >
            Send text
          </button>
        </div>
      )}

      {step === 'email' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setStep('choose')}
            style={{ background: 'none', border: 'none', padding: 0, marginBottom: 16, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'rgba(20,17,13,0.5)', textAlign: 'left' }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: 32, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 8 }}>
            Email invite
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(20,17,13,0.55)', lineHeight: 1.4, marginBottom: 24 }}>
            Add an email or choose the recipient next.
          </p>

          <div style={{
            padding: 16,
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(20,17,13,0.08)',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 6 }}>
              Subject
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>{mailSubject}</div>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(20,17,13,0.4)', marginBottom: 6 }}>
              Message
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{mailBody}</div>
          </div>

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            inputMode="email"
            style={{ ...inputStyle, marginBottom: 16 }}
          />

          <button
            onClick={handleOpenMail}
            style={{
              width: '100%',
              padding: 18,
              borderRadius: 16,
              background: 'var(--ink)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              marginTop: 'auto',
            }}
          >
            Send email
          </button>
        </div>
      )}

      {step === 'native-done' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 64, height: 64, background: 'var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 24 }}>
            <EVI.Check style={{ width: 32, height: 32 }} />
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 12 }}>
            {nativeChannel === 'copy' ? 'Link copied.' : 'Invite sent.'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(20,17,13,0.55)', lineHeight: 1.4, marginBottom: 28 }}>
            {nativeChannel === 'copy'
              ? 'Paste it wherever your members already are.'
              : `They'll land in ${clubName} once they join on Ligo.`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
            <button
              onClick={() => setStep('choose')}
              style={{
                width: '100%',
                padding: 18,
                borderRadius: 16,
                background: 'var(--ink)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Invite someone else
            </button>
            <button
              onClick={leave}
              style={{
                width: '100%',
                padding: 18,
                borderRadius: 16,
                background: 'transparent',
                color: 'var(--ink)',
                fontSize: 15,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {(step === 'uploading' || step === 'matching' || step === 'sending') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
          <div className="spinner" style={{ width: 56, height: 56, border: '4px solid rgba(249,115,22,0.2)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 0.9s linear infinite', marginBottom: 24 }} />
          <h2 style={{ fontSize: 26, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 10 }}>
            {step === 'uploading'
              ? 'Reading CSV File...'
              : step === 'matching'
                ? 'Matching Georgetown Profiles...'
                : 'Dispatching Invitations...'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(20,17,13,0.6)', maxWidth: 300, lineHeight: 1.45, marginBottom: 20 }}>
            {step === 'uploading'
              ? `Parsing ${rosterMock.rowCount} contacts from ${rosterMock.fileName}`
              : step === 'matching'
                ? `Cross-referencing student emails & numbers with active Ligo accounts`
                : `Sending automated SMS & email links for ${clubName}`}
          </p>

          {/* Animated simulation progress bar */}
          <div style={{ width: '100%', maxWidth: 280, height: 6, background: 'rgba(20,17,13,0.08)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'var(--orange)',
              borderRadius: 10,
              width: step === 'uploading' ? '45%' : step === 'matching' ? '85%' : '100%',
              transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {step === 'results' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 64, height: 64, background: 'var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 20 }}>
            <EVI.Check style={{ width: 32, height: 32 }} />
          </div>

          <h2 style={{ fontSize: 32, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 8 }}>
            Roster Processed.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(20,17,13,0.6)', lineHeight: 1.4, marginBottom: 24 }}>
            Successfully parsed <strong>{rosterMock.rowCount} contacts</strong> from {rosterMock.fileName}.
          </p>

          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(20,17,13,0.08)', overflow: 'hidden', marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: 18, borderBottom: '1px solid rgba(20,17,13,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{resultOnLigo} Contacts</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', marginTop: 2 }}>Already registered on Ligo</div>
              </div>
              <div style={{ color: 'var(--orange)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(249,115,22,0.1)', padding: '4px 12px', borderRadius: 20 }}>
                Instant Add
              </div>
            </div>
            <div style={{ padding: 18, borderBottom: resultAlreadyMembers > 0 ? '1px solid rgba(20,17,13,0.06)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{resultNotOnLigo} Contacts</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', marginTop: 2 }}>SMS & email invitations queued</div>
              </div>
              <div style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(20,17,13,0.06)', padding: '4px 12px', borderRadius: 20 }}>
                SMS Dispatch
              </div>
            </div>
            {resultAlreadyMembers > 0 && (
              <div style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'rgba(20,17,13,0.4)' }}>{resultAlreadyMembers} Contacts</div>
                  <div style={{ fontSize: 12, color: 'rgba(20,17,13,0.4)' }}>Already active in chapter</div>
                </div>
                <div style={{ color: 'rgba(20,17,13,0.45)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(20,17,13,0.04)', padding: '4px 10px', borderRadius: 20 }}>
                  Deduplicated
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep('sending')}
            style={{
              width: '100%',
              padding: 18,
              borderRadius: 16,
              background: 'var(--ink)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              marginTop: 'auto',
              boxShadow: '0 8px 24px rgba(20,17,13,0.15)',
            }}
          >
            Import Roster & Send {resultOnLigo + resultNotOnLigo} Invites
          </button>
        </div>
      )}

      {step === 'upload-done' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 68, height: 68, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 24, boxShadow: '0 8px 24px rgba(22,163,74,0.25)' }}>
            <EVI.Check style={{ width: 36, height: 36 }} />
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 500, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 12 }}>
            Roster Uploaded.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(20,17,13,0.6)', lineHeight: 1.45, marginBottom: 28 }}>
            <strong>{rosterMock.rowCount} contacts</strong> imported into {clubName}. {rosterMock.onLigo} members are active on Ligo and {rosterMock.notOnLigo} invitations have been dispatched.
          </p>

          <div style={{ background: '#fff', borderRadius: 16, padding: 18, border: '1px solid rgba(20,17,13,0.08)', marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)', marginBottom: 6 }}>
              Fall 2026 Rush List Ready
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.4 }}>
              You can now blast invites and manage attendance for <strong>Champagne & Shackles</strong> and upcoming rush events directly to this list.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
            <button
              onClick={leave}
              style={{
                width: '100%',
                padding: 18,
                borderRadius: 16,
                background: 'var(--ink)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Done · Return to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
