import { Brain, ShieldCheck } from 'lucide-react';
import type { AIAnalysis } from '../../types';

interface AIRecommendationProps {
  analysis: AIAnalysis;
}

export default function AIRecommendation({ analysis }: AIRecommendationProps) {
  const priorityColors: Record<string, string> = {
    Low: 'text-slate-600 bg-slate-100',
    Moderate: 'text-blue-700 bg-blue-100',
    High: 'text-orange-700 bg-orange-100',
    Urgent: 'text-red-700 bg-red-100',
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">AI Referral Assistance</h3>
          <p className="text-xs text-slate-500">Analysis of patient need</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg bg-white/70 p-3 border border-blue-100">
          <p className="text-xs font-medium text-slate-500 mb-1">Identified Need</p>
          <p className="text-sm font-semibold text-slate-800">{analysis.identifiedNeed}</p>
        </div>
        <div className="rounded-lg bg-white/70 p-3 border border-blue-100">
          <p className="text-xs font-medium text-slate-500 mb-1">Suggested Department</p>
          <p className="text-sm font-semibold text-slate-800">{analysis.suggestedDepartment}</p>
        </div>
        <div className="rounded-lg bg-white/70 p-3 border border-blue-100">
          <p className="text-xs font-medium text-slate-500 mb-1">Priority</p>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColors[analysis.priority]}`}>
            {analysis.priority}
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-white/70 p-3 border border-blue-100 mb-4">
        <p className="text-xs font-medium text-slate-500 mb-1">Reason</p>
        <p className="text-sm text-slate-700">{analysis.reason}</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-blue-100/50 border border-blue-200 p-3">
        <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          <span className="font-semibold">AI provides referral assistance only.</span> The health worker makes the final referral decision. This is not a diagnosis or treatment recommendation.
        </p>
      </div>
    </div>
  );
}
