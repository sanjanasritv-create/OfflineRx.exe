import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  steps?: { label: string; completed: boolean }[];
}

export default function LoadingState({ message = 'Processing...', steps }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-blue-200 animate-ping opacity-20" />
      </div>
      <p className="text-lg font-medium text-slate-700 mb-4">{message}</p>
      {steps && (
        <div className="space-y-3 w-full max-w-xs">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {step.completed ? (
                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              )}
              <span className={`text-sm ${step.completed ? 'text-emerald-600 font-medium' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
