import { 
  ArrowRight, Heart, DollarSign, Settings, Users, Building2, 
  Stethoscope, Brain, Database, Search, CheckCircle, UserCheck, 
  MapPin, WifiOff, Bell, ArrowDown, Layers
} from 'lucide-react';

export default function ImpactBenefits() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Impact & Benefits</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          How OfflineRx transforms rural healthcare referral management for frontline health workers and underserved communities.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-semibold">
          <span className="rounded-full bg-white/20 px-4 py-1.5">RIGHT PATIENT</span>
          <span className="text-blue-200">→</span>
          <span className="rounded-full bg-white/20 px-4 py-1.5">RIGHT FACILITY</span>
          <span className="text-blue-200">→</span>
          <span className="rounded-full bg-white/20 px-4 py-1.5">RIGHT TIME</span>
          <span className="text-blue-200">→</span>
          <span className="rounded-full bg-white/20 px-4 py-1.5">COMPLETED FOLLOW-UP</span>
        </div>
      </div>

      {/* Target Users */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Who Benefits</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: UserCheck, label: 'ASHA Workers' },
            { icon: Stethoscope, label: 'ANMs' },
            { icon: Users, label: 'Frontline Workers' },
            { icon: Heart, label: 'Rural Patients' },
            { icon: Building2, label: 'PHCs & CHCs' },
            { icon: Building2, label: 'District Facilities' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <item.icon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Before → After */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Before → After</h2>
        <div className="space-y-3">
          {[
            { before: 'Unclear referral', after: 'AI-assisted facility identification', icon: Brain },
            { before: 'Unnecessary travel', after: 'Nearby suitable facility', icon: MapPin },
            { before: 'Referral gets lost', after: 'End-to-end case tracking', icon: Layers },
            { before: 'Missed follow-up', after: 'Worker dashboard alerts', icon: Bell },
            { before: 'Internet dependency', after: 'Offline-first operation', icon: WifiOff },
          ].map((item) => (
            <div key={item.before} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <item.icon className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-600 line-through">{item.before}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-700">{item.after}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits - 3 categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Social */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-blue-800">Social Impact</h3>
          </div>
          <ul className="space-y-2">
            {['Better access to public healthcare', 'Improved referral completion rates', 'Better continuity of care', 'Reduced patient confusion and delays'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-blue-700">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Economic */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-emerald-800">Economic Impact</h3>
          </div>
          <ul className="space-y-2">
            {['Potential reduction in unnecessary travel', 'Better use of existing facilities', 'Reduced coordination overhead', 'Lower healthcare access costs'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-emerald-700">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Operational */}
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-violet-800">Operational Impact</h3>
          </div>
          <ul className="space-y-2">
            {['Supports frontline workers', 'Centralizes referral status', 'Makes overdue cases visible', 'Streamlines the referral workflow'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-violet-700">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-violet-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Architecture Visualization */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">System Architecture</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main flow */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider">Application Flow</h3>
            <div className="space-y-3">
              {[
                { label: 'Health Worker', desc: 'Frontline user', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { label: 'Frontend Interface', desc: 'OfflineRx application', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
                { label: 'Backend API', desc: 'Data processing & sync', color: 'bg-violet-100 text-violet-700 border-violet-200' },
                { label: 'Patient / Case Data', desc: 'Referral & follow-up records', color: 'bg-slate-100 text-slate-700 border-slate-200' },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className={`rounded-lg border p-3 ${item.color}`}>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs opacity-80">{item.desc}</p>
                  </div>
                  {i < 3 && <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-slate-300" /></div>}
                </div>
              ))}
            </div>
          </div>

          {/* AI Workflow */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider">AI Workflow</h3>
            <div className="space-y-3">
              {[
                { label: 'Local AI', desc: 'Understanding patient need', icon: Brain, color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { label: 'RAG', desc: 'Retrieving facility knowledge', icon: Database, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
                { label: 'Matching / Ranking', desc: 'Department + Services + Location', icon: Search, color: 'bg-violet-100 text-violet-700 border-violet-200' },
                { label: 'Worker Decision', desc: 'Final decision-maker', icon: UserCheck, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className={`rounded-lg border p-3 flex items-center gap-3 ${item.color}`}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs opacity-80">{item.desc}</p>
                    </div>
                  </div>
                  {i < 3 && <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-slate-300" /></div>}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
              <p><strong>AI</strong> = Understands request</p>
              <p><strong>RAG</strong> = Retrieves facility facts</p>
              <p><strong>Matching</strong> = Ranks suitable options</p>
              <p><strong>Worker</strong> = Final decision-maker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Access Flow */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
          <span className="rounded-lg bg-white/20 px-3 py-1.5">ACCESS</span>
          <ArrowRight className="h-4 w-4" />
          <span className="rounded-lg bg-white/20 px-3 py-1.5">REFERRAL</span>
          <ArrowRight className="h-4 w-4" />
          <span className="rounded-lg bg-white/20 px-3 py-1.5">CONSULTATION</span>
          <ArrowRight className="h-4 w-4" />
          <span className="rounded-lg bg-white/20 px-3 py-1.5">FOLLOW-UP</span>
          <ArrowRight className="h-4 w-4" />
          <span className="rounded-lg bg-white/20 px-3 py-1.5">CLOSURE</span>
        </div>
      </div>
    </div>
  );
}
