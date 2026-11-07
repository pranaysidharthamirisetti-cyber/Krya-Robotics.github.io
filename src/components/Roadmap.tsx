import { Rocket, Check, Flag } from 'lucide-react';
import { Section, SectionHeading, GradientText } from './ui';

const MILESTONES = [
  { when: '2024', title: 'Garage Prototype', desc: 'First 6-DOF arm designed, built and calibrated in a home workshop — reliable pick-and-place from day one.', done: true },
  { when: '2025', title: 'NPU-3 Neural Core', desc: 'In-house edge inference silicon reached 275 TOPS under 40 W, enabling sub-5 ms vision loops fully offline.', done: true },
  { when: '2026', title: 'Pilot Fleet Live', desc: '12 units across 4 industrial partners: tending, inspection and logistics cells running unattended shifts.', done: true },
  { when: '2027', title: 'General Availability', desc: 'X1 humanoid and ToolKit ecosystem open to orders; Mission Control ships with multi-site fleet views.', done: false },
  { when: '2028', title: 'Skill Marketplace', desc: 'Partner-built skills, tools and simulation environments shareable across fleets — an app store for physical work.', done: false },
];

export default function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHeading
        eyebrow="Trajectory"
        title={<>From Kitchen Table To <GradientText>Industrial Fleet</GradientText></>}
        subtitle="Where we have been, and where we are going. Roadmap items are directional and will shift as we learn from real deployments."
      />

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/70 via-blue-500/50 to-slate-300" />
        <div className="space-y-10">
          {MILESTONES.map((m, i) => (
            <div key={m.title + m.when} className={'relative flex md:items-center gap-6 ' + (i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')}>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div
                  className={
                    'w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-lg ' +
                    (m.done
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/30'
                      : 'bg-slate-100 border-cyan-500/60 text-cyan-500')
                  }
                >
                  {m.done ? <Check className="w-4 h-4" /> : i === 3 ? <Rocket className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
                </div>
              </div>
              <div className={'ml-16 md:ml-0 md:w-1/2 ' + (i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12')}>
                <p className="text-xs font-mono font-bold text-cyan-600 tracking-widest">{m.when}</p>
                <h3 className="text-lg font-extrabold capitalize">{m.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
