import { Wifi, WifiOff, RefreshCw, CloudOff } from 'lucide-react';
import type { SyncState } from '../../types';

interface SyncIndicatorProps {
  state: SyncState;
  pendingCount?: number;
  compact?: boolean;
}

export default function SyncIndicator({ state, pendingCount = 0, compact = false }: SyncIndicatorProps) {
  const configs: Record<SyncState, { icon: React.ReactNode; label: string; sublabel?: string; dotColor: string; textColor: string }> = {
    online: {
      icon: <Wifi className="h-3.5 w-3.5" />,
      label: 'Online',
      sublabel: 'Connected',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    },
    offline: {
      icon: <WifiOff className="h-3.5 w-3.5" />,
      label: 'Offline',
      sublabel: pendingCount > 0 ? `${pendingCount} changes waiting to sync` : 'Working locally',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-600',
    },
    syncing: {
      icon: <RefreshCw className="h-3.5 w-3.5 animate-spin" />,
      label: 'Syncing',
      sublabel: 'Updating local data…',
      dotColor: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    pending: {
      icon: <CloudOff className="h-3.5 w-3.5" />,
      label: 'Offline',
      sublabel: `${pendingCount} changes waiting to sync`,
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-600',
    },
  };

  const config = configs[state];

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${config.textColor}`}>
        <span className={`h-2 w-2 rounded-full ${config.dotColor} ${state === 'syncing' ? 'animate-pulse' : 'animate-pulse-dot'}`} />
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
      state === 'online' ? 'border-emerald-200 bg-emerald-50' :
      state === 'syncing' ? 'border-blue-200 bg-blue-50' :
      'border-amber-200 bg-amber-50'
    }`}>
      <span className={`h-2 w-2 rounded-full ${config.dotColor} ${state !== 'online' ? 'animate-pulse-dot' : ''}`} />
      <span className={`font-medium ${config.textColor}`}>{config.label}</span>
      {config.sublabel && <span className="text-slate-500 hidden sm:inline">· {config.sublabel}</span>}
    </div>
  );
}
