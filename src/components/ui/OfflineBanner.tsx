import { WifiOff, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OfflineBanner() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3 animate-fade-in">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
        <WifiOff className="h-5 w-5 text-amber-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-amber-800">You are currently working offline</p>
        <p className="text-sm text-amber-700 mt-0.5">
          Your changes will be stored locally and synced when connectivity is available.
        </p>
      </div>
      <button
        onClick={() => navigate('/offline')}
        className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
      >
        <Database className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" />
        View Offline Data
      </button>
    </div>
  );
}
