# LIGO — Cole demo (GPB admin)

Organizer-only clickable mockup. Locked to **Cole Brennan**, admin of **Georgetown Program Board**.

**Live:** [ligo-cole-demo.vercel.app](https://ligo-cole-demo.vercel.app)

This is **not** the full Ligo app. No Home, no Profile, no profile switcher — just Events so you can run the organizer walkthrough.

---

## What to show

1. **Manage** → short “Running the board · GPB” splash → Event ops (Overview · Events · Members)
2. **Members / Invite members** → invite people *onto Ligo*, not a party guest list
3. **Create event → Autofill Kickoff** → Members Only → Publish → Group chat + Send update
4. **Create event → Autofill Breakfast** → Georgetown / campus → Publish → shows on Explore

Pitch line: *invite into the app → run the event → reach campus when it’s public.*

Longer click-path: **[docs/EVENTS_MOCKUP_GUIDE.md](docs/EVENTS_MOCKUP_GUIDE.md)**

---

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On phone, the fake device chrome drops and the UI goes full-bleed.

---

## Notes

- Scripted Georgetown demo data — not a real backend
- Hard-refresh if something looks stuck from an older browser session
- Full app / member path (Jordan, Clubs, Pass–I’m In) lives in the main events mockup repos, not here
