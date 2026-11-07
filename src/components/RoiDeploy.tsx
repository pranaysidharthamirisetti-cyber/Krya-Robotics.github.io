import { useState } from 'react';
import { Gauge, Send, TrendingUp, CircleDollarSign, Clock, Check, RotateCw } from 'lucide-react';
import { Section, SectionHeading, GlassCard, GradientText, PrimaryButton } from './ui';

const HOURLY_LABOR_COST = 28; // USD, placeholder assumption
const UNIT_HOURLY_COST = 11; // robot-as-a-service rate, placeholder
const UNIT_PRICE = 94000; // outright price, placeholder

const SECTORS = ['Precision Electronics', 'Automotive', 'Warehousing & 3PL', 'Pharma & MedDevice', 'Food & Agriculture', 'Energy & Utilities'];

export default function RoiDeploy() {
  const [units, setUnits] = useState(4);
  const [shiftHours, setShiftHours] = useState(16);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', sector: SECTORS[0] });

  const monthly = useMemoRoi(units, shiftHours);

  function handleReset() {
    setSubmitted(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Section id="roi">
      <SectionHeading
        eyebrow="Deploy & ROI"
        title={<>See The Payback <GradientText>Before You Sign Anything</GradientText></>}
        subtitle="Model your deployment with the sliders. Exact figures are built from your real cycle times during the pilot scoping call."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <GlassCard className="p-7 space-y-7">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-500" /> Units Deployed
              </label>
              <span className="text-2xl font-black text-cyan-600">{units}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Operating Hours / Day
              </label>
              <span className="text-2xl font-black text-blue-600">{shiftHours} h</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={shiftHours}
              onChange={(e) => setShiftHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: CircleDollarSign, label: 'Net Monthly Savings', value: '$' + monthly.netSavings.toLocaleString(), color: 'text-emerald-600' },
              { icon: TrendingUp, label: 'Payback Period', value: monthly.paybackMonths.toFixed(1) + ' months', color: 'text-cyan-600' },
              { icon: Clock, label: 'Labor Hours Replaced', value: monthly.hoursReplaced.toLocaleString() + ' /mo', color: 'text-blue-600' },
              { icon: Gauge, label: 'Added Throughput', value: '+' + monthly.throughputPct + '%', color: 'text-purple-600' },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80">
                  <Icon className={'w-5 h-5 mb-2 ' + kpi.color} />
                  <p className={'text-xl font-black ' + kpi.color}>{kpi.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Model assumes ${HOURLY_LABOR_COST}/h replaced manual labor, ${UNIT_HOURLY_COST}/h per-unit operating cost,
            and a 24-month amortized capex window. Figures are illustrative.
          </p>
        </GlassCard>

        <GlassCard className="p-7">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-extrabold">Deployment Request Received</h3>
              <p className="text-sm text-slate-600 max-w-sm">
                Thanks, {formData.name}! Our field-ops team will reach out within 2 business days
                with a scoped pilot plan{formData.company ? <> for <span className="font-semibold">{formData.company}</span></> : null}.
              </p>
              <button
                onClick={handleReset}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-cyan-500/40 text-cyan-600 hover:bg-cyan-500/10 transition-colors flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" /> Simulate Another Deployment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-bold mb-1">Reserve a Pilot Unit</h3>
              <p className="text-xs text-slate-500">
                Q1 2027 pilot slots are opening. Lock yours with a 15-minute scoping call.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
                <input
                  required
                  type="email"
                  placeholder="Work email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
                <input
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="px-4 py-3 rounded-xl text-sm bg-white/80 border border-slate-200 focus:border-cyan-500 outline-none"
                >
                  {SECTORS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-slate-500 p-3 rounded-xl bg-slate-100/70 border border-slate-200">
                Summary: <span className="font-bold text-cyan-600">{units} units</span> ·{' '}
                <span className="font-bold">{shiftHours} h/day</span> · est.{' '}
                <span className="font-bold text-emerald-600">${monthly.netSavings.toLocaleString()}/mo</span> net savings
              </div>
              <PrimaryButton type="submit" className="w-full">
                <Send className="w-4 h-4" /> Request Pilot Deployment
              </PrimaryButton>
            </form>
          )}
        </GlassCard>
      </div>
    </Section>
  );
}

function useMemoRoi(units: number, shiftHours: number) {
  const daysPerMonth = 26;
  const hoursPerMonth = shiftHours * daysPerMonth;
  const laborReplaced = Math.round(hoursPerMonth * units * 0.55); // 0.55 FTE-equivalent per unit-hour
  const grossSavings = laborReplaced * HOURLY_LABOR_COST;
  const opCost = hoursPerMonth * units * UNIT_HOURLY_COST;
  const netSavings = Math.max(0, Math.round(grossSavings - opCost));
  const capex = units * UNIT_PRICE;
  const paybackMonths = netSavings > 0 ? capex / netSavings : 99;
  return {
    netSavings,
    paybackMonths: Math.min(paybackMonths, 99),
    hoursReplaced: laborReplaced,
    throughputPct: Math.min(240, Math.round(units * shiftHours * 2.4)),
  };
}
