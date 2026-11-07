import type { ReactNode } from 'react';

export function Section({
  id,
  className = '',
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={'relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24 ' + className}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={'max-w-3xl space-y-4 mb-14 ' + (center ? 'mx-auto text-center' : '')}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 bg-cyan-100/70 border border-cyan-300/60 px-3 py-1 rounded-full">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-600 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function GlassCard({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={
        'rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-xl ' +
        className
      }
    >
      {children}
    </div>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = '',
  type,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      className={
        'px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ' +
        className
      }
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'px-6 py-3 rounded-xl border border-slate-300 bg-white/70 font-medium hover:bg-slate-100 transition-all flex items-center justify-center gap-2 ' +
        className
      }
    >
      {children}
    </button>
  );
}

export function StatusDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      {label}
    </span>
  );
}
