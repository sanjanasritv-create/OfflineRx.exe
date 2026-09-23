import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/ui/SearchBar';
import StatusBadge from '../components/ui/StatusBadge';
import { FileText } from 'lucide-react';
import type { ReferralStatus } from '../types';

export default function MyReferrals() {
  const navigate = useNavigate();
  const { referrals } = useApp();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['All', 'New', 'Referred', 'Consultation Pending', 'Consultation Completed', 'Follow-up Due', 'Overdue', 'Completed'];

  const filteredReferrals = useMemo(() => {
    return referrals.filter(r => {
      const matchSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.facilityName && r.facilityName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchTab = activeTab === 'All' || r.status === activeTab;
      return matchSearch && matchTab;
    });
  }, [referrals, activeTab, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Referrals</h1>
          <p className="text-slate-500">Manage and track all patient referrals</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="border-b border-slate-200 overflow-x-auto no-scrollbar">
          <div className="flex px-2 min-w-max">
            {tabs.map(tab => {
              const count = tab === 'All' ? referrals.length : referrals.filter(r => r.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="max-w-md">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by patient, ID, or facility..."
            />
          </div>
        </div>

        {filteredReferrals.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No referrals found</h3>
            <p className="text-slate-500 max-w-sm">We couldn't find any referrals matching your search or selected tab criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Referral ID</th>
                  <th className="px-6 py-4 font-medium">Need</th>
                  <th className="px-6 py-4 font-medium">Facility</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReferrals.map(referral => (
                  <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{referral.patientName}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{referral.id}</td>
                    <td className="px-6 py-4 text-slate-700">{referral.identifiedNeed || 'General Consultation'}</td>
                    <td className="px-6 py-4 text-slate-700">{referral.facilityName || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={referral.status as ReferralStatus} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{referral.createdAt || '2026-09-01'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/referral/${referral.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg text-sm transition-colors border border-transparent hover:border-blue-100"
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
    </div>
  );
}
