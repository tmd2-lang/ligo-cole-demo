/* Demo view tailored for Cole (Events & Profile only) */
"use client";

import { useState } from "react";
import { IOSDevice } from "@/components/IOSDevice";
import { BottomNav, type NavId } from "@/components/BottomNav";
import { EventsScreen } from "@/components/EventsScreen";
import { ProfileV2Provider, ProfileV2Shell } from "@/components/profile/ProfileScreen";
import { ProfileGateProvider } from "@/lib/profileGate";
import { Icon } from "@/components/Primitives";

export default function ColeDemo() {
  const [nav, setNav] = useState<NavId>("profile");

  const isEvents = nav === "events";
  const isProfile = nav === "profile";

  // Only show Events and Profile tabs
  const DEMO_TABS = [
    { id: "events" as NavId, label: "Events", icon: Icon.Calendar },
    { id: "profile" as NavId, label: "Profile", icon: Icon.User },
  ];

  return (
    <main
      className="app-stage"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        padding: "40px 24px",
      }}
    >
      <div
        className="app-chrome"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <b style={{ color: "#F5D783", fontWeight: 600 }}>LIGO</b>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.25)",
          }}
        />
        Demo: Cole
      </div>

      <IOSDevice width={402} height={874} dark={false}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: "#FAFAF8",
            color: "#14110D",
            overflow: "hidden",
          }}
        >
          {isEvents ? (
            <>
              <div className="ligo-events" style={{ position: "absolute", inset: 0 }}>
                <EventsScreen onTab={setNav} overrideUserId="cole" />
              </div>
              <BottomNav active="events" onChange={setNav} items={DEMO_TABS} />
            </>
          ) : (
            <>
              <ProfileGateProvider>
                <ProfileV2Provider overrideUserId="cole">
                  <ProfileV2Shell />
                </ProfileV2Provider>
              </ProfileGateProvider>
              <BottomNav active="profile" onChange={setNav} items={DEMO_TABS} />
            </>
          )}
        </div>
      </IOSDevice>

      <div
        className="app-chrome"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
          maxWidth: 440,
          lineHeight: 1.5,
        }}
      >
        You are viewing the dedicated demo environment for Cole Brennan (GPB & SigEp).
      </div>
    </main>
  );
}
