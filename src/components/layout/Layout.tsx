import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/Toast';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/new-referral': 'New Referral',
  '/find-facility': 'Find Healthcare Facility',
  '/my-referrals': 'My Referrals',
  '/follow-ups': 'Follow-up Dashboard',
  '/patients': 'Patients',
  '/facilities': 'Healthcare Facilities',
  '/notifications': 'Notifications',
  '/offline': 'Offline Mode',
  '/settings': 'Settings',
  '/impact': 'Impact & Benefits',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get the page title - handle dynamic routes
  let title = pageTitles[location.pathname] || 'OfflineRx';
  if (location.pathname.startsWith('/referral/')) title = 'Referral Tracking';
  if (location.pathname.startsWith('/patient/')) title = 'Patient Case';
  if (location.pathname.startsWith('/facility/')) title = 'Facility Details';

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
