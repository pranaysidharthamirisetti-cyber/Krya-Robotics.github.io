import { useEffect, useState } from 'react';
import { Activity, BatteryCharging, Cpu, Radar, Gauge, Wifi } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText, StatusDot } from './ui';

interface Unit {
  id: string;
  model: string;
  loc: string;
  status: 'Active' | 'Docking' | 'Charging' | 'Idle';
  load: number;
  bat: number;
  duty: number;
}

const INITIAL_UNITS: Unit[] = [
  { id: 'KR-01', model: 'KRYA-X1', loc: 'Cell A — Assembly', status: 'Active', load: 14.2, bat: 98, duty: 87 },
  { id: 'KR-02', model: 'KRYA-A7', loc: 'Cell B — Tending', status: 'Active', load: 8.5, bat: 92, duty: 74 },
  { id: 'KR-03', model: 'KRYA-V2', loc: 'Cell C — Dock', status: 'Docking', load: 0.0, bat: 41, duty: 12 },
  { id: 'KR-04', model: 'KRYA-Q4', loc: 'Yard — Inspection', status: 'Active', load: 1.2, bat: 89, duty: 63 },
];

const STATUS_STYLE: Record<Unit['status'], string> = {
  Active: 'bg-emerald-500/15 text-emerald-600 border-emerald-400/40',
  Docking: 'bg-amber-500/15 text-amber-600 border-amber-400/40',
  Charging: 'bg-sky-500/15 text-sky-600 border-sky-400/40',
  Idle: 'bg-slate-500/15 text-slate-500 border-slate-400/40',
};

function Bar({ value, className }: { value: number; className: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
      <div className={'h-full rounded-full transition-all duration-1000 ' + className} style={{ width: value + '%' }} />
    </div>
  );
}

export default function Fleet() {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [network, setNetwork] = useState({ latency: 7.4, uplink: 94.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setNetwork({ latency: 6 + Math.random() * 4, uplink: 88 + Math.random() * 11 });
      setUnits((prev) =>
        prev.map((u) => ({
          ...u,
          load: +Math.max(0, u.load + (Math.random() - 0.5) * 1.6).toFixed(1),
          bat: Math.max(5, Math.min(100, Math.round(u.bat + (u.status === 'Docking' ? 2 : -1) * Math.random()))),
          duty: Math.max(4, Math.min(99, Math.round(u.duty + (Math.random() - 0.5) * 10))),
        }))
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="fleet">
      <SectionHeading
        eyebrow="Mission Control"
        title={<>Fleet Telemetry, <GradientText>Live On One Screen</GradientText></>}
        subtitle="Every KRYA unit streams pose, load, thermal and task telemetry into Mission Control. Supervisors see the whole floor before anyone reaches for a radio."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {units.map((u) => (
            <GlassCard key={u.id} className="p-5">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-mono font-bold text-cyan-500">{u.id}</span>
                  <span className="text-xs text-slate-400 ml-2 font-mono">{u.model}</span>
                </div>
                <span className={'text-[10px] px-2 py-0.5 rounded-full font-semibold border ' + STATUS_STYLE[u.status]}>
                  {u.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">{u.loc}</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span>BATTERY</span>
                    <span className="text-emerald-500">{u.bat}%</span>
                  </div>
                  <Bar value={u.bat} className="bg-gradient-to-r from-emerald-500 to-teal-400" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span>DUTY CYCLE</span>
                    <span className="text-cyan-500">{u.duty}%</span>
                  </div>
                  <Bar value={u.duty} className="bg-gradient-to-r from-cyan-500 to-blue-500" />
                </div>
                <div className="flex justify-between text-xs font-medium pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Gauge className="w-3.5 h-3.5 text-blue-500" /> {u.load.toFixed(1)} kg
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" /> OK
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Radar className="w-5 h-5 text-cyan-500 animate-spin-slow" /> Floor Map
            </h3>
            <StatusDot label={'SYNC ' + network.latency.toFixed(1) + ' ms'} />
          </div>

          <div className="relative flex-1 min-h-56 rounded-2xl border border-slate-200 bg-slate-100/60 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-cyan-500/30 radar-ping" />
            </div>
            {units.map((u, i) => (
              <div
                key={u.id}
                className="absolute"
                style={{ left: 18 + i * 17 + '%', top: 24 + (i % 2) * 38 + '%' }}
                title={u.id}
              >
                <span className="block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.7)] animate-pulse" />
                <span className="absolute left-4 top-0 text-[9px] font-mono text-slate-500 whitespace-nowrap">
                  {u.id}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 text-center">
            <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200">
              <Cpu className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <p className="text-lg font-black">{network.uplink.toFixed(1)}%</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Uplink Health</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200">
              <Activity className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-black">
                {units.filter((u) => u.status === 'Active').length} / {units.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Units Producing</p>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
              <BatteryCharging className="w-3.5 h-3.5 text-sky-500" />
              Auto-dock & charge scheduling is running unattended
            </div>
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
