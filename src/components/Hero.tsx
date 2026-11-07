import { useEffect, useState } from 'react';
import { Zap, ChevronRight, Sliders, Play, Pause, RotateCw } from 'lucide-react';
import { Section, GradientText, PrimaryButton, GhostButton, GlassCard, StatusDot } from './ui';

const GOALS = [
  'Smarter Factories',
  'Autonomous Logistics',
  'Precision Agriculture',
  'Safer Healthcare',
  'Clean Energy at Scale',
  'Resilient Infrastructure',
];

export default function Hero() {
  const [armAngle, setArmAngle] = useState<number>(45);
  const [gripperOpen, setGripperOpen] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [goalIndex, setGoalIndex] = useState<number>(0);
  const [telemetry, setTelemetry] = useState({ speed: 2.4, temperature: 36.2, visionLatency: 4.8 });

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTelemetry({
        speed: +(2.0 + Math.random() * 0.8).toFixed(2),
        temperature: +(35.8 + Math.random() * 1.4).toFixed(1),
        visionLatency: +(4.2 + Math.random() * 1.2).toFixed(1),
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Rotate through the company goals in the headline
  useEffect(() => {
    const interval = setInterval(() => {
      setGoalIndex((i) => (i + 1) % GOALS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="home" className="pt-14 sm:pt-20 pb-10 sm:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-100/80 border border-cyan-400/40 text-cyan-800 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-500 animate-bounce" />
            <span>One Autonomy Stack — Humanoids, Quadrupeds, Drones &amp; Arms</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            Robotics Engineered for{' '}
            <span key={goalIndex} className="inline-block animate-goal-swap align-bottom">
              <GradientText>{GOALS[goalIndex]}</GradientText>
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            KRYA develops sensory-adaptive robotic systems equipped with real-time neural edge processing,
            sub-millimeter torque control, and zero-downtime fleet orchestration.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#demo">
              <PrimaryButton>
                <span>Launch Interactive Demo</span>
                <ChevronRight className="w-4 h-4" />
              </PrimaryButton>
            </a>
            <a href="#roi">
              <GhostButton>
                <Sliders className="w-4 h-4 text-cyan-500" />
                <span>Simulate Deployment ROI</span>
              </GhostButton>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
            <div>
              <p className="text-2xl font-black text-cyan-600">0.05 mm</p>
              <p className="text-xs text-slate-500">Repeatable Precision</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-600">&lt; 5 ms</p>
              <p className="text-xs text-slate-500">Neural Visual Loop</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">99.98%</p>
              <p className="text-xs text-slate-500">Operational Uptime</p>
            </div>
          </div>
        </div>

        {/* Interactive Bot Arm Visual */}
        <div id="demo" className="lg:col-span-5 relative scroll-mt-28">
          <GlassCard className="p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-mono font-medium text-slate-500 ml-2">MODEL: KRYA-X1 MARK V</span>
              </div>
              <StatusDot label="ONLINE" />
            </div>

            <div className="h-72 my-4 relative flex items-center justify-center bg-slate-100/60 rounded-2xl border border-slate-200 overflow-hidden">
              <svg className="w-full h-full p-4" viewBox="0 0 300 240">
                <defs>
                  <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>

                <line x1="20" y1="210" x2="280" y2="210" stroke="currentColor" className="text-slate-300" strokeWidth="3" />
                <rect x="110" y="200" width="80" height="15" rx="3" fill="currentColor" className="text-slate-400" />
                <circle cx="150" cy="195" r="22" fill="url(#cyberGradient)" opacity="0.9" />

                <g style={{ transformOrigin: '150px 195px', transform: 'rotate(' + (armAngle - 60) + 'deg)', transition: 'transform 0.4s ease' }}>
                  <rect x="144" y="95" width="12" height="100" rx="6" fill="#0284c7" />
                  <circle cx="150" cy="95" r="14" fill="#06b6d4" />
                  <g style={{ transformOrigin: '150px 95px', transform: 'rotate(' + -armAngle * 0.8 + 'deg)', transition: 'transform 0.4s ease' }}>
                    <rect x="145" y="25" width="10" height="70" rx="5" fill="#38bdf8" />
                    <circle cx="150" cy="25" r="10" fill="#0284c7" />
                    <path
                      d={gripperOpen ? 'M 135 10 L 145 25 L 155 25 L 165 10' : 'M 142 12 L 148 25 L 152 25 L 158 12'}
                      stroke="#00f0ff"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    <line x1="150" y1="20" x2="150" y2="220" stroke="rgba(6, 182, 212, 0.4)" strokeDasharray="4 4" strokeWidth="1" />
                  </g>
                </g>
              </svg>

              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-scanline pointer-events-none" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Joint Servo Pitch: {armAngle}&deg;</span>
                <span className="text-cyan-500 font-mono">
                  TORQUE: {(28 + armAngle * 0.32).toFixed(1)} Nm
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={armAngle}
                onChange={(e) => setArmAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>SPEED: {telemetry.speed} m/s</span>
                <span>VISION: {telemetry.visionLatency} ms</span>
                <span>TEMP: {telemetry.temperature} &deg;C</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setGripperOpen((o) => !o)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold border border-cyan-500/40 text-cyan-600 hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Actuate Gripper: {gripperOpen ? 'OPEN' : 'ENGAGED'}
                </button>
                <button
                  onClick={() => setIsRunning((r) => !r)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-200 text-slate-700 flex items-center gap-1"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                  <span>{isRunning ? 'Pause' : 'Resume'}</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </Section>
  );
}
