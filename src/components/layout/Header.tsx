import { Menu, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SyncIndicator from '../ui/SyncIndicator';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { syncState, pendingSyncCount, lastSyncTime, unreadNotificationCount, user } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{title}</h1>
            {syncState !== 'online' && (
              <p className="text-xs text-slate-400">Last synced {lastSyncTime}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search - hidden on mobile */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:bg-white transition-colors"
            />
          </div>

          <SyncIndicator state={syncState} pendingCount={pendingSyncCount} />

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
            aria-label="User profile"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
