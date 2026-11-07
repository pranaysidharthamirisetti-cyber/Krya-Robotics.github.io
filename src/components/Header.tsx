import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '#robots', label: 'Robots' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#fleet', label: 'Fleet' },
  { href: '#specs', label: 'Tech' },
  { href: '#roi', label: 'ROI' },
  { href: '#careers', label: 'Careers' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/50 bg-white/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <Logo className="w-11 h-11 shadow-lg shadow-cyan-500/30" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <span className="text-2xl font-bold font-display tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
              KRYA
            </span>
            <span className="hidden sm:inline text-xs ml-1.5 px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest bg-cyan-100 text-cyan-800 border border-cyan-300">
              Robotics & Automation
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-300/40">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-cyan-600 hover:bg-white/70 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Reserve Unit
          </a>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle Menu"
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 py-2.5 px-3 rounded-xl text-center text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          >
            Reserve Unit
          </a>
        </nav>
      )}
    </header>
  );
}
