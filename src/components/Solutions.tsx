import { ShieldCheck, Lock, Layers, Factory, Truck, HeartPulse, Sprout, Zap, Crosshair, TrendingUp, Activity } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText } from './ui';

const VERTICALS = [
  { icon: Factory, title: 'Precision Manufacturing', desc: 'Machine-tending, assembly and QA cells that re-tool themselves between product runs in minutes, not months.' },
  { icon: Truck, title: 'Logistics & Warehousing', desc: '24/7 picking, palletizing and transfer fleets that scale headcount up and down with seasonal demand.' },
  { icon: HeartPulse, title: 'Healthcare & Pharma', desc: 'Sterile-rated units for lab sample handling, compounding and hospital logistics with full audit trails.' },
  { icon: Sprout, title: 'Agriculture & Food', desc: 'Weather-sealed field robots for seeding monitoring, harvesting support and yield-mapping at scale.' },
  { icon: Zap, title: 'Energy & Utilities', desc: 'Inspect turbines, substations and pipelines with autonomous ground and aerial units — no human at height.' },
  { icon: Crosshair, title: 'Defense & Aerospace', desc: 'Air-gapped deployments for hazardous material handling, perimeter ops and assembly of flight-critical parts.' },
];

const PILLARS = [
  { icon: ShieldCheck, title: 'ISO-Certified Collaborative Safety', desc: 'Instant contact detection and capacitive force skin ensures complete safety alongside human coworkers in dynamic assembly environments.', color: 'from-blue-500 to-cyan-500' },
  { icon: Layers, title: 'Edge AI Neuromorphic Compute', desc: 'Proprietary low-power tensor processors executing real-time object classification and grasping paths locally — no cloud round-trips.', color: 'from-cyan-500 to-teal-500' },
  { icon: Lock, title: 'Air-Gapped Sovereign Security', desc: 'Hardware root of trust, encrypted telemetry tunnels and zero unauthorized cloud dependencies satisfy strict defense and pharma compliance.', color: 'from-indigo-500 to-purple-500' },
];

export default function Solutions() {
  return (
    <Section id="solutions" className="bg-slate-100/50">
      <SectionHeading
        eyebrow="Startup Mission"
        title={<>Automation That <GradientText>Learns Your Floor, Not the Other Way Around</GradientText></>}
        subtitle="Traditional industrial automation requires months of rigid reprogramming. KRYA units learn through spatial multi-modal perception and adapt to unpredictable real-world environments within hours."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {PILLARS.map((card) => {
          const Icon = card.icon;
          return (
            <GlassCard key={card.title} className="p-8 hover:-translate-y-1.5 transition-transform">
              <div className={'w-12 h-12 rounded-2xl bg-gradient-to-tr ' + card.color + ' text-white flex items-center justify-center mb-6 shadow-md'}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      <SectionHeading
        eyebrow="Industries"
        title="Built For The Work Nobody Else Wants To Automate"
        center={false}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {VERTICALS.map((v) => {
          const Icon = v.icon;
          return (
            <div
              key={v.title}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white/70 flex items-start gap-4 hover:border-cyan-400/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">{v.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Activity, value: '120+', label: 'Pilot hours logged / unit' },
          { icon: TrendingUp, value: '3.1x', label: 'Throughput on tending cells' },
          { icon: ShieldCheck, value: '0', label: 'Recorded safety incidents' },
          { icon: Layers, value: '14 s', label: 'Average task changeover' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center p-5 rounded-2xl border border-slate-200/70">
              <Icon className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-cyan-600">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
