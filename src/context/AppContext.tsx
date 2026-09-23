import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Patient, Referral, Notification, FollowUp, SyncState, AppUser, CaseNote } from '../types';
import { patients as mockPatients } from '../data/patients';
import { referrals as mockReferrals } from '../data/referrals';
import { notifications as mockNotifications } from '../data/notifications';
import { followUps as mockFollowUps } from '../data/followUps';

interface AppContextType {
  user: AppUser;
  patients: Patient[];
  referrals: Referral[];
  notifications: Notification[];
  followUps: FollowUp[];
  syncState: SyncState;
  pendingSyncCount: number;
  lastSyncTime: string;
  localRecordCount: number;
  isAuthenticated: boolean;
  toasts: Toast[];
  // Actions
  login: () => void;
  logout: () => void;
  addReferral: (referral: Referral) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  addPatient: (patient: Patient) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  syncData: () => Promise<void>;
  setSyncState: (state: SyncState) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  completeFollowUp: (id: string) => void;
  addCaseNote: (referralId: string, note: CaseNote) => void;
  unreadNotificationCount: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`offlinerx_${key}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`offlinerx_${key}`, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadFromStorage('authenticated', false));
  const [patients, setPatients] = useState<Patient[]>(() => loadFromStorage('patients', mockPatients));
  const [referrals, setReferrals] = useState<Referral[]>(() => loadFromStorage('referrals', mockReferrals));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('notifications', mockNotifications));
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => loadFromStorage('followUps', mockFollowUps));
  const [syncState, setSyncState] = useState<SyncState>(() => (navigator.onLine ? 'online' : 'offline'));
  const [pendingSyncCount, setPendingSyncCount] = useState(() => loadFromStorage('pendingSyncCount', 4));
  const [lastSyncTime, setLastSyncTime] = useState('05 Sep 2026 — 4:32 PM');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const user: AppUser = {
    name: 'Priya',
    workerId: 'ANM-CBE-2026-042',
    role: 'ANM',
    district: 'Coimbatore',
    block: 'Sulur',
  };

  // Persist to localStorage
  useEffect(() => { saveToStorage('patients', patients); }, [patients]);
  useEffect(() => { saveToStorage('referrals', referrals); }, [referrals]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('followUps', followUps); }, [followUps]);
  useEffect(() => { saveToStorage('authenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveToStorage('pendingSyncCount', pendingSyncCount); }, [pendingSyncCount]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setSyncState(pendingSyncCount > 0 ? 'pending' : 'online');
    const handleOffline = () => setSyncState('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSyncCount]);

  const login = useCallback(() => setIsAuthenticated(true), []);
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('offlinerx_authenticated');
  }, []);

  const addReferral = useCallback((referral: Referral) => {
    setReferrals((prev) => [referral, ...prev]);
    setPendingSyncCount((c) => c + 1);
    if (!navigator.onLine) setSyncState('offline');
  }, []);

  const updateReferral = useCallback((id: string, updates: Partial<Referral>) => {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setPendingSyncCount((c) => c + 1);
  }, []);

  const addPatient = useCallback((patient: Patient) => {
    setPatients((prev) => [patient, ...prev]);
    setPendingSyncCount((c) => c + 1);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const syncData = useCallback(async () => {
    setSyncState('syncing');
    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setPendingSyncCount(0);
    const now = new Date();
    const formatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setLastSyncTime(formatted);
    setSyncState('online');
    addToast({ type: 'success', title: 'Data synchronized', message: 'All data has been synchronized successfully.' });
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeFollowUp = useCallback((id: string) => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === id ? { ...fu, status: 'Completed' as const, completedDate: new Date().toISOString().split('T')[0] } : fu
      )
    );
    setPendingSyncCount((c) => c + 1);
  }, []);

  const addCaseNote = useCallback((referralId: string, note: CaseNote) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId ? { ...r, caseNotes: [...r.caseNotes, note] } : r
      )
    );
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const localRecordCount = patients.length + referrals.length + followUps.length;

  return (
    <AppContext.Provider
      value={{
        user,
        patients,
        referrals,
        notifications,
        followUps,
        syncState,
        pendingSyncCount,
        lastSyncTime,
        localRecordCount,
        isAuthenticated,
        toasts,
        login,
        logout,
        addReferral,
        updateReferral,
        addPatient,
        markNotificationRead,
        markAllNotificationsRead,
        syncData,
        setSyncState,
        addToast,
        removeToast,
        completeFollowUp,
        addCaseNote,
        unreadNotificationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
