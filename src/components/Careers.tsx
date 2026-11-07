import { Briefcase, MapPin, Users, Wrench, Binary, Radar, Sparkles } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText } from './ui';

const ROLES = [
  { title: 'Robotics Software Engineer, Motion Control', team: 'Software', loc: 'Bengaluru / Remote', icon: Binary },
  { title: 'Mechatronics Engineer, End-Effectors', team: 'Hardware', loc: 'Bengaluru', icon: Wrench },
  { title: 'Perception & SLAM Researcher', team: 'AI', loc: 'Remote (EU/IN)', icon: Radar },
  { title: 'Field Deployment Engineer', team: 'Operations', loc: 'Travel — 40%', icon: Sparkles },
];

export default function Careers() {
  return (
    <Section id="careers" className="bg-slate-100/50">
      <SectionHeading
        eyebrow="Careers"
        title={<>Build Machines That <GradientText>Build The Future</GradientText></>}
        subtitle="We hire for bias to action. If you have designed, built or shipped something physical, you are already qualified."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Users, title: 'Small, senior team', desc: '14 engineers, no middle layers. Direct line from your idea to a robot executing it.' },
          { icon: Wrench, title: 'Hardware + software', desc: 'Everyone works with the real machine — no split between simulation and hardware teams.' },
          { icon: Sparkles, title: 'Meaningful equity', desc: 'Early, substantive numbers for every hire.' },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="p-6 rounded-2xl border border-slate-200 bg-white/70">
              <Icon className="w-6 h-6 text-cyan-500 mb-3" />
              <h3 className="font-bold mb-1.5">{c.title}</h3>
              <p className="text-sm text-slate-600">{c.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <GlassCard key={role.title} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-cyan-400/60 transition-colors group">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{role.title}</h4>
                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {role.team}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {role.loc}</span>
                </p>
              </div>
              <a
                href="#contact"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-cyan-500/40 text-cyan-600 hover:bg-cyan-500/10 transition-colors text-center shrink-0"
              >
                Apply →
              </a>
            </GlassCard>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-500 mt-8">
        Don't see your role? <a href="#contact" className="font-semibold text-cyan-600 hover:underline">Send a cold pitch</a>.
      </p>
    </Section>
  );
}
