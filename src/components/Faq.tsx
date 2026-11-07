import { useState } from 'react';
import { Minus, Plus, MessageSquare } from 'lucide-react';
import { Section, SectionHeading, GradientText } from './ui';

const FAQS = [
  {
    q: 'Do I need to redesign my factory floor?',
    a: 'No. KRYA units are built for human-shaped environments — stairs, standard doors, existing racking and cell footprints. The X1 humanoid walks in; arm cells bolt to existing plates.',
  },
  {
    q: 'How safe are they around people?',
    a: 'Every joint has 6-axis force-torque sensing and a capacitive skin that detects contact in under 8 ms. Units are ISO 10218 / ISO/TS 15066 aligned, and speed-limits itself automatically in human-shared zones.',
  },
  {
    q: 'What happens when the network goes down?',
    a: 'All inference runs on-device. A unit can complete its current task library fully offline; networking is for fleet coordination and Mission Control visibility, never for the control loop.',
  },
  {
    q: 'Can we integrate with our MES / ERP / WMS?',
    a: 'Yes — REST + webhook API, an OPC-UA adapter for shop-floor systems, and a Python SDK. Deployment engineers write the first integration with you during the pilot.',
  },
  {
    q: 'What does a pilot actually cost?',
    a: 'Pilot programs run 6-10 weeks as a paid engagement credited against a fleet order if you convert. Use the ROI simulator above and we will scope real numbers on the call.',
  },
  {
    q: 'Who maintains the robots?',
    a: 'Mission Control predicts part wear before failure and pre-ships spares to your site. Swaps are modular — hot-swap batteries and tool-changers need no technician certification.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title={<>Questions Engineers <GradientText>Actually Ask</GradientText></>}
        subtitle="If your question isn't here, it's probably a good one — bring it to the scoping call."
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((f, i) => (
          <div
            key={f.q}
            className={
              'rounded-2xl border transition-all duration-300 overflow-hidden ' +
              (open === i
                ? 'border-cyan-400/60 bg-white/80 shadow-lg shadow-cyan-500/10'
                : 'border-slate-200 bg-white/50')
            }
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open === i}
            >
              <span className="font-semibold text-sm flex items-center gap-3">
                <MessageSquare className={'w-4 h-4 shrink-0 transition-colors ' + (open === i ? 'text-cyan-500' : 'text-slate-400')} />
                {f.q}
              </span>
              <span
                className={
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ' +
                  (open === i ? 'bg-cyan-500 text-white rotate-180' : 'bg-slate-100 text-slate-500')
                }
              >
                {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <div
              className={
                'grid transition-all duration-300 ease-in-out ' + (open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')
              }
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-12 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
