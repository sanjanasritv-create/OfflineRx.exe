import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CalendarCheck, FileText, Settings, Bell } from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Urgent', 'Follow-up', 'Referral', 'System'];

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return notifications;
    return notifications.filter(n => n.category === activeCategory);
  }, [notifications, activeCategory]);

  const iconMap: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
    Urgent: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    'Follow-up': { icon: CalendarCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    Referral: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    System: { icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">{notifications.filter(n => !n.read).length} unread</p>
        </div>
        <button
          onClick={markAllNotificationsRead}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No notifications</p>
          </div>
        ) : (
          filtered.map(notification => {
            const config = iconMap[notification.category] || iconMap.system;
            const Icon = config.icon;
            return (
              <button
                key={notification.id}
                onClick={() => {
                  markNotificationRead(notification.id);
                  if (notification.actionUrl) navigate(notification.actionUrl);
                }}
                className={`w-full text-left flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-sm ${
                  notification.read
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/30 border-blue-100 shadow-sm'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                    <p className={`text-sm font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.title}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notification.timestamp}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
