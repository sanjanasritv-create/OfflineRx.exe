import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'slate';
  onClick?: () => void;
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  orange: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-100' },
  slate: { bg: 'bg-slate-50', icon: 'text-slate-600', border: 'border-slate-100' },
};

export default function StatCard({ icon: Icon, value, label, color = 'blue', onClick }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-xl border ${colors.border} bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 text-left w-full cursor-pointer`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
        <Icon className={`h-6 w-6 ${colors.icon}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </button>
  );
}
