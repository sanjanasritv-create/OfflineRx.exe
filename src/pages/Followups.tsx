import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { CalendarClock, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export default function Followups() {
  const navigate = useNavigate();
  const { referrals } = useApp();

  // Derive follow-up data from referrals that have follow-up info
  const followUpDue = referrals.filter(r => r.status === 'Follow-up Due');
  const overdue = referrals.filter(r => r.status === 'Overdue');
  const followUpCompleted = referrals.filter(r => r.followUpStatus === 'Completed');
  const consultationCompleted = referrals.filter(r =>
    r.status === 'Consultation Completed' || r.consultationStatus === 'Attended'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Follow-ups</h1>
        <p className="text-slate-500">Keep every patient journey moving toward closure.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Follow-up Due" value={followUpDue.length.toString()} icon={CalendarClock} color="orange" />
        <StatCard label="Overdue" value={overdue.length.toString()} icon={AlertTriangle} color="red" />
        <StatCard label="Consultation Done" value={consultationCompleted.length.toString()} icon={Clock} color="blue" />
        <StatCard label="Follow-up Completed" value={followUpCompleted.length.toString()} icon={CheckCircle} color="green" />
      </div>

      <div className="space-y-8">
        {/* Overdue */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-red-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">Overdue Follow-ups</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {overdue.length === 0 ? (
              <div className="p-8">
                <EmptyState icon={CheckCircle} title="All caught up" message="There are no overdue follow-ups." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Patient</th>
                      <th className="px-6 py-3 font-medium">Referral ID</th>
                      <th className="px-6 py-3 font-medium">Follow-up Date</th>
                      <th className="px-6 py-3 font-medium">Facility</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {overdue.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{r.patientName}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{r.referralId}</td>
                        <td className="px-6 py-4 text-red-600 font-medium">{r.followUpDate || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{r.facilityName}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/referral/${r.id}`)}
                            className="text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Follow-up Due */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">Follow-up Due</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {followUpDue.length === 0 ? (
              <div className="p-8">
                <EmptyState icon={CheckCircle} title="No follow-ups due" message="All follow-ups are up to date." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Patient</th>
                      <th className="px-6 py-3 font-medium">Referral ID</th>
                      <th className="px-6 py-3 font-medium">Consultation</th>
                      <th className="px-6 py-3 font-medium">Consultation Date</th>
                      <th className="px-6 py-3 font-medium">Follow-up Date</th>
                      <th className="px-6 py-3 font-medium">Reason</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {followUpDue.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{r.patientName}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{r.referralId}</td>
                        <td className="px-6 py-4">
                          <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">Completed</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{r.consultationDate || '-'}</td>
                        <td className="px-6 py-4 text-amber-700 font-medium">{r.followUpDate || '-'}</td>
                        <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">{r.followUpReason || '-'}</td>
                        <td className="px-6 py-4"><StatusBadge status="Follow-up Due" /></td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/referral/${r.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Follow-up Completed */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">Follow-up Completed</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {followUpCompleted.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No completed follow-ups yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Patient</th>
                      <th className="px-6 py-3 font-medium">Referral ID</th>
                      <th className="px-6 py-3 font-medium">Follow-up Date</th>
                      <th className="px-6 py-3 font-medium">Outcome</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {followUpCompleted.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{r.patientName}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{r.referralId}</td>
                        <td className="px-6 py-4 text-slate-600">{r.followUpDate || '-'}</td>
                        <td className="px-6 py-4 text-slate-600 max-w-[250px] truncate">{r.followUpOutcome || '-'}</td>
                        <td className="px-6 py-4"><StatusBadge status="Completed" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
