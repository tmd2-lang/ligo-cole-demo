# Cole demo — organizer walkthrough

Clickable prototype for **Cole Brennan** (Georgetown Program Board admin).  
Live: **[ligo-cole-demo.vercel.app](https://ligo-cole-demo.vercel.app)**

This build is **Events only** — locked to Cole. No Home, Profile, or user switcher.

---

## Before you start

1. Open the link (desktop phone frame is fine; on a real phone it’s full-screen).
2. You’re already Cole. Use the top tabs: **Explore · My Events · Clubs · Manage**.
3. Prefer **one browser tab**. Two tabs won’t sync live — refresh after you publish.

---

## Story in one line

Clubs don’t need another guest-list tool. They need: **invite people into the app → run the event → reach campus when it’s public.**

---

## Walkthrough

### 1. Open Manage
- Tap **Manage** → splash **“Running the board · GPB”**.
- You’re in **Event ops**: Overview · Events · Members.

### 2. Members / invite-to-app
- **Members** tab → roster with **On Ligo / Invited / Not on Ligo**.
- Quick action **Invite members** → Share / Text / Email / Upload roster.  
  Pitch: *people join Ligo, then join the org* — not “upload a darty guest list.”

### 3. Publish a members-only event (Kickoff)
- **Create event** → **Autofill Kickoff** → distribution **Members Only** → Publish.
- Dashboard: **Going / Pending / Declined**.
- Open **Group chat** (this event only) · **Send update** (one-way blast) · **View event**.

**Where Kickoff shows**
- ✅ Manage → Events (internal)
- ✅ Clubs → GPB → Events (for members)
- ❌ **Not** on Explore

### 4. Publish a campus event (Midnight Breakfast)
- Create → **Autofill Breakfast** → distribution **Georgetown** → Publish.

**Where Breakfast shows**
- ✅ **Explore**
- ✅ Manage → Events (campus / public)
- ✅ Clubs → GPB → Events → “Also hosting on campus”

### 5. Clubs (optional)
- **Clubs** → **Georgetown Program Board** → Chat / Events / People.
- **Open event ops** jumps into Manage without replaying the splash.

---

## Autofill buttons

| Button | Type | Use |
|--------|------|-----|
| **Autofill Kickoff** | Members only | Internal programming + event group chat |
| **Autofill Breakfast** | Georgetown / campus | Public Midnight Breakfast on Explore |

---

## Suggested 2-minute script

1. Manage → Members → “invite to Ligo, not guest list.”
2. Autofill Kickoff → publish → Group chat + Send update.
3. Autofill Breakfast → publish → Explore → Breakfast on the feed.
4. Line: *Members-only stays in the club. Campus-wide hits Explore.*

---

## What *not* to expect

- No Profile / Home / switching to Jordan — this repo is Cole-only.
- Two browser tabs won’t sync — refresh after publishing.
- Supabase isn’t required for this slice.
- Live Activity pill under the island is demo theater only.

---

## Bugs

Ping TJ or Micah with a screenshot. Hard-refresh if something looks stuck from an older local session.
