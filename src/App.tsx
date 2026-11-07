import { useState, useEffect } from 'react';
import { Sun, Moon, Bot, Zap, ShieldCheck, RotateCw, Play, Pause, Activity, BatteryCharging, Cpu, Compass, Layers, Radar, Terminal, Gauge, Sliders, Award, Send, Sparkles, Globe2, Lock, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'overview' | 'robotics' | 'fleet' | 'tech' | 'order'>('overview');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [armAngle, setArmAngle] = useState<number>(45);
  const [gripperOpen, setGripperOpen] = useState<boolean>(true);
  const [payloadType, setPayloadType] = useState<string>('Silicon Wafer Core');
  const [telemetry, setTelemetry] = useState({
    speed: 2.4,
    battery: 94,
    temperature: 36.2,
    visionLatency: 4.8,
    aiMode: 'Autonomous',
    activeJointAngle: 45
  });

  const [unitsNeeded, setUnitsNeeded] = useState<number>(4);
  const [shiftHours, setShiftHours] = useState<number>(16);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', sector: 'Precision Electronics' });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        speed: +(2.0 + Math.random() * 0.8).toFixed(2),
        temperature: +(35.8 + Math.random() * 1.4).toFixed(1),
        visionLatency: +(4.2 + Math.random() * 1.2).toFixed(1),
        activeJointAngle: Math.floor(30 + Math.random() * 60)
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const triggerCelebration = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    triggerCelebration();
  };
  return (
    <div 
      onMouseMove={handleMouseMove}
      className={"min-h-screen transition-colors duration-500 relative overflow-x-hidden " + (theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800')}
    >
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className={"fixed -top-40 -left-40 w-96 h-96 rounded-full blur-3zl pointer-events-none transition-all duration-700 " + (theme === 'dark' ? 'bg-cyan-600/20' : 'bg-cyan-400/25')} />
      <div className={"fixed -bottom-40 -right-40 w-96 h-96 rounded-full blur-3zl pointer-events-none transition-all duration-700 " + (theme === 'dark' ? 'bg-purple-600/20' : 'bg-indigo-300/30')} />
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/75 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 dark:from-cyan-400 dark:to-blue-400">
                KRYA
              </span>
              <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                Robotics AI: Physical
              </span>
            </div>
          </div>
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-300/40 dark:border-slate-800">
          {[
            { Id: 'overview', label: 'Overview' },
            { id: 'robotics', label: 'Interactive Bot' },
            { id: 'fleet', label: 'Fleet Telemetry' },
            { id: 'tech', label: 'Core Specs' },
            { id: 'order', label: 'Deploy & ROI' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={"px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 " + (activeTab === tab.id ? 'bg-white dark:bg-cyan-500 text-slate-900 dark:text-slate-950 shadow-md font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300')}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-xl group bg-gradient-to-br from-cyan-500 to-blue-600 hover:text-white dark:text-white shadow-lg shadow-cyan-500/20"
          >
            <span className="relative px-4 py-2 bg-white dark:bg-slate-900 rounded-[10px] text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              Reserve Unit
            </span>
          </button>
        </div>
      </div>
    </header>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-100/80 dark:bg-cyan-950/70 border border-cyan-400/40 text-cyan-800 dark:text-cyan-300 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-500 animate-bounce" />
              <span>Next-Gen Autonomous Bipedal & Articulated Robotics</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Intelligent Physical Automation for the {' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400">
                Frontiers of Industry
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              KRYA develops sensory-adaptive robotic systems equipped with real-time neural edge processing, sub-millimeter torque control, and zero-downtime fleet orchestration.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActiveTab('robotics')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Launch Interactive Demo</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('order')}
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-cyan-500" />
                <span>Simulate Deployment ROI</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
              <div>
                <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">0.05 mm</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Repeatable Precision</p>
              </div>
              <div>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">&lt; 5 ms</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Neural Visual Loop</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">99.98%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Operational Uptime</p>
              </div>
            </div>
          </div>
          {/* Interactive Bot Arm Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-6 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono font-medium text-slate-500 ml-2">MODEL: KRYA-X1 MARK V</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  ONLINE
                </div>
              </div>

              <div className="h-72 my-4 relative flex items-center justify-center bg-slate-100/60 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden">
                <svg className="w-full h-full p-4" viewBox="0 0 300 240">
                  <defs>
                    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  <line x1="20" y1="210" x2="280" y2="210" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="3" />
                  <rect x="110" y="200" width="80" height="15" rx="3" fill="currentColor" className="text-slate-400 dark:text-slate-700" />
                  <circle cx="150" cy="195" r="22" fill="url(#cyberGradient)" opacity="0.9" />

                  <g style={{ transformOrigin: '150px 195px', transform: 'rotate(' + (armAngle - 60) + 'deg)', transition: 'transform 0.4s ease' }}>
                    <rect x="144" y="95" width="12" height="100" rx="6" fill="#0284c7" />
                    <circle cx="150" cy="95" r="14" fill="#06b6d4" />
                    <g style={{ transformOrigin: '150px 95px', transform: 'rotate(' + (-armAngle * 0.8) + 'deg)', transition: 'transform 0.4s ease' }}>
                      <rect x="145" y="25" width="10" height="70" rx="5" fill="#38bdf8" />
                      <circle cx="150" cy="25" r="10" fill="#0284c7" />
                      <path d={gripperOpen ? 'M 135 10 L 145 25 L 155 25 L 165 10' : 'M 142 12 L 148 25 L 152 25 L 158 12'} stroke="#00f0ff" strokeWidth="5" fill="none" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
                      <line x1="150" y1="20" x2="150" y2="220" stroke="rgba(6, 182, 212, 0.4)" strokeDasharray="4 4" strokeWidth="1" />
                    </g>
                  </g>
                </svg>

                <div className="absolute inset-x-h 0.5 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-scanline pointer-events-none" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Joint Servo Pitch: {armAngle}°</span>
                  <span className="text-cyan-500 font-mono">TORQUE: 42.4 Nm</span>
                </div>
                <input type="range" min="15" max="90" value={armAngle} onChange={(eigh) => setArmAngle(Number(eigh.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                <div className="flex gap-2">
                  <button onClick={() => setGripperOpen(!gripperOpen)} className="flex-1 py-2 rounded-lg text-xs font-semibold border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                    Actuate Gripper: {gripperOpen ? 'OPEN' : 'ENGAGED'}
                  </button>
                  <button onClick={() => setIsRunning(!isRunning)} className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{isRunning ? 'Pause' : 'Resume'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  <div className="p-8 max-w-7xl mx-auto">
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {[
        { id: 'overview', title: 'Startup Mission', icon: Bot },
        { id: 'robotics', title: 'Modular Hardware', icon: Layers },
        { id: 'fleet', title: 'Fleet Matrix', icon: Radar },
        { id: 'tech', title: 'Core Specs', icon: Terminal },
        { id: 'order', title: 'ROI & Deploy', icon: Gauge },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={"flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border " + (activeTab === item.id ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105' : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300')}
          >
            <Icon className="w-4 h-4" />
            <span>{item.title}</span>
          </button>
        );
      })}
    </div>
      {activeTab === 'overview' && (
        <div className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold">Autonomous Capabilities Re-engineered</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Traditional industrial automation requires months of rigid reprogramming. KRYA units learn through spatial multi-modal perception and adapt to unpredictable real-world environments within hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'ISO-Certified Collaborative Safety', desc: 'Instant contact detection and capacitive force skin ensures complete safety alongside human coworkers in dynamic assembly environments.', color: 'from-blue-500 to-cyan-500' },
              { icon: Layers, title: 'Edge AI Neuromorphic Compute', desc: 'Equipped with proprietary low-power tensor processors executing real-time object classification and grasping paths locally.', color: 'from-cyan-500 to-teal-500' },
              { icon: Lock, title: 'Air-Gapped Sovereign Security', desc: 'Hardware root of trust, encrypted telemetry tunnels, and zero unauthorized cloud dependencies satisfy strict defense and pharma compliance.', color: 'from-indigo-500 to-purple-500' }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl hover:-translate-y-1.5 transition-transform">
                  <div className={"w-12 h-12 rounded-2xl bg-gradient-to-tr " + card.color + " text-white flex items-center justify-center mb-6 shadow-md"}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'robotics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold">Modular End-Effector Systems</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Change plug-and-play hydraulic and electromagnetic arm tools within 12 seconds without requiring reboots.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Soft-Touch Bio-Gripper', spec: '0.1N to 15N gentle grip for silicon wafers' },
                { name: 'Magnetic Induction Lifter', spec: 'Holds up to 45kg ferromagnetic materials' },
                { name: 'Laser Scanner & Weld Tool', spec: 'Sub-millimeter seam tracking & validation' }
              ].map((eff, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{eff.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{eff.spec}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button onClick={() => { setPayloadType(payloadType === 'Silicon Wafer Core' ? 'Aviation Valve Core' : 'Silicon Wafer Core'); triggerCelebration(); }} className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20 flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                <span>Swap Sample Payload: {payloadType}</span>
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-slate-100 border border-cyan-500/30">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" /> Kinematic Telemetry Directory
            </h3>
            <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
              {'$ krya-cli calibrate --axis=6 --precision=high\n[0.0012] Joint 1 Offset: OF\n[-0.0004] Joint 2 Offset: OF\nActive Payload: ' + payloadType + '\nCAS Latency: ' + telemetry.visionLatency + ' ms\nThermal Runtime: ' + telemetry.temperature + ' C'}
            </pre>
          </div>
        </div>
      )}
      {activeTab === 'fleet' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold">Autonomous Fleet Clusters</h2>
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-500 font-semibold">4 Units Online</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { id: 'KR-01', loc: 'Cell A', status: 'Active', load: '14.2 kg', bat: '98%' },
              { id: 'KR-02', loc: 'Cell B', status: 'Active', load: '8.5 kg', bat: '92%' },
              { id: 'KR-03', loc: 'Cell C', status: 'Docking', load: '0.0 kg', bat: '41%' },
              { id: 'KR-04', loc: 'Cell D', status: 'Active', load: '1.2 kg', bat: '89%' },
            ].map((bot) => (
              <div key={bot.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
                <div className="flex justify-between mb-2">
                  <span className="font-mono font-bold text-cyan-500">{bot.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">{bot.status}</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{bot.loc}</p>
                <div className="flex justify-between text-xs font-medium border-t border-slate-200 dark:border-slate-800 pt-3">
                  <span>{bot.load}</span>
                  <span className="text-emerald-500">{bot.bat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* End of content */}
    </div>
  </div>
  );
}
