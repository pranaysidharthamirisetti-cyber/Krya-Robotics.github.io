import { Bot, Compass, Layers, Plane, Radar, Wrench, ArrowRight, BatteryCharging, Gauge } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText } from './ui';

const ROBOTS = [
  {
    name: 'KRYA-X1',
    tagline: 'Bipedal Humanoid',
    icon: Bot,
    color: 'from-cyan-500 to-blue-600',
    desc: 'General-purpose bipedal platform for human-shaped environments. Stairs, doors, tight aisles — no retrofitting required.',
    specs: ['1.72 m / 68 kg', '24 Nm joint torque', '4.5 h hot-swap battery'],
  },
  {
    name: 'KRYA-A7',
    tagline: 'Articulated Arm Cell',
    icon: Layers,
    color: 'from-blue-500 to-indigo-600',
    desc: '7-degree-of-freedom collaborative arm with force-limited skin and tool-change in under 12 seconds.',
    specs: ['0.05 mm repeatability', '12 kg payload', 'ISO 10218 certified'],
  },
  {
    name: 'KRYA-Q4',
    tagline: 'Quadruped Field Unit',
    icon: Compass,
    color: 'from-teal-500 to-emerald-600',
    desc: 'All-terrain quadruped for inspection, mapping and material transport inside plants, yards and construction sites.',
    specs: ['IP67 sealed', '35 kg tow load', 'LiDAR + thermal SLAM'],
  },
  {
    name: 'KRYA-V2',
    tagline: 'Autonomous Mobile Robot',
    icon: Radar,
    color: 'from-purple-500 to-fuchsia-600',
    desc: 'Fleet-native AMR for goods-to-person picking and intra-facility transfer, orchestrated by KRYA Mission Control.',
    specs: ['11 km/h nav speed', '600 kg lift deck', '24 h duty cycle'],
  },
  {
    name: 'KRYA-S2',
    tagline: 'Aerial Inspection Drone',
    icon: Plane,
    color: 'from-sky-500 to-cyan-600',
    desc: 'Tethered and free-flight drone unit for high-bay storage audits, roof and asset inspection with on-edge defect AI.',
    specs: ['28 min flight', '8K zoom imaging', 'Auto-dock charging'],
  },
  {
    name: 'KRYA-ToolKit',
    tagline: 'Modular End-Effectors',
    icon: Wrench,
    color: 'from-amber-500 to-orange-600',
    desc: 'Plug-and-play grippers, lifters and weld tools that any KRYA unit can hot-swap without reboots or re-calibration.',
    specs: ['Soft-Touch Bio-Gripper', 'Magnetic Induction Lifter', 'Laser Seam Welder'],
  },
];

export default function Products() {
  return (
    <Section id="robots">
      <SectionHeading
        eyebrow="Product Line"
        title={<>One Platform. <GradientText>Every Form Factor.</GradientText></>}
        subtitle="From factory floors to outdoor yards, every KRYA robot shares the same neural core, safety stack and fleet API — so capabilities compound across your whole deployment."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ROBOTS.map((bot) => {
          const Icon = bot.icon;
          return (
            <GlassCard key={bot.name} className="p-7 group hover:-translate-y-1.5 transition-transform flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className={'w-12 h-12 rounded-2xl bg-gradient-to-tr ' + bot.color + ' text-white flex items-center justify-center shadow-md'}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 border border-slate-200 rounded-full px-2.5 py-1">
                  {bot.tagline}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {bot.name}
                <ArrowRight className="inline w-4 h-4 ml-2 text-cyan-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{bot.desc}</p>
              <ul className="space-y-1.5">
                {bot.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Gauge className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-2"><BatteryCharging className="w-4 h-4 text-emerald-500" /> Hot-swappable batteries on every platform</span>
        <span className="flex items-center gap-2"><Radar className="w-4 h-4 text-cyan-500" /> Unified LiDAR + vision perception stack</span>
        <span className="flex items-center gap-2"><Wrench className="w-4 h-4 text-amber-500" /> Shared tooling ecosystem across all units</span>
      </div>
    </Section>
  );
}
