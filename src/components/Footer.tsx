import { useState } from 'react';
import { Code2, Hash, Briefcase, Video, Check } from 'lucide-react';
import Logo from './Logo';

const LINK_GROUPS = [
  { title: 'Product', links: [['Robots', '#robots'], ['Solutions', '#solutions'], ['Mission Control', '#fleet'], ['Specs & SDK', '#specs']] },
  { title: 'Company', links: [['Roadmap', '#roadmap'], ['Careers', '#careers'], ['Contact', '#contact'], ['FAQ', '#faq']] },
  { title: 'Resources', links: [['Documentation', '#specs'], ['Security & Compliance', '#solutions'], ['Press Kit', '#contact'], ['Status Page', '#fleet']] },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  }

  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10 shadow-lg shadow-cyan-500/30" />
              <span className="font-display text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
                KRYA ROBOTICS
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Sensory-adaptive robots for the work that doesn't fit a cage. Built in Bengaluru, deployed on your floor.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
              <input
                type="email"
                required
                placeholder="Build logs, monthly. No spam."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 outline-none transition-colors"
              />
              <button
                type="submit"
                className={
                  'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ' +
                  (subscribed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.03]')
                }
              >
                {subscribed ? <Check className="w-4 h-4" /> : 'Subscribe'}
              </button>
            </form>
            {subscribed && <p className="text-xs text-emerald-600">You're on the list — welcome aboard.</p>}
          </div>

          {LINK_GROUPS.map((g) => (
            <div key={g.title} className="lg:col-span-2">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">{g.title}</h4>
              <ul className="space-y-2.5">
                {g.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-slate-600 hover:text-cyan-600 transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Follow</h4>
            <div className="flex gap-3">
              {[
                { icon: Code2, label: 'GitHub' },
                { icon: Hash, label: 'X' },
                { icon: Briefcase, label: 'LinkedIn' },
                { icon: Video, label: 'YouTube' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#contact"
                    aria-label={s.label}
                    title={s.label}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white/70 flex items-center justify-center text-slate-500 hover:text-cyan-500 hover:border-cyan-400/60 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 KRYA Robotics Pvt. Ltd. All rights reserved.</p>
          <p className="font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
            fleet status: nominal
          </p>
        </div>
      </div>
    </footer>
  );
}
