import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewReferral from './pages/NewReferral';
import FindFacility from './pages/FindFacility';
import FacilityDetails from './pages/FacilityDetails';
import MyReferrals from './pages/MyReferrals';
import ReferralTracking from './pages/ReferralTracking';
import Followups from './pages/Followups';
import Patients from './pages/Patients';
import PatientCase from './pages/PatientCase';
import Facilities from './pages/Facilities';
import Notifications from './pages/Notifications';
import OfflineData from './pages/OfflineData';
import Settings from './pages/Settings';
import ImpactBenefits from './pages/ImpactBenefits';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-referral" element={<NewReferral />} />
          <Route path="/find-facility" element={<FindFacility />} />
          <Route path="/facility/:id" element={<FacilityDetails />} />
          <Route path="/my-referrals" element={<MyReferrals />} />
          <Route path="/referral/:id" element={<ReferralTracking />} />
          <Route path="/follow-ups" element={<Followups />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patient/:id" element={<PatientCase />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/offline" element={<OfflineData />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/impact" element={<ImpactBenefits />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
