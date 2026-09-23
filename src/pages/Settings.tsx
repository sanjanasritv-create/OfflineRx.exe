import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/ui/Modal';
import { User, Shield, Database, Globe } from 'lucide-react';

export default function Settings() {
  const { user, lastSyncTime, localRecordCount, addToast } = useApp();
  const [showClearModal, setShowClearModal] = useState(false);
  const [language, setLanguage] = useState('English');

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Profile */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">Worker Name</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{user.name}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">Worker ID</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{user.workerId}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">Role</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{user.role}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wider">Assigned District</label>
            <p className="text-sm font-medium text-slate-800 mt-1">Madurai Block-3</p>
          </div>
        </div>
      </div>

      {/* Application */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Globe className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Application</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Language</p>
              <p className="text-xs text-slate-500">Select your preferred language</p>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
            >
              <option>English</option>
              <option>Tamil</option>
              <option>Hindi</option>
            </select>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-800">Push Notifications</p>
              <p className="text-xs text-slate-500">Receive alerts for follow-ups and referrals</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-blue-600 p-0.5 cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-white translate-x-5 transition-transform" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-800">Sound Alerts</p>
              <p className="text-xs text-slate-500">Play sound for urgent notifications</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-slate-300 p-0.5 cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-white transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Change Password</p>
              <p className="text-xs text-slate-500">Update your account password</p>
            </div>
            <button
              onClick={() => addToast({ type: 'info', title: 'Feature coming soon' })}
              className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Change
            </button>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-800">Session</p>
            <p className="text-xs text-slate-500 mt-1">Logged in since {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <Database className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Data</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Last Synchronization</p>
            <p className="text-sm font-medium text-slate-800">{lastSyncTime}</p>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-600">Local Records</p>
            <p className="text-sm font-medium text-slate-800">{localRecordCount} records</p>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => setShowClearModal(true)}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Clear Local Data
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Clear Local Data?">
        <p className="text-sm text-slate-600 mb-6">This will remove all locally cached data. Any unsynced changes will be lost. Are you sure?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setShowClearModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => { setShowClearModal(false); addToast({ type: 'success', title: 'Local data cleared' }); }} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Clear Data</button>
        </div>
      </Modal>
    </div>
  );
}
