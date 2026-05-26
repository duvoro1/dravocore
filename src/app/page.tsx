"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Bell, ArrowRight, ExternalLink } from "lucide-react";

const C = {
  bg: "#0a0a0b", surface: "#131517", border: "#1e2024", borderL: "#2a2d32",
  steel: "#7e8b98", graphite: "#363a41", ice: "#e2e9f2", white: "#fff", blue: "#6b7a8d",
};
const EASE = [0.16, 1, 0.3, 1];
const MORPH_WORDS = ["Building", "Software", "Automation", "Systems", "Experiences", "The Future"];
const FONT = `'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif`;

const ROLES = [
  { num: "01", title: "Marketing \u2022 SEO \u2022 Social Media \u2022 Growth", items: ["Marketing", "SEO", "Social Media", "Growth Strategy"] },
  { num: "02", title: "Graphic Designer \u2022 3D Artist \u2022 Illustrator", items: ["Graphic Designer", "3D Artist", "Illustrator", "UI / Brand Designer"] },
];

/* ═══════════════ LOGO (uses actual image file) ═══════════════ */
function DravoLogoImg({ height = 36 }) {
  return (
    <img
      src="/logo/dravo-dark.png"
      alt="Dravo"
      style={{ height, width: "auto", objectFit: "contain" }}
      draggable={false}
    />
  );
}

/* SVG fallback logo (used if images not yet placed) */
function DravoLogoSVG({ size = 32 }) {
  const s = size / 5;
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom-left square with "0" */}
      <rect x="0" y="30" width="18" height="18" rx="1" fill={C.steel} opacity="0.7" />
      <text x="5" y="43" fill={C.white} fontSize="8" fontFamily="monospace" fontWeight="700">0</text>
      {/* Center-left overlap square */}
      <rect x="10" y="20" width="18" height="18" rx="1" fill={C.graphite} opacity="0.85" />
      {/* Top-right square with "1" */}
      <rect x="20" y="2" width="18" height="18" rx="1" fill={C.steel} opacity="0.55" />
      <text x="29" y="14" fill={C.white} fontSize="8" fontFamily="monospace" fontWeight="700">1</text>
      {/* Center-right white square */}
      <rect x="20" y="20" width="18" height="18" rx="1" fill={C.ice} opacity="0.3" />
      {/* Bottom-right dark square */}
      <rect x="30" y="30" width="18" height="18" rx="1" fill={C.white} opacity="0.15" />
    </svg>
  );
}

/* Unified Logo component: tries image, falls back to SVG */
function DravoLogo({ height = 36, showWordmark = true }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {imgError ? (
        <DravoLogoSVG size={height} />
      ) : (
        <img
          src="/logo/dravo-dark.png"
          alt="Dravo"
          style={{ height, width: "auto", objectFit: "contain" }}
          draggable={false}
          onError={() => setImgError(true)}
        />
      )}
      {showWordmark && (
        <span style={{ fontSize: height * 0.78, fontWeight: 700, letterSpacing: "-0.03em", color: C.white, fontFamily: FONT }}>
          dravo
        </span>
      )}
    </div>
  );
}

/* ═══════════════ GRAIN ═══════════════ */
function Grain() {
  return <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.03, mixBlendMode: "overlay",
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: "128px",
  }} />;
}

/* ═══════════════ ANIMATED GRID ═══════════════ */
function AnimatedGrid() {
  return (
    <motion.div
      animate={{ opacity: [0.025, 0.045, 0.025] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={C.white} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
    </motion.div>
  );
}

/* ═══════════════ FLOATING SQUARES ═══════════════ */
/* Deterministic positions to avoid SSR/client hydration mismatch (no Math.random) */
const SQUARES = [
  { id: 0, size: 72,  x: 12, y: 18, dur: 24, delay: 0.5, rot: 8 },
  { id: 1, size: 48,  x: 78, y: 12, dur: 28, delay: 2.0, rot: 22 },
  { id: 2, size: 96,  x: 55, y: 72, dur: 32, delay: 1.0, rot: 40 },
  { id: 3, size: 38,  x: 25, y: 85, dur: 22, delay: 3.5, rot: 15 },
  { id: 4, size: 84,  x: 88, y: 45, dur: 26, delay: 0.0, rot: 52 },
  { id: 5, size: 56,  x: 42, y: 32, dur: 30, delay: 4.0, rot: 5 },
  { id: 6, size: 64,  x: 68, y: 88, dur: 34, delay: 1.5, rot: 35 },
  { id: 7, size: 44,  x: 8,  y: 55, dur: 25, delay: 5.0, rot: 28 },
];
function FloatingSquares() {
  const squares = SQUARES;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {squares.map(sq => (
        <motion.div key={sq.id}
          animate={{
            opacity: [0, 0.06, 0.025, 0.06, 0],
            y: [0, -40, 15, -25, 0], x: [0, 20, -15, 8, 0],
            rotate: [sq.rot, sq.rot + 20, sq.rot - 12, sq.rot + 8, sq.rot],
          }}
          transition={{ duration: sq.dur, repeat: Infinity, delay: sq.delay, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${sq.x}%`, top: `${sq.y}%`,
            width: sq.size, height: sq.size, border: `1px solid ${C.borderL}`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════ AMBIENT GRADIENTS ═══════════════ */
function AmbientLight() {
  return <>
    <motion.div
      animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.08, 1] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: "160%", height: "80%", pointerEvents: "none",
        background: `radial-gradient(ellipse at center, ${C.steel}12 0%, transparent 65%)`,
      }}
    />
    <motion.div
      animate={{ opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 700, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${C.blue}0a 0%, transparent 70%)`,
      }}
    />
  </>;
}

/* ═══════════════ CENTRAL GEOMETRIC VISUAL ═══════════════ */
function CenterVisual() {
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      width: 520, height: 520, pointerEvents: "none",
    }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${C.border}` }}>
        <div style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: C.steel, opacity: 0.5 }} />
      </motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 80, borderRadius: "50%", border: `1px solid ${C.border}80` }}>
        <div style={{ position: "absolute", bottom: -2, right: "20%", width: 4, height: 4, borderRadius: "50%", background: C.ice, opacity: 0.4 }} />
      </motion.div>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 160, borderRadius: "50%", border: `1px dashed ${C.border}60` }} />
      {[
        { x: "10%", y: "10%", s: 24, d: 0 }, { x: "80%", y: "15%", s: 16, d: 1.5 },
        { x: "85%", y: "78%", s: 20, d: 3 }, { x: "8%", y: "82%", s: 14, d: 4.5 },
      ].map((sq, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.08, 0.2, 0.08], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, delay: sq.d, ease: "easeInOut" }}
          style={{ position: "absolute", left: sq.x, top: sq.y, width: sq.s, height: sq.s, border: `1px solid ${C.steel}30` }}
        />
      ))}
      <motion.div
        animate={{ opacity: [0.04, 0.12, 0.04], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", inset: "30%", borderRadius: "50%", background: `radial-gradient(circle, ${C.steel}15 0%, transparent 70%)` }}
      />
    </div>
  );
}

/* ═══════════════ SVG TECH LINES ═══════════════ */
function TechLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.04 }}>
      <motion.line x1="0" y1="30%" x2="100%" y2="30%" stroke={C.steel} strokeWidth="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1.5, ease: EASE }} />
      <motion.line x1="0" y1="70%" x2="100%" y2="70%" stroke={C.steel} strokeWidth="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 2, ease: EASE }} />
      <motion.line x1="25%" y1="0" x2="25%" y2="100%" stroke={C.steel} strokeWidth="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, delay: 2.5, ease: EASE }} />
      <motion.line x1="75%" y1="0" x2="75%" y2="100%" stroke={C.steel} strokeWidth="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, delay: 3, ease: EASE }} />
    </svg>
  );
}

/* ═══════════════ MORPH HEADLINE (FIXED CLIPPING) ═══════════════ */
function MorphHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MORPH_WORDS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      /* FIX: use lineHeight-based height with padding so descenders (g, y, p) never clip */
      height: "clamp(64px, 10vw, 110px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "visible", /* FIX: no clipping */
      marginBottom: 12, position: "relative",
    }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={MORPH_WORDS[idx]}
          initial={{ opacity: 0, y: 50, filter: "blur(18px)", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, y: -50, filter: "blur(18px)", scale: 0.9 }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{
            fontSize: "clamp(46px, 8vw, 92px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: C.white,
            lineHeight: 1.15, /* FIX: room for descenders */
            display: "block",
            textAlign: "center",
            fontFamily: FONT,
            padding: "4px 0 8px", /* FIX: extra bottom padding for g/y */
            position: "absolute",
          }}
        >
          {MORPH_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ REVEAL ═══════════════ */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: EASE }}
    >{children}</motion.div>
  );
}

/* ═══════════════ NOTIFY MODAL ═══════════════ */
function NotifyModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState("form");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    setPhase("sending");
    setTimeout(() => setPhase("done"), 1800);
  };

  useEffect(() => { if (!open) { setEmail(""); setPhase("form"); } }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(20px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 0.9, opacity: 0, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={e => e.stopPropagation()}
            style={{
              background: `${C.surface}e0`, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: "48px 40px", maxWidth: 440, width: "100%",
              backdropFilter: "blur(40px)", position: "relative", overflow: "hidden",
            }}>
            {/* Ambient glow */}
            <div style={{
              position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
              width: 300, height: 200, borderRadius: "50%", pointerEvents: "none",
              background: `radial-gradient(circle, ${C.steel}15 0%, transparent 70%)`,
            }} />

            <AnimatePresence mode="wait">
              {phase === "form" && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }} style={{ position: "relative", zIndex: 1 }}>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5, ease: EASE }}>
                    <h3 style={{ color: C.white, fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>Get Notified</h3>
                    <p style={{ color: C.steel, fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>Be the first to know when Dravo launches.</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: EASE }}>
                    <div style={{
                      position: "relative", marginBottom: 20,
                      border: `1px solid ${focused ? C.steel : C.border}`,
                      borderRadius: 12, transition: "border-color 0.3s", background: C.bg,
                    }}>
                      <input type="email" placeholder="you@email.com" value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                        style={{
                          width: "100%", padding: "16px 20px", background: "transparent",
                          border: "none", color: C.white, fontSize: 15, outline: "none",
                          fontFamily: FONT, boxSizing: "border-box",
                        }} />
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: EASE }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      style={{
                        width: "100%", padding: "15px", background: C.white, color: C.bg,
                        border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600,
                        cursor: "pointer", fontFamily: FONT,
                      }}>Subscribe</motion.button>
                  </motion.div>
                </motion.div>
              )}
              {phase === "sending" && (
                <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", position: "relative", zIndex: 1 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.white, marginBottom: 20 }} />
                  <span style={{ color: C.steel, fontSize: 14 }}>Subscribing...</span>
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ textAlign: "center", padding: "32px 0", position: "relative", zIndex: 1 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                    style={{
                      width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
                      background: `${C.graphite}60`, border: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.white,
                    }}>&#10003;</motion.div>
                  <h3 style={{ color: C.white, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>You're on the list</h3>
                  <p style={{ color: C.steel, fontSize: 14, lineHeight: 1.6 }}>We'll reach out when something powerful drops.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════ ROLE CARD ═══════════════ */
function RoleCard({ role, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={index * 0.15}>
      <motion.div
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -3 }} transition={{ duration: 0.4, ease: EASE }}
        style={{
          background: `${C.surface}90`, backdropFilter: "blur(16px)",
          border: `1px solid ${hovered ? C.borderL : C.border}`,
          borderRadius: 16, padding: "36px 32px", position: "relative", overflow: "hidden",
          cursor: "default", transition: "border-color 0.4s",
        }}>
        <motion.div animate={{ opacity: hovered ? 0.06 : 0 }} transition={{ duration: 0.4 }}
          style={{
            position: "absolute", top: -40, right: -40, width: 200, height: 200,
            borderRadius: "50%", background: `radial-gradient(circle, ${C.steel} 0%, transparent 70%)`, pointerEvents: "none",
          }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, position: "relative" }}>
          <span style={{ fontSize: 28, fontWeight: 300, color: C.steel, opacity: 0.5, fontFamily: "monospace" }}>{role.num}</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <div style={{ width: 8, height: 8, background: C.steel, opacity: 0.3 }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, lineHeight: 1.35, marginBottom: 20, letterSpacing: "-0.01em" }}>{role.title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {role.items.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 5, height: 5, background: C.steel, opacity: 0.5, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: C.steel, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ═══════════════ PARTICLE FLOW (above footer) ═══════════════ */
function ParticleFlow() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const COUNT = 60;
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * 2000,
          y: Math.random() * 400,
          vx: 0.15 + Math.random() * 0.4,
          vy: -0.1 + Math.random() * 0.2,
          size: 1 + Math.random() * 1.5,
          opacity: 0.08 + Math.random() * 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        // Wrap around
        if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const o = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 139, 152, ${o})`;
        ctx.fill();

        // Draw subtle connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(126, 139, 152, ${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {/* Top/bottom fade masks */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: `linear-gradient(${C.bg}, transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(transparent, ${C.bg})`, pointerEvents: "none" }} />
    </div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function DravoComingSoon() {
  const [modal, setModal] = useState(false);
  const hiringRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  const scrollToCareers = () => hiringRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ fontFamily: FONT, background: C.bg, color: C.white, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}body{background:${C.bg}}
        ::selection{background:${C.steel}40;color:${C.white}}
      `}</style>
      <Grain />
      <NotifyModal open={modal} onClose={() => setModal(false)} />

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <AnimatedGrid />
        <FloatingSquares />
        <AmbientLight />
        <CenterVisual />
        <TechLines />

        <motion.div style={{ y: heroParallax, position: "relative", zIndex: 10, maxWidth: 900, width: "100%", padding: "0 24px", textAlign: "center" }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}
          >
            <DravoLogo height={38} showWordmark={true} />
          </motion.div>

          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            style={{
              display: "inline-block", marginBottom: 40, padding: "8px 20px", borderRadius: 24,
              border: `1px solid ${C.border}`, background: `${C.surface}50`,
            }}>
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", color: C.steel, textTransform: "uppercase" }}>
              Built Bit By Bit
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 1, ease: EASE }}>
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 400, color: C.steel, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              Something powerful is coming
            </p>
          </motion.div>

          {/* MORPH HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.3, ease: EASE }}>
            <MorphHeadline />
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 1.7, ease: EASE }}
            style={{
              fontSize: "clamp(14px, 1.5vw, 17px)", lineHeight: 1.8, color: C.steel,
              maxWidth: 520, margin: "0 auto 48px", fontWeight: 400,
            }}>
            We're building a modern digital experience for the next generation of software, automation, and intelligent systems.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2, ease: EASE }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "14px 32px",
                background: C.white, color: C.bg, border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
              }}>
              <Bell size={15} /> Notify Me
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={scrollToCareers}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "14px 32px",
                background: "transparent", color: C.ice, border: `1px solid ${C.border}`,
                borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONT,
              }}>
              Careers <ArrowRight size={15} />
            </motion.button>
          </motion.div>
        </motion.div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, pointerEvents: "none", background: `linear-gradient(transparent, ${C.bg})` }} />
      </section>

      {/* ═══ HIRING ═══ */}
      <section ref={hiringRef} style={{ position: "relative", padding: "140px 24px 120px", maxWidth: 880, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
              color: C.steel, textTransform: "uppercase", marginBottom: 20,
              padding: "7px 16px", borderRadius: 24, border: `1px solid ${C.border}`,
            }}>Open Roles</span>
            <h2 style={{
              fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em",
              marginTop: 20, marginBottom: 16, color: C.white, lineHeight: 1.05,
            }}>We're Hiring</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: C.steel, maxWidth: 460, margin: "0 auto" }}>
              We're looking for creative and driven people to help build the future of Dravo.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 80 }}>
          {ROLES.map((role, i) => <RoleCard key={role.num} role={role} index={i} />)}
        </div>

        <Reveal delay={0.2}>
          <div style={{
            textAlign: "center", padding: "56px 36px", borderRadius: 20,
            border: `1px solid ${C.border}`, background: `${C.surface}30`,
            backdropFilter: "blur(12px)", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
              width: 400, height: 250, borderRadius: "50%", pointerEvents: "none",
              background: `radial-gradient(circle, ${C.steel}08 0%, transparent 70%)`,
            }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: C.white, position: "relative", letterSpacing: "-0.02em" }}>
              Interested in joining Dravo?
            </h3>
            <p style={{ fontSize: 14, color: C.steel, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.7, position: "relative" }}>
              Fill out the application form and our team will contact shortlisted candidates.
            </p>
            <motion.a href="https://forms.gle/3wHDefUQCmUKbcyH9" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 36px",
                background: C.white, color: C.bg, border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, textDecoration: "none", cursor: "pointer", position: "relative",
              }}>
              Apply Now <ExternalLink size={14} />
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ═══ PARTICLE FLOW (above footer) ═══ */}
      <Reveal>
        <ParticleFlow />
      </Reveal>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "0 24px 56px", maxWidth: 880, margin: "0 auto" }}>
        <div style={{ height: 1, background: C.border, marginBottom: 44 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DravoLogo height={22} showWordmark={false} />
            <span style={{ fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>dravo</span>
            <span style={{ fontSize: 10, color: C.steel, letterSpacing: "0.12em", marginLeft: 4, textTransform: "uppercase" }}>Built Bit By Bit</span>
          </div>
          <span style={{ fontSize: 12, color: `${C.steel}80` }}>&copy; {new Date().getFullYear()} Dravo Pvt. Ltd.</span>
        </div>
      </footer>
    </div>
  );
}