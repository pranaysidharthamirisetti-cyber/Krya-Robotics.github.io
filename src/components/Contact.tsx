import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Check, Bot } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText, PrimaryButton } from './ui';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState({ name: '', email: '', body: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title={<>Talk To The <GradientText>Team</GradientText></>}
        subtitle="Pilot requests, partnerships, or a hard technical question — this reaches the founders and field engineers directly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Mail, label: 'hello@kryarobotics.example', sub: 'General & partnerships' },
            { icon: Phone, label: '+91 000 000 0000', sub: 'Field ops hotline' },
            { icon: MapPin, label: 'Bengaluru, Karnataka', sub: 'HQ + fabrication lab' },
            { icon: Bot, label: '@kryarobotics', sub: 'X / LinkedIn / YouTube' },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white/60 hover:border-cyan-400/60 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{c.label}</p>
                  <p className="text-xs text-slate-500">{c.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <GlassCard className="lg:col-span-3 p-7">
          {sent ? (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-extrabold">Message Sent</h3>
              <p className="text-sm text-slate-600 max-w-sm">
                We reply within one business day. Tell us what you want to automate and we will bring the details.
              </p>
              <button onClick={() => setSent(false)} className="text-xs font-semibold text-cyan-600 hover:underline mt-1">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Your name"
                  value={msg.name}
                  onChange={(e) => setMsg({ ...msg, name: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={msg.email}
                  onChange={(e) => setMsg({ ...msg, email: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
              <textarea
                required
                rows={5}
                placeholder="What would you like to automate?"
                value={msg.body}
                onChange={(e) => setMsg({ ...msg, body: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
              />
              <PrimaryButton type="submit" className="w-full">
                <Send className="w-4 h-4" /> Send Message
              </PrimaryButton>
            </form>
          )}
        </GlassCard>
      </div>
    </Section>
  );
}
