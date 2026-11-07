import { useEffect, useRef } from 'react';

type RobotKind = 'humanoid' | 'quadruped' | 'drone' | 'arm' | 'rover';

const KINDS: RobotKind[] = ['humanoid', 'quadruped', 'drone', 'arm', 'rover'];

interface Robot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  excitement: number; // 0..1, spikes on touch
  hop: number; // vertical hop impulse
  hue: number;
  kind: RobotKind;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  life: number;
}

export default function RobotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const robots: Robot[] = [];
    const sparks: Spark[] = [];
    const rings: Ring[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedRobots() {
      robots.length = 0;
      const count = w < 640 ? 6 : 10;
      for (let i = 0; i < count; i++) {
        robots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.35,
          size: 14 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
          excitement: 0,
          hop: 0,
          hue: 185 + Math.random() * 60, // cyan -> blue range
          kind: KINDS[i % KINDS.length],
        });
      }
    }

    function burst(x: number, y: number, near: Robot | null) {
      rings.push({ x, y, r: 4, life: 1 });
      const colors = ['#0891b2', '#2563eb', '#7c3aed', '#059669'];
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
        const sp = 1.6 + Math.random() * 3.2;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          life: 1,
          max: 0.7 + Math.random() * 0.5,
          color: colors[i % colors.length],
        });
      }
      if (near) {
        near.excitement = 1;
        near.hop = 5 + Math.random() * 4;
        // scatter gently away from touch point
        const dx = near.x - x;
        const dy = near.y - y;
        const d = Math.max(1, Math.hypot(dx, dy));
        near.vx += (dx / d) * 0.9;
        near.vy += (dy / d) * 0.9;
      }
    }

    function onPointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onPointerDown(e: PointerEvent) {
      // nearest robot within 260px gets delighted by the touch
      let near: Robot | null = null;
      let best = 260;
      for (const r of robots) {
        const d = Math.hypot(r.x - e.clientX, r.y - e.clientY);
        if (d < best) {
          best = d;
          near = r;
        }
      }
      burst(e.clientX, e.clientY, near);
    }
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      onPointerDown({ clientX: t.clientX, clientY: t.clientY } as PointerEvent);
    }

    function drawRobot(r: Robot, t: number) {
      const bobAmp = r.kind === 'drone' ? 6 : 3;
      const bob = Math.sin(t * 0.002 + r.phase) * bobAmp;
      const hopY = -Math.sin(Math.min(1, r.hop / 10) * Math.PI) * r.hop * 2.2;
      const x = r.x;
      const y = r.y + bob + hopY;
      const s = r.size;
      const excite = r.excitement;

      const bodyAlpha = 0.34 + excite * 0.45;
      const stroke = `hsla(${r.hue}, 90%, 45%, ${bodyAlpha})`;
      const fill = 'rgba(255, 255, 255, 0.5)';
      const accentAlpha = 0.5 + excite * 0.45;
      const accent = `hsla(${r.hue}, 95%, 52%, ${accentAlpha})`;

      ctx!.save();
      ctx!.translate(x, y);
      const tilt = r.kind === 'arm' ? 0 : Math.max(-0.25, Math.min(0.25, r.vx * 0.3)) + excite * Math.sin(t * 0.02) * 0.18;
      ctx!.rotate(tilt);

      ctx!.lineWidth = 1.4;
      ctx!.lineCap = 'round';
      ctx!.strokeStyle = stroke;
      ctx!.fillStyle = fill;

      // shared: cursor-tracking gaze + walk gait
      const lookX = mouse.active ? Math.max(-1.4, Math.min(1.4, (mouse.x - x) / 90)) : 0;
      const lookY = mouse.active ? Math.max(-1, Math.min(1, (mouse.y - y) / 110)) : 0;
      const gait = Math.sin(t * 0.006 + r.phase);

      const head = (hx: number, hy: number, hw: number, hh: number, rad: number) => {
        ctx!.beginPath();
        ctx!.roundRect(hx, hy, hw, hh, rad);
        ctx!.fill();
        ctx!.stroke();
      };
      const eye = (ex: number, ey: number, er: number) => {
        ctx!.beginPath();
        ctx!.arc(ex, ey, er, 0, Math.PI * 2);
        ctx!.fillStyle = accent;
        ctx!.fill();
        ctx!.fillStyle = fill;
      };

      switch (r.kind) {
        case 'humanoid': {
          // head + visor eyes
          head(-s * 0.32, -s * 1.18, s * 0.64, s * 0.5, s * 0.16);
          eye(-s * 0.13 + lookX * 0.5, -s * 0.94 + lookY * 0.5, s * 0.06);
          eye(s * 0.13 + lookX * 0.5, -s * 0.94 + lookY * 0.5, s * 0.06);
          // torso + chest light
          head(-s * 0.4, -s * 0.62, s * 0.8, s * 0.88, s * 0.18);
          ctx!.beginPath();
          ctx!.arc(0, -s * 0.2, s * 0.1, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${r.hue}, 95%, 50%, ${0.35 + 0.3 * Math.sin(t * 0.004 + r.phase) + excite * 0.5})`;
          ctx!.fill();
          ctx!.fillStyle = fill;
          // arms: walk swing, wave when excited
          const wave = excite * Math.sin(t * 0.018 + r.phase) * 0.9;
          ctx!.lineWidth = 2;
          ctx!.beginPath();
          ctx!.moveTo(-s * 0.4, -s * 0.5);
          ctx!.lineTo(-s * 0.6, -s * 0.08 + gait * s * 0.12 - excite * s * 0.4 + wave * s * 0.15);
          ctx!.moveTo(s * 0.4, -s * 0.5);
          ctx!.lineTo(s * 0.6, -s * 0.08 - gait * s * 0.12 - excite * s * 0.4 - wave * s * 0.15);
          ctx!.stroke();
          // legs step in opposite phase
          ctx!.beginPath();
          ctx!.moveTo(-s * 0.18, s * 0.26);
          ctx!.lineTo(-s * 0.2 - gait * s * 0.14, s * 0.78);
          ctx!.moveTo(s * 0.18, s * 0.26);
          ctx!.lineTo(s * 0.2 + gait * s * 0.14, s * 0.78);
          ctx!.stroke();
          break;
        }
        case 'quadruped': {
          // body + head
          head(-s * 0.62, -s * 0.5, s * 1.24, s * 0.5, s * 0.16);
          head(s * 0.55, -s * 0.64, s * 0.42, s * 0.38, s * 0.1);
          eye(s * 0.76 + lookX * 0.4, -s * 0.46 + lookY * 0.4, s * 0.055);
          // four legs in diagonal gait pairs
          ctx!.lineWidth = 2;
          const hips = [-s * 0.45, -s * 0.15, s * 0.15, s * 0.45];
          ctx!.beginPath();
          for (let i = 0; i < 4; i++) {
            const swing = (i % 2 === 0 ? gait : -gait) * s * 0.14;
            ctx!.moveTo(hips[i], 0);
            ctx!.lineTo(hips[i] + swing, s * 0.55);
          }
          ctx!.stroke();
          // tail antenna
          ctx!.lineWidth = 1.4;
          ctx!.beginPath();
          ctx!.moveTo(-s * 0.62, -s * 0.4);
          ctx!.lineTo(-s * 0.82, -s * 0.68);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(-s * 0.84, -s * 0.72, 1.8 + excite * 1.4, 0, Math.PI * 2);
          ctx!.fillStyle = accent;
          ctx!.fill();
          break;
        }
        case 'drone': {
          // X frame arms to four rotors
          const corners = [
            [-s * 0.7, -s * 0.45],
            [s * 0.7, -s * 0.45],
            [-s * 0.7, s * 0.45],
            [s * 0.7, s * 0.45],
          ];
          ctx!.lineWidth = 1.6;
          ctx!.beginPath();
          for (const [cx, cy] of corners) {
            ctx!.moveTo(0, 0);
            ctx!.lineTo(cx, cy);
          }
          ctx!.stroke();
          // spinning blades (motion-blurred ellipses)
          for (let i = 0; i < 4; i++) {
            const [cx, cy] = corners[i];
            const dir = i % 2 === 0 ? 1 : -1;
            const spin = t * 0.045 * dir + r.phase;
            ctx!.save();
            ctx!.translate(cx, cy);
            ctx!.rotate(spin);
            ctx!.globalAlpha = 0.45;
            ctx!.beginPath();
            ctx!.ellipse(0, 0, s * 0.3, s * 0.07, 0, 0, Math.PI * 2);
            ctx!.strokeStyle = stroke;
            ctx!.stroke();
            ctx!.globalAlpha = 1;
            ctx!.restore();
            ctx!.beginPath();
            ctx!.arc(cx, cy, s * 0.06, 0, Math.PI * 2);
            ctx!.fillStyle = accent;
            ctx!.fill();
            ctx!.fillStyle = fill;
          }
          // body + camera gimbal
          head(-s * 0.28, -s * 0.2, s * 0.56, s * 0.4, s * 0.12);
          ctx!.beginPath();
          ctx!.arc(0, s * 0.26, s * 0.09, 0, Math.PI * 2);
          ctx!.fillStyle = accent;
          ctx!.fill();
          break;
        }
        case 'arm': {
          // base pedestal
          head(-s * 0.42, s * 0.3, s * 0.84, s * 0.3, s * 0.1);
          // two articulated segments sweeping slowly, faster when excited
          const a1 = -Math.PI / 2 - 0.55 + Math.sin(t * 0.0025 + r.phase) * (0.35 + excite * 0.4);
          const j1x = Math.cos(a1) * s * 0.85;
          const j1y = s * 0.3 + Math.sin(a1) * s * 0.85;
          const a2 = a1 + 1.9 + Math.sin(t * 0.0035 + r.phase) * (0.45 + excite * 0.5);
          const j2x = j1x + Math.cos(a2) * s * 0.65;
          const j2y = j1y + Math.sin(a2) * s * 0.65;
          ctx!.lineWidth = 2.4;
          ctx!.beginPath();
          ctx!.moveTo(0, s * 0.3);
          ctx!.lineTo(j1x, j1y);
          ctx!.lineTo(j2x, j2y);
          ctx!.stroke();
          // joints
          ctx!.lineWidth = 1.4;
          for (const [jx, jy] of [[j1x, j1y], [j2x, j2y]]) {
            ctx!.beginPath();
            ctx!.arc(jx, jy, s * 0.09, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.stroke();
          }
          // gripper fingers
          const gA = a2 + 0.6 + excite * Math.sin(t * 0.02) * 0.3;
          const gB = a2 - 0.6 - excite * Math.sin(t * 0.02) * 0.3;
          ctx!.lineWidth = 2;
          ctx!.beginPath();
          ctx!.moveTo(j2x, j2y);
          ctx!.lineTo(j2x + Math.cos(gA) * s * 0.24, j2y + Math.sin(gA) * s * 0.24);
          ctx!.moveTo(j2x, j2y);
          ctx!.lineTo(j2x + Math.cos(gB) * s * 0.24, j2y + Math.sin(gB) * s * 0.24);
          ctx!.stroke();
          break;
        }
        case 'rover': {
          // tread belt + wheel hubs
          head(-s * 0.62, s * 0.18, s * 1.24, s * 0.4, s * 0.2);
          ctx!.beginPath();
          for (const wx of [-s * 0.4, -s * 0.13, s * 0.13, s * 0.4]) {
            ctx!.moveTo(wx + s * 0.07, s * 0.38);
            ctx!.arc(wx, s * 0.38, s * 0.07, 0, Math.PI * 2);
          }
          ctx!.stroke();
          // chassis + sensor dome
          head(-s * 0.45, -s * 0.28, s * 0.9, s * 0.48, s * 0.14);
          ctx!.beginPath();
          ctx!.arc(0, -s * 0.28, s * 0.3, Math.PI, Math.PI * 2);
          ctx!.fill();
          ctx!.stroke();
          // tracking sensor eye
          eye(lookX * 0.6, -s * 0.42 + lookY * 0.4, s * 0.09);
          // antenna
          ctx!.beginPath();
          ctx!.moveTo(s * 0.18, -s * 0.52);
          ctx!.lineTo(s * 0.26, -s * 0.82);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(s * 0.27, -s * 0.86, 1.8 + excite * 1.4, 0, Math.PI * 2);
          ctx!.fillStyle = accent;
          ctx!.fill();
          break;
        }
      }

      ctx!.restore();
    }

    let raf = 0;
    let last = performance.now();

    function frame(t: number) {
      const dt = Math.min(2.5, (t - last) / 16.7);
      last = t;
      ctx!.clearRect(0, 0, w, h);

      for (const r of robots) {
        if (!reduced) {
          // curiosity: gentle pull toward the cursor when nearby
          if (mouse.active) {
            const dx = mouse.x - r.x;
            const dy = mouse.y - r.y;
            const d = Math.hypot(dx, dy);
            if (d < 240 && d > 24) {
              r.vx += (dx / d) * 0.012 * dt;
              r.vy += (dy / d) * 0.012 * dt;
            }
          }
          r.x += r.vx * dt;
          r.y += r.vy * dt;
          // soft speed cap + wander
          r.vx = Math.max(-0.9, Math.min(0.9, r.vx + (Math.random() - 0.5) * 0.02));
          r.vy = Math.max(-0.7, Math.min(0.7, r.vy + (Math.random() - 0.5) * 0.015));
          // wrap around edges
          if (r.x < -r.size * 2) r.x = w + r.size * 2;
          if (r.x > w + r.size * 2) r.x = -r.size * 2;
          if (r.y < -r.size * 2) r.y = h + r.size * 2;
          if (r.y > h + r.size * 2) r.y = -r.size * 2;
          r.excitement = Math.max(0, r.excitement - 0.008 * dt);
          r.hop = Math.max(0, r.hop - 0.35 * dt);
        }
        drawRobot(r, t);
      }

      // rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const g = rings[i];
        g.r += 3.4 * dt;
        g.life -= 0.03 * dt;
        if (g.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(8, 145, 178, ${g.life * 0.5})`;
        ctx!.lineWidth = 2 * g.life;
        ctx!.stroke();
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.08 * dt;
        p.life -= (1 / p.max) * 0.028 * dt;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = Math.max(0, p.life);
        ctx!.arc(p.x, p.y, 2.1 * p.life + 0.6, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    seedRobots();
    raf = requestAnimationFrame(frame);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-70" aria-hidden="true" />;
}
