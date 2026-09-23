import type { TimelineEntry } from '../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative">
      {entries.map((entry, index) => (
        <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Connector line */}
          {index < entries.length - 1 && (
            <div className={`absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5 ${
              entry.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'
            }`} />
          )}

          {/* Icon */}
          <div className="relative z-10 flex-shrink-0">
            {entry.status === 'completed' ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            ) : entry.status === 'current' ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 ring-4 ring-blue-50">
                <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                <Circle className="h-5 w-5 text-slate-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <p className={`font-semibold text-sm ${
              entry.status === 'completed' ? 'text-emerald-700' :
              entry.status === 'current' ? 'text-blue-700' :
              'text-slate-400'
            }`}>
              {entry.stage}
              {entry.status === 'completed' && <span className="ml-2 text-emerald-500">✓</span>}
              {entry.status === 'current' && <span className="ml-2">●</span>}
              {entry.status === 'pending' && <span className="ml-2 text-slate-300">○</span>}
            </p>
            {entry.date && (
              <p className="text-xs text-slate-500 mt-0.5">
                {entry.date}{entry.time && ` — ${entry.time}`}
              </p>
            )}
            {entry.note && (
              <p className="text-xs text-slate-500 mt-1 italic bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100">
                {entry.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
