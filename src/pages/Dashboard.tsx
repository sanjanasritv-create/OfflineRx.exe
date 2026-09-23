import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileText, CalendarCheck, AlertTriangle, CheckCircle, Database, 
  Plus, Search, Users, ChevronRight, MapPin
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import OfflineBanner from '../components/ui/OfflineBanner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { syncState, pendingSyncCount, referrals } = useApp();

  const pendingReferrals = referrals?.filter(r => r.status !== 'Completed') || [];
  
  const pendingCount = pendingReferrals.length;
  const followUpsDue = referrals.filter(r => r.status === 'Follow-up Due').length || 7;
  const overdueCount = referrals.filter(r => r.status === 'Overdue').length || 3;
  const completedMonth = 28;

  const quickActions = [
    {
      title: 'New Referral',
      description: 'Create AI-assisted referral',
      icon: <Plus className="w-6 h-6 text-blue-600" />,
      path: '/new-referral',
      color: 'bg-blue-100'
    },
    {
      title: 'Find Facility',
      description: 'Search specialized centers',
      icon: <Search className="w-6 h-6 text-indigo-600" />,
      path: '/find-facility',
      color: 'bg-indigo-100'
    },
    {
      title: 'Follow-ups',
      description: 'View upcoming & overdue',
      icon: <CalendarCheck className="w-6 h-6 text-orange-600" />,
      path: '/follow-ups',
      color: 'bg-orange-100'
    },
    {
      title: 'Patients',
      description: 'Patient directory & history',
      icon: <Users className="w-6 h-6 text-green-600" />,
      path: '/patients',
      color: 'bg-green-100'
    }
  ];

  return (
    <div className="space-y-6 animate-slide-up pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, Priya</h1>
          <p className="text-slate-500">Manage patient referrals and follow-ups.</p>
        </div>
      </div>

      {syncState !== 'online' && (
        <OfflineBanner />
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Pending Referrals"
          value={pendingCount.toString()}
          icon={FileText}
          color="blue"
        />
        <StatCard
          label="Follow-ups Due"
          value={followUpsDue.toString()}
          icon={CalendarCheck}
          color="orange"
        />
        <StatCard
          label="Overdue Cases"
          value={overdueCount.toString()}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          label="Completed This Month"
          value={completedMonth.toString()}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Offline Changes"
          value={pendingSyncCount.toString()}
          icon={Database}
          color="slate"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">{action.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Referrals Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Pending Referral Cases</h2>
          <Link to="/referrals" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Healthcare Need</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Facility</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Follow-up</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {pendingReferrals.length > 0 ? (
                  pendingReferrals.slice(0, 5).map((referral) => (
                    <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{referral.patientName}</div>
                        <div className="text-sm text-slate-500">ID: {referral.patientId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{referral.identifiedNeed}</div>
                        <div className="text-xs text-slate-500">{referral.suggestedDepartment}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {referral.facilityName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={referral.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {referral.followUpDate ? new Date(referral.followUpDate).toLocaleDateString() : 'Not scheduled'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/referrals/${referral.id}`)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No pending referrals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prominent Tagline Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl p-6 shadow-md text-center">
        <h3 className="text-white font-bold text-lg md:text-xl tracking-wide flex flex-wrap items-center justify-center gap-2">
          <span>RIGHT PATIENT</span> 
          <ChevronRight className="w-5 h-5 text-blue-200" />
          <span>RIGHT FACILITY</span>
          <ChevronRight className="w-5 h-5 text-blue-200" />
          <span>RIGHT TIME</span>
          <ChevronRight className="w-5 h-5 text-blue-200" />
          <span className="text-blue-100">COMPLETED FOLLOW-UP</span>
        </h3>
      </div>
    </div>
  );
}
