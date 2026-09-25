import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, Search, FileText, CalendarCheck,
  Users, Building2, Bell, Settings, X, Activity
} from 'lucide-react';
import SyncIndicator from '../ui/SyncIndicator';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/new-referral', icon: PlusCircle, label: 'New Referral' },
  { to: '/find-facility', icon: Search, label: 'Find Facility' },
  { to: '/my-referrals', icon: FileText, label: 'My Referrals' },
  { to: '/follow-ups', icon: CalendarCheck, label: 'Follow-ups' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/facilities', icon: Building2, label: 'Facilities' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, syncState, pendingSyncCount, unreadNotificationCount } = useApp();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-navy-950 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">OfflineRx</h1>
              <p className="text-[10px] text-blue-300 -mt-0.5 leading-tight">AI-Powered Referral System</p>
            </div>
          </button>
          <button onClick={onClose} className="lg:hidden rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{label}</span>
              {label === 'Notifications' && unreadNotificationCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadNotificationCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Frontline Health Worker</p>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.role} {user.name}</p>
              <SyncIndicator state={syncState} pendingCount={pendingSyncCount} compact />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
