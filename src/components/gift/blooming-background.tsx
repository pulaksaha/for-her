"use client";

import React from "react";

// ─── Single petal SVG ─────────────────────────────────────────────────────────
function PetalSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 30 48" fill="none" aria-hidden="true">
      <path d="M15 47 C 1 36,-6 18,15 2 C 36 18,29 36,15 47 Z" fill={color} opacity="0.9" />
      <path d="M15 47 C15 32,15 14,15 2" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─── 28 falling petals ────────────────────────────────────────────────────────
const PETALS: Array<{
  left: string; dur: string; delay: string; size: number; color: string;
  cls: "petal-1" | "petal-2" | "petal-3"; opacity: number;
}> = [
  { left: "6%",  dur: "14s", delay: "0s",    size: 14, color: "#f5c2d5", cls: "petal-1", opacity: 0.75 },
  { left: "12%", dur: "11s", delay: "2.5s",  size: 10, color: "#e88aac", cls: "petal-2", opacity: 0.65 },
  { left: "19%", dur: "16s", delay: "0.8s",  size: 16, color: "#fce4ec", cls: "petal-3", opacity: 0.8  },
  { left: "25%", dur: "10s", delay: "4.2s",  size: 11, color: "#f0afc8", cls: "petal-1", opacity: 0.6  },
  { left: "31%", dur: "13s", delay: "1.5s",  size: 18, color: "#f5c2d5", cls: "petal-2", opacity: 0.7  },
  { left: "37%", dur: "9s",  delay: "6s",    size: 12, color: "#c890c8", cls: "petal-3", opacity: 0.55 },
  { left: "43%", dur: "15s", delay: "0.3s",  size: 20, color: "#fce4ec", cls: "petal-1", opacity: 0.75 },
  { left: "50%", dur: "12s", delay: "3s",    size: 13, color: "#e88aac", cls: "petal-2", opacity: 0.65 },
  { left: "56%", dur: "17s", delay: "1.2s",  size: 15, color: "#f5c2d5", cls: "petal-3", opacity: 0.7  },
  { left: "62%", dur: "11s", delay: "4.8s",  size: 11, color: "#c890c8", cls: "petal-1", opacity: 0.6  },
  { left: "68%", dur: "14s", delay: "2.1s",  size: 17, color: "#fce4ec", cls: "petal-2", opacity: 0.75 },
  { left: "74%", dur: "10s", delay: "5.5s",  size: 12, color: "#e88aac", cls: "petal-3", opacity: 0.65 },
  { left: "80%", dur: "16s", delay: "0.6s",  size: 19, color: "#f5c2d5", cls: "petal-1", opacity: 0.7  },
  { left: "86%", dur: "12s", delay: "3.5s",  size: 14, color: "#c890c8", cls: "petal-2", opacity: 0.6  },
  { left: "92%", dur: "9s",  delay: "1.8s",  size: 11, color: "#fce4ec", cls: "petal-3", opacity: 0.75 },
  { left: "4%",  dur: "18s", delay: "7s",    size: 12, color: "#f5c2d5", cls: "petal-2", opacity: 0.6  },
  { left: "10%", dur: "13s", delay: "8.2s",  size: 16, color: "#e88aac", cls: "petal-1", opacity: 0.65 },
  { left: "17%", dur: "11s", delay: "9s",    size: 10, color: "#fce4ec", cls: "petal-3", opacity: 0.7  },
  { left: "23%", dur: "15s", delay: "7.5s",  size: 14, color: "#c890c8", cls: "petal-2", opacity: 0.55 },
  { left: "35%", dur: "10s", delay: "6.5s",  size: 18, color: "#f5c2d5", cls: "petal-1", opacity: 0.7  },
  { left: "48%", dur: "14s", delay: "8.5s",  size: 13, color: "#e88aac", cls: "petal-3", opacity: 0.65 },
  { left: "60%", dur: "12s", delay: "9.5s",  size: 15, color: "#fce4ec", cls: "petal-2", opacity: 0.75 },
  { left: "72%", dur: "16s", delay: "7.2s",  size: 11, color: "#c890c8", cls: "petal-1", opacity: 0.6  },
  { left: "83%", dur: "11s", delay: "8.8s",  size: 17, color: "#f5c2d5", cls: "petal-3", opacity: 0.7  },
  { left: "95%", dur: "13s", delay: "6.8s",  size: 12, color: "#e88aac", cls: "petal-2", opacity: 0.65 },
  { left: "29%", dur: "15s", delay: "10s",   size: 16, color: "#fce4ec", cls: "petal-1", opacity: 0.7  },
  { left: "54%", dur: "11s", delay: "11s",   size: 13, color: "#c890c8", cls: "petal-2", opacity: 0.6  },
  { left: "77%", dur: "14s", delay: "10.5s", size: 15, color: "#f5c2d5", cls: "petal-3", opacity: 0.65 },
];

// ─── Star dots ─────────────────────────────────────────────────────────────────
const STARS = [
  { x: "8%",  y: "6%",  r: 1.2, opacity: 0.55 },
  { x: "15%", y: "12%", r: 0.9, opacity: 0.45 },
  { x: "22%", y: "4%",  r: 1.5, opacity: 0.6  },
  { x: "30%", y: "9%",  r: 0.8, opacity: 0.4  },
  { x: "38%", y: "3%",  r: 1.1, opacity: 0.5  },
  { x: "46%", y: "7%",  r: 1.3, opacity: 0.55 },
  { x: "53%", y: "2%",  r: 0.9, opacity: 0.45 },
  { x: "61%", y: "10%", r: 1.4, opacity: 0.6  },
  { x: "69%", y: "5%",  r: 1.0, opacity: 0.5  },
  { x: "77%", y: "8%",  r: 1.2, opacity: 0.55 },
  { x: "84%", y: "3%",  r: 0.8, opacity: 0.4  },
  { x: "91%", y: "11%", r: 1.3, opacity: 0.5  },
  { x: "5%",  y: "18%", r: 0.9, opacity: 0.35 },
  { x: "19%", y: "22%", r: 1.0, opacity: 0.4  },
  { x: "34%", y: "16%", r: 0.7, opacity: 0.35 },
  { x: "49%", y: "14%", r: 1.1, opacity: 0.45 },
  { x: "65%", y: "20%", r: 0.8, opacity: 0.38 },
  { x: "80%", y: "15%", r: 1.2, opacity: 0.42 },
  { x: "95%", y: "19%", r: 0.9, opacity: 0.38 },
  { x: "12%", y: "26%", r: 0.7, opacity: 0.3  },
  { x: "43%", y: "24%", r: 0.8, opacity: 0.35 },
  { x: "71%", y: "28%", r: 0.7, opacity: 0.3  },
];

export function BloomingBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Deep rose ambient glow ─────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 110% 65% at 50% 115%, rgba(180,55,95,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 55% 40% at 18% 22%, rgba(200,125,185,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 82% 18%, rgba(220,95,135,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 50% 8%, rgba(180,100,200,0.07) 0%, transparent 55%)
          `,
        }}
      />

      {/* ── Starfield ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.x,
              top: s.y,
              width: `${s.r * 2}px`,
              height: `${s.r * 2}px`,
              background: "white",
              opacity: s.opacity,
              boxShadow: `0 0 ${s.r * 4}px ${s.r * 2}px rgba(255,200,220,0.4)`,
              animation: `rose-glow-pulse ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* ── Cherry blossom tree ────────────────────────────────────── */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax meet"
        className="absolute bottom-0 left-0 w-full"
        style={{ minHeight: "72vh", maxHeight: "92vh", opacity: 0.88 }}
        aria-hidden="true"
      >
        <defs>
          {/* Blossom glow */}
          <filter id="bg-blossom-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Soft branch shadow */}
          <filter id="bg-branch-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#150506" floodOpacity="0.5" />
          </filter>
          {/* Trunk gradient */}
          <linearGradient id="bg-trunk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e0a08" />
            <stop offset="35%" stopColor="#4a2214" />
            <stop offset="65%" stopColor="#5c2e1a" />
            <stop offset="100%" stopColor="#1a0806" />
          </linearGradient>
          <linearGradient id="bg-branch" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2a1208" />
            <stop offset="50%" stopColor="#3d1e0e" />
            <stop offset="100%" stopColor="#1e0c06" />
          </linearGradient>
        </defs>

        {/* ════ ROOTS ════ */}
        <path d="M718 900 C 685 875, 640 860, 590 870" stroke="#1e0a08" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M722 900 C 758 875, 805 862, 855 872" stroke="#1e0a08" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M716 900 C 680 880, 645 870, 610 880" stroke="#150706" strokeWidth="8"  fill="none" strokeLinecap="round" opacity="0.5"/>

        {/* ════ TRUNK ════ */}
        {/* Shadow / depth pass */}
        <path
          d="M 710 900 C 707 840,703 760,700 680 C 697 600,695 540,694 480"
          stroke="#150808" strokeWidth="44" fill="none" strokeLinecap="round" opacity="0.45"
        />
        {/* Main trunk */}
        <path
          d="M 720 900 C 718 840,713 760,708 680 C 703 600,699 540,698 480"
          stroke="url(#bg-trunk)" strokeWidth="38" fill="none" strokeLinecap="round"
        />
        {/* Highlight */}
        <path
          d="M 726 900 C 724 840,720 758,716 678 C 712 598,709 538,708 480"
          stroke="#7a3a20" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.28"
        />

        {/* ════ FAR-LEFT BRANCH ════ */}
        <path
          d="M 702 590 C 638 548,520 475,400 385 C 318 322,242 262,168 188"
          stroke="url(#bg-branch)" strokeWidth="24" fill="none" strokeLinecap="round"
          filter="url(#bg-branch-shadow)"
        />
        {/* Sub-branch L1a */}
        <path d="M 168 188 C 142 162,118 140,96 112" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Sub-branch L1b */}
        <path d="M 168 188 C 195 160,214 136,228 108" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Twig */}
        <path d="M 295 312 C 258 278,218 246,185 212" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 96 112 C 82 95,70 78,60 58"    stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>
        <path d="M 228 108 C 240 88,248 70,252 50"  stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>

        {/* ════ LEFT-CENTER BRANCH ════ */}
        <path
          d="M 700 525 C 648 482,578 438,504 373 C 438 315,382 258,342 192"
          stroke="url(#bg-branch)" strokeWidth="20" fill="none" strokeLinecap="round"
          filter="url(#bg-branch-shadow)"
        />
        <path d="M 342 192 C 314 164,288 140,268 110" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 342 192 C 370 162,398 138,418 108" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 435 292 C 402 258,375 228,358 195" stroke="#2a1208" strokeWidth="8"  fill="none" strokeLinecap="round"/>
        <path d="M 268 110 C 255 88, 244 68,238 46"   stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>
        <path d="M 418 108 C 432 86, 442 66,448 44"   stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>

        {/* ════ CENTER-LEFT BRANCH ════ */}
        <path
          d="M 699 492 C 672 446,633 388,598 308 C 570 245,550 192,534 128"
          stroke="url(#bg-branch)" strokeWidth="17" fill="none" strokeLinecap="round"
          filter="url(#bg-branch-shadow)"
        />
        <path d="M 534 128 C 512 98, 494 72,480 42"  stroke="#2a1208" strokeWidth="8"  fill="none" strokeLinecap="round"/>
        <path d="M 534 128 C 558 97, 578 72,594 42"  stroke="#2a1208" strokeWidth="8"  fill="none" strokeLinecap="round"/>
        <path d="M 578 222 C 552 190,535 162,528 132" stroke="#2a1208" strokeWidth="7"  fill="none" strokeLinecap="round"/>
        <path d="M 578 222 C 606 190,628 165,648 138" stroke="#2a1208" strokeWidth="7"  fill="none" strokeLinecap="round"/>
        <path d="M 480 42  C 472 22, 466 8, 464 -5"  stroke="#200e06" strokeWidth="4"  fill="none" strokeLinecap="round"/>
        <path d="M 594 42  C 604 22, 610 8, 614 -5"  stroke="#200e06" strokeWidth="4"  fill="none" strokeLinecap="round"/>

        {/* ════ CENTER-RIGHT BRANCH ════ */}
        <path
          d="M 722 492 C 750 446,790 388,842 308 C 870 245,890 192,906 128"
          stroke="url(#bg-branch)" strokeWidth="17" fill="none" strokeLinecap="round"
          filter="url(#bg-branch-shadow)"
        />
        <path d="M 906 128 C 884 98, 866 72,852 42"  stroke="#2a1208" strokeWidth="8"  fill="none" strokeLinecap="round"/>
        <path d="M 906 128 C 930 97, 950 72,966 42"  stroke="#2a1208" strokeWidth="8"  fill="none" strokeLinecap="round"/>
        <path d="M 862 222 C 836 190,816 165,795 138" stroke="#2a1208" strokeWidth="7"  fill="none" strokeLinecap="round"/>
        <path d="M 862 222 C 890 190,912 165,932 138" stroke="#2a1208" strokeWidth="7"  fill="none" strokeLinecap="round"/>
        <path d="M 852 42  C 844 22, 838 8, 836 -5"  stroke="#200e06" strokeWidth="4"  fill="none" strokeLinecap="round"/>
        <path d="M 966 42  C 976 22, 982 8, 986 -5"  stroke="#200e06" strokeWidth="4"  fill="none" strokeLinecap="round"/>

        {/* ════ RIGHT-CENTER BRANCH ════ */}
        <path
          d="M 740 525 C 796 482,868 438,938 373 C 1002 315,1060 258,1098 192"
          stroke="url(#bg-branch)" strokeWidth="20" fill="none" strokeLinecap="round"
          filter="url(#bg-branch-shadow)"
        />
        <path d="M 1098 192 C 1070 163,1044 138,1022 108" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 1098 192 C 1124 163,1152 140,1172 108" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 1005 290 C 974 256,948 226,932 194"    stroke="#2a1208" strokeWidth="8"  fill="none" strokeLinecap="round"/>
        <path d="M 1022 108 C 1008 86,996 66,990 44"      stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>
        <path d="M 1172 108 C 1186 86,1196 66,1202 44"    stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>

        {/* ════ FAR-RIGHT BRANCH ════ */}
        <path
          d="M 758 590 C 822 548,942 475,1062 385 C 1142 322,1218 262,1272 188"
          stroke="url(#bg-branch)" strokeWidth="24" fill="none" strokeLinecap="round"
          filter="url(#bg-branch-shadow)"
        />
        <path d="M 1272 188 C 1248 161,1225 138,1205 112" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 1272 188 C 1298 160,1318 136,1330 108" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 1150 268 C 1196 230,1238 198,1262 165" stroke="#2a1208" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 1205 112 C 1192 94, 1180 76,1172 56"  stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>
        <path d="M 1330 108 C 1342 88, 1350 70,1356 50"  stroke="#251006" strokeWidth="5"  fill="none" strokeLinecap="round"/>

        {/* ══════════════════════════════════════════════════════════════
            BLOSSOM CLUSTERS — glow halos first, then opaque circles
            ══════════════════════════════════════════════════════════════ */}
        <g filter="url(#bg-blossom-glow)">
          {/* Far-left cluster */}
          <circle cx="165"  cy="182" r="58" fill="#f5c2d5" opacity="0.38"/>
          <circle cx="228"  cy="114" r="46" fill="#e88aac" opacity="0.36"/>
          <circle cx="98"   cy="118" r="42" fill="#fce4ec" opacity="0.34"/>
          <circle cx="252"  cy="52"  r="36" fill="#f5c2d5" opacity="0.32"/>

          {/* Left-center cluster */}
          <circle cx="342"  cy="188" r="52" fill="#fce4ec" opacity="0.38"/>
          <circle cx="268"  cy="106" r="44" fill="#e88aac" opacity="0.35"/>
          <circle cx="420"  cy="106" r="42" fill="#f5c2d5" opacity="0.35"/>
          <circle cx="238"  cy="48"  r="34" fill="#fce4ec" opacity="0.3" />
          <circle cx="450"  cy="46"  r="34" fill="#f5c2d5" opacity="0.3" />

          {/* Center-left cluster */}
          <circle cx="534"  cy="122" r="58" fill="#fce4ec" opacity="0.4" />
          <circle cx="480"  cy="44"  r="44" fill="#f5c2d5" opacity="0.37"/>
          <circle cx="596"  cy="44"  r="44" fill="#e88aac" opacity="0.37"/>
          <circle cx="528"  cy="222" r="36" fill="#c890c8" opacity="0.28"/>
          <circle cx="648"  cy="140" r="36" fill="#fce4ec" opacity="0.3" />

          {/* Center-right cluster */}
          <circle cx="908"  cy="122" r="58" fill="#fce4ec" opacity="0.4" />
          <circle cx="854"  cy="44"  r="44" fill="#f5c2d5" opacity="0.37"/>
          <circle cx="968"  cy="44"  r="44" fill="#e88aac" opacity="0.37"/>
          <circle cx="796"  cy="140" r="36" fill="#fce4ec" opacity="0.3" />
          <circle cx="932"  cy="140" r="36" fill="#c890c8" opacity="0.28"/>

          {/* Right-center cluster */}
          <circle cx="1098" cy="188" r="52" fill="#fce4ec" opacity="0.38"/>
          <circle cx="1024" cy="106" r="44" fill="#e88aac" opacity="0.35"/>
          <circle cx="1174" cy="106" r="42" fill="#f5c2d5" opacity="0.35"/>
          <circle cx="992"  cy="46"  r="34" fill="#f5c2d5" opacity="0.3" />
          <circle cx="1204" cy="46"  r="34" fill="#fce4ec" opacity="0.3" />

          {/* Far-right cluster */}
          <circle cx="1272" cy="182" r="58" fill="#f5c2d5" opacity="0.38"/>
          <circle cx="1208" cy="114" r="46" fill="#e88aac" opacity="0.36"/>
          <circle cx="1332" cy="110" r="42" fill="#fce4ec" opacity="0.34"/>
          <circle cx="1174" cy="58"  r="36" fill="#f5c2d5" opacity="0.3" />
          <circle cx="1358" cy="52"  r="34" fill="#fce4ec" opacity="0.3" />
        </g>

        {/* ─── Opaque blossom details ─────────────────────────────────── */}
        {/* Far-left */}
        <circle cx="160"  cy="180" r="26" fill="#fce4ec" opacity="0.72"/>
        <circle cx="180"  cy="158" r="20" fill="#f5c2d5" opacity="0.68"/>
        <circle cx="140"  cy="162" r="18" fill="#e8b4c8" opacity="0.62"/>
        <circle cx="222"  cy="116" r="22" fill="#fce4ec" opacity="0.7" />
        <circle cx="200"  cy="134" r="17" fill="#f5c2d5" opacity="0.65"/>
        <circle cx="100"  cy="122" r="20" fill="#e88aac" opacity="0.6" />
        <circle cx="84"   cy="140" r="14" fill="#fce4ec" opacity="0.56"/>
        <circle cx="248"  cy="54"  r="16" fill="#f5c2d5" opacity="0.62"/>
        <circle cx="62"   cy="60"  r="12" fill="#e88aac" opacity="0.5" />

        {/* Left-center */}
        <circle cx="344"  cy="190" r="24" fill="#fce4ec" opacity="0.7" />
        <circle cx="320"  cy="172" r="18" fill="#f5c2d5" opacity="0.65"/>
        <circle cx="366"  cy="172" r="18" fill="#e8b4c8" opacity="0.62"/>
        <circle cx="270"  cy="108" r="21" fill="#fce4ec" opacity="0.68"/>
        <circle cx="252"  cy="125" r="15" fill="#f5c2d5" opacity="0.62"/>
        <circle cx="420"  cy="106" r="21" fill="#e88aac" opacity="0.65"/>
        <circle cx="400"  cy="122" r="15" fill="#fce4ec" opacity="0.6" />
        <circle cx="240"  cy="50"  r="14" fill="#f5c2d5" opacity="0.6" />
        <circle cx="452"  cy="48"  r="14" fill="#fce4ec" opacity="0.6" />

        {/* Center-left */}
        <circle cx="534"  cy="125" r="28" fill="#fce4ec" opacity="0.74"/>
        <circle cx="512"  cy="104" r="20" fill="#f5c2d5" opacity="0.7" />
        <circle cx="558"  cy="103" r="20" fill="#e8b4c8" opacity="0.67"/>
        <circle cx="482"  cy="46"  r="22" fill="#fce4ec" opacity="0.7" />
        <circle cx="462"  cy="62"  r="16" fill="#f5c2d5" opacity="0.64"/>
        <circle cx="598"  cy="44"  r="22" fill="#e88aac" opacity="0.68"/>
        <circle cx="618"  cy="60"  r="16" fill="#fce4ec" opacity="0.62"/>
        <circle cx="526"  cy="78"  r="16" fill="#c890c8" opacity="0.6" />
        <circle cx="648"  cy="142" r="15" fill="#e88aac" opacity="0.58"/>
        <circle cx="468"  cy="0"   r="12" fill="#fce4ec" opacity="0.55"/>
        <circle cx="616"  cy="0"   r="12" fill="#f5c2d5" opacity="0.55"/>

        {/* Center-right */}
        <circle cx="908"  cy="125" r="28" fill="#fce4ec" opacity="0.74"/>
        <circle cx="884"  cy="104" r="20" fill="#f5c2d5" opacity="0.7" />
        <circle cx="934"  cy="103" r="20" fill="#e8b4c8" opacity="0.67"/>
        <circle cx="856"  cy="46"  r="22" fill="#fce4ec" opacity="0.7" />
        <circle cx="836"  cy="62"  r="16" fill="#f5c2d5" opacity="0.64"/>
        <circle cx="968"  cy="44"  r="22" fill="#e88aac" opacity="0.68"/>
        <circle cx="988"  cy="60"  r="16" fill="#fce4ec" opacity="0.62"/>
        <circle cx="798"  cy="142" r="15" fill="#e88aac" opacity="0.58"/>
        <circle cx="914"  cy="78"  r="16" fill="#c890c8" opacity="0.6" />
        <circle cx="840"  cy="0"   r="12" fill="#fce4ec" opacity="0.55"/>
        <circle cx="984"  cy="0"   r="12" fill="#f5c2d5" opacity="0.55"/>

        {/* Right-center */}
        <circle cx="1100" cy="190" r="24" fill="#fce4ec" opacity="0.7" />
        <circle cx="1076" cy="172" r="18" fill="#f5c2d5" opacity="0.65"/>
        <circle cx="1122" cy="172" r="18" fill="#e8b4c8" opacity="0.62"/>
        <circle cx="1026" cy="106" r="21" fill="#fce4ec" opacity="0.68"/>
        <circle cx="1006" cy="123" r="15" fill="#f5c2d5" opacity="0.62"/>
        <circle cx="1174" cy="106" r="21" fill="#e88aac" opacity="0.65"/>
        <circle cx="1154" cy="122" r="15" fill="#fce4ec" opacity="0.6" />
        <circle cx="994"  cy="48"  r="14" fill="#f5c2d5" opacity="0.6" />
        <circle cx="1206" cy="48"  r="14" fill="#fce4ec" opacity="0.6" />

        {/* Far-right */}
        <circle cx="1270" cy="180" r="26" fill="#fce4ec" opacity="0.72"/>
        <circle cx="1248" cy="158" r="20" fill="#f5c2d5" opacity="0.68"/>
        <circle cx="1290" cy="158" r="18" fill="#e8b4c8" opacity="0.62"/>
        <circle cx="1210" cy="115" r="22" fill="#fce4ec" opacity="0.7" />
        <circle cx="1190" cy="132" r="17" fill="#f5c2d5" opacity="0.64"/>
        <circle cx="1332" cy="112" r="20" fill="#e88aac" opacity="0.65"/>
        <circle cx="1312" cy="128" r="15" fill="#fce4ec" opacity="0.6" />
        <circle cx="1176" cy="60"  r="15" fill="#f5c2d5" opacity="0.6" />
        <circle cx="1358" cy="54"  r="14" fill="#fce4ec" opacity="0.58"/>

        {/* Mid-branch accent blooms */}
        <circle cx="400"  cy="386" r="18" fill="#fce4ec" opacity="0.45"/>
        <circle cx="504"  cy="375" r="16" fill="#f5c2d5" opacity="0.42"/>
        <circle cx="248"  cy="270" r="16" fill="#e88aac" opacity="0.4" />
        <circle cx="936"  cy="376" r="18" fill="#fce4ec" opacity="0.45"/>
        <circle cx="840"  cy="314" r="16" fill="#f5c2d5" opacity="0.42"/>
        <circle cx="1192" cy="270" r="16" fill="#e88aac" opacity="0.4" />
        <circle cx="640"  cy="312" r="14" fill="#c890c8" opacity="0.38"/>
        <circle cx="800"  cy="314" r="14" fill="#c890c8" opacity="0.38"/>

        {/* Individual petals clinging to tips — small ellipses */}
        <ellipse cx="148"  cy="168" rx="6" ry="4" fill="#f5c2d5" opacity="0.7"  transform="rotate(-28,148,168)"/>
        <ellipse cx="196"  cy="142" rx="5" ry="3.5" fill="#e88aac" opacity="0.65" transform="rotate(14,196,142)"/>
        <ellipse cx="508"  cy="106" rx="6" ry="4" fill="#f5c2d5" opacity="0.7"  transform="rotate(22,508,106)"/>
        <ellipse cx="558"  cy="82"  rx="5" ry="3.5" fill="#e88aac" opacity="0.65" transform="rotate(-16,558,82)"/>
        <ellipse cx="476"  cy="52"  rx="5" ry="3.5" fill="#fce4ec" opacity="0.6"  transform="rotate(5,476,52)"/>
        <ellipse cx="892"  cy="106" rx="6" ry="4" fill="#f5c2d5" opacity="0.7"  transform="rotate(-22,892,106)"/>
        <ellipse cx="948"  cy="52"  rx="5" ry="3.5" fill="#e88aac" opacity="0.65" transform="rotate(16,948,52)"/>
        <ellipse cx="1258" cy="166" rx="6" ry="4" fill="#f5c2d5" opacity="0.7"  transform="rotate(20,1258,166)"/>
        <ellipse cx="1336" cy="114" rx="5" ry="3.5" fill="#e88aac" opacity="0.62" transform="rotate(-12,1336,114)"/>
      </svg>

      {/* ── Falling petals ────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className={`petal ${p.cls}`}
            style={{
              left: p.left,
              top: "-36px",
              opacity: p.opacity,
              "--dur":   p.dur,
              "--delay": p.delay,
              position: "absolute",
            } as React.CSSProperties}
          >
            <PetalSVG size={p.size} color={p.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
