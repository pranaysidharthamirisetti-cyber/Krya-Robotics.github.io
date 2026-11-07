import { Boxes, CircuitBoard, Factory, Flame, Globe2, HardHat, Plane, ShieldCheck } from 'lucide-react';

const PARTNERS = [
  { name: 'Helios Motors', icon: Flame },
  { name: 'Orbitra Logistics', icon: Plane },
  { name: 'NanoFab Systems', icon: CircuitBoard },
  { name: 'Vantel Defense', icon: ShieldCheck },
  { name: 'AgroNex Fields', icon: Globe2 },
  { name: 'Corem Industrial', icon: Factory },
  { name: 'StackPac Warehousing', icon: Boxes },
  { name: 'MineArc Extraction', icon: HardHat },
];

export default function TrustedBy() {
  return (
    <div className="py-10 border-y border-slate-200/70 bg-white/50 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-6">
        Trusted by pilot partners across industry
      </p>
      <div className="marquee-track flex w-max gap-12 items-center animate-marquee">
        {[...PARTNERS, ...PARTNERS].map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name + i}
              className="flex items-center gap-2.5 text-slate-400 hover:text-cyan-500 transition-colors whitespace-nowrap"
            >
              <Icon className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">{p.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
