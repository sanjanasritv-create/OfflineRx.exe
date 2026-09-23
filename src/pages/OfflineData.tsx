import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, RefreshCw, Database, CheckCircle, FileText, Users, Building2, CalendarCheck } from 'lucide-react';

export default function OfflineData() {
  const { syncState, pendingSyncCount, lastSyncTime, localRecordCount, syncData } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncComplete(false);
    await syncData();
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      setTimeout(() => setSyncComplete(false), 3000);
    }, 2000);
  };

  const capabilities = [
    { icon: FileText, label: 'Referral creation', desc: 'Create and save referrals offline' },
    { icon: Users, label: 'Patient data entry', desc: 'Add and edit patient information' },
    { icon: Building2, label: 'Facility lookup', desc: 'Browse cached facility database' },
    { icon: CalendarCheck, label: 'Follow-up tracking', desc: 'View and update follow-ups' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Status Card */}
      <div className={`rounded-2xl p-8 text-center ${
        syncState === 'online' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
      }`}>
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
          syncState === 'online' ? 'bg-emerald-100' : 'bg-amber-100'
        }`}>
          {syncState === 'online'
            ? <Wifi className="h-8 w-8 text-emerald-600" />
            : <WifiOff className="h-8 w-8 text-amber-600" />
          }
        </div>
        <h2 className={`text-xl font-bold ${syncState === 'online' ? 'text-emerald-800' : 'text-amber-800'}`}>
          {syncState === 'online' ? '● Online' : '● Working Offline'}
        </h2>
        <p className={`text-sm mt-1 ${syncState === 'online' ? 'text-emerald-700' : 'text-amber-700'}`}>
          {syncState === 'online'
            ? 'Connected to the server. Data is synced.'
            : 'Your application continues to work without continuous internet connectivity.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-slate-500">Last Sync</p>
          <p className="text-lg font-bold text-slate-800 mt-1">{lastSyncTime}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-slate-500">Pending Sync</p>
          <p className="text-lg font-bold text-slate-800 mt-1">{pendingSyncCount} records</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-slate-500">Local Data</p>
          <p className="text-lg font-bold text-slate-800 mt-1">{localRecordCount} records</p>
        </div>
      </div>

      {/* Sync Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-3 font-medium transition-colors shadow-sm"
        >
          {isSyncing ? (
            <><RefreshCw className="h-5 w-5 animate-spin" /> Syncing...</>
          ) : syncComplete ? (
            <><CheckCircle className="h-5 w-5" /> All data synchronized</>
          ) : (
            <><Database className="h-5 w-5" /> Sync Now</>
          )}
        </button>
      </div>

      {/* Offline Capabilities */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">What works offline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {capabilities.map(cap => (
            <div key={cap.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <cap.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">{cap.label}</p>
                <p className="text-xs text-slate-500">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection States */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Connection States</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-700">Online — Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-700">Offline — Working locally</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />
            <span className="text-sm text-slate-700">Syncing — Updating...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
