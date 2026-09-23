import type { ReferralStatus, ReferralPriority } from '../../types';

interface StatusBadgeProps {
  status: ReferralStatus | ReferralPriority | string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Referred': 'bg-indigo-100 text-indigo-700',
  'Consultation Pending': 'bg-amber-100 text-amber-700',
  'Consultation Completed': 'bg-teal-100 text-teal-700',
  'Follow-up Due': 'bg-yellow-100 text-yellow-800',
  'Overdue': 'bg-red-100 text-red-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Due': 'bg-yellow-100 text-yellow-800',
  // Priority
  'Low': 'bg-slate-100 text-slate-600',
  'Moderate': 'bg-blue-100 text-blue-700',
  'High': 'bg-orange-100 text-orange-700',
  'Urgent': 'bg-red-100 text-red-700',
  // Other
  'Active': 'bg-emerald-100 text-emerald-700',
  'Inactive': 'bg-slate-100 text-slate-500',
  'Open': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-slate-100 text-slate-500',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-600';
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${style} ${sizeClass}`}>
      {status === 'Overdue' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />}
      {status === 'Urgent' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />}
      {status}
    </span>
  );
}
