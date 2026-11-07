import { useEffect, useRef, useState } from 'react';
import { Terminal, Cpu, Database, Wifi, ShieldCheck, CircuitBoard, Binary } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText } from './ui';

const SPECS = [
  { group: 'Mechanical', icon: CircuitBoard, rows: [['Degrees of Freedom', '7 + wrist 3'], ['Reach / Payload', '1.85 m / 12 kg'], ['Repeatability', '± 0.05 mm'], ['Self Weight', '68 kg (X1 platform)']] },
  { group: 'Compute', icon: Cpu, rows: [['Neural Engine', 'KRYA NPU-3, 275 TOPS'], ['Motion Controller', '1 kHz closed-loop'], ['Onboard Storage', '2 TB NVMe encrypted'], ['OTA Updates', 'Signed, delta-based']] },
  { group: 'Sensing', icon: Database, rows: [['Perfusion', '4× RGB-D + stereo pair'], ['LiDAR', '360° solid-state, 80 m'], ['Force Torque', '6-axis at every joint'], ['Thermal', '-20 °C to 550 °C range']] },
  { group: 'Connectivity', icon: Wifi, rows: [['Fleet Mesh', 'Wi-Fi 6E + 5G private'], ['Latency Budget', '< 5 ms perception loop'], ['Remote Ops', 'TLS 1.3 wireguard tunnel'], ['Offline Mode', 'Full autonomy w/o network']] },
];

const CODE_TABS: Record<string, string> = {
  'Python SDK': `from krya import Fleet

fleet = Fleet.connect("https://control.plant-7.local")

bot = fleet.unit("KR-01")
bot.grasp(target="engine-block", tool="magnetic-lifter")
bot.place(zone="line-B", speed="smooth")

print(bot.telemetry())   # load, pose, battery, duty`,
  'krya-cli': `$ krya-cli calibrate --axis=6 --precision=high
[0.0012] Joint 1 Offset: OK
[-0.0004] Joint 2 Offset: OK
Active Payload: Silicon Wafer Core
Vision Loop Latency: 4.6 ms
Thermal Runtime: 36.4 C

$ krya-cli fleet status
KR-01  Active   Cell A   98%   duty 87%
KR-02  Active   Cell B   92%   duty 74%
KR-03  Docking  Cell C   41%   duty 12%
KR-04  Active   Yard     89%   duty 63%`,
  'REST / Webhooks': `POST /v1/tasks
{
  "unit": "KR-02",
  "skill": "machine-tend",
  "params": { "bin": "rack-14", "parts": 24 },
  "safety": { "speed_zone": "human-shared" }
}

202 Accepted  ->  task_id: t_9fa2c1

WEBHOOK krya.task.completed
{ "task_id": "t_9fa2c1", "cycle_time_s": 41.7 }`,
};

const LOG_LINES = [
  '[boot] NPU-3 core online — 275 TOPS',
  '[perception] point cloud synced @ 1 kHz',
  '[safety] force-skin self-test: PASS',
  '[fleet] joined mesh "plant-7" as KR-01',
  '[skill] loaded: grasp / place / weld / scan',
  '[ok] ready — awaiting mission directive…',
];

export default function TechSpecs() {
  const [codeTab, setCodeTab] = useState<string>('Python SDK');
  const [logCount, setLogCount] = useState(0);
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const t = setInterval(() => setLogCount((c) => (c >= LOG_LINES.length ? 0 : c + 1)), 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logCount]);

  return (
    <Section id="specs" className="bg-slate-100/50">
      <SectionHeading
        eyebrow="Core Specs"
        title={<>Engineering That <GradientText>Fits On One Datasheet</GradientText></>}
        subtitle="Every number below is measured on production units, not marketing slides. And every capability is exposed through the same open SDK your software team already knows."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {SPECS.map((cat) => {
          const Icon = cat.icon;
          return (
            <GlassCard key={cat.group} className="p-5">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-cyan-600">
                <Icon className="w-4 h-4" /> {cat.group}
              </h3>
              <dl className="space-y-2.5">
                {cat.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-xs">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="font-semibold text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 bg-slate-900/95 border-cyan-500/30">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5" /> Cold Boot Log — KRYA-X1
          </h3>
          <pre
            ref={logRef}
            className="font-mono text-xs text-emerald-300 bg-slate-950 p-4 rounded-xl border border-slate-800 h-64 overflow-y-auto"
          >
            {LOG_LINES.slice(0, logCount).join('\n') + (logCount < LOG_LINES.length ? '\n▊' : '')}
          </pre>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Secure boot chain verified at every stage — hardware root of trust to fleet mesh.
          </p>
        </GlassCard>

        <GlassCard className="p-6 bg-slate-900/95 border-indigo-500/30">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
              <Binary className="w-5 h-5" /> Developer API
            </h3>
            <div className="flex gap-1 bg-slate-800/80 p-1 rounded-lg">
              {Object.keys(CODE_TABS).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  className={
                    'px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ' +
                    (codeTab === tab ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-indigo-300')
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <pre className="font-mono text-xs text-sky-200 bg-slate-950 p-4 rounded-xl border border-slate-800 h-64 overflow-auto leading-relaxed">
            {CODE_TABS[codeTab]}
          </pre>
          <p className="text-[11px] text-slate-400 mt-3">
            One skill library, every form factor — write once, deploy across arms, humanoids, AMRs and drones.
          </p>
        </GlassCard>
      </div>
    </Section>
  );
}
