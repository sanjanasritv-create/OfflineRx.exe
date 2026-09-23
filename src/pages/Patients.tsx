import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Plus, MapPin, ChevronRight, User } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import type { Patient } from '../types';

export default function Patients() {
  const { patients, addPatient, referrals } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    village: '',
    district: ''
  });

  const filteredPatients = useMemo(() => {
    return patients.filter((p: Patient) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [patients, searchQuery]);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({
      id: `PAT-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age) || 0,
      gender: (formData.gender as Patient['gender']) || 'Other',
      phone: formData.phone,
      village: formData.village,
      district: formData.district,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
    setFormData({ name: '', age: '', gender: 'Male', phone: '', village: '', district: '' });
  };

  const getActiveReferral = (patientId: string) => {
    return referrals.find((r) => r.patientId === patientId && r.status !== 'Completed');
  };

  const maskPhone = (phone: string) => {
    if (!phone) return 'N/A';
    if (phone.length < 4) return phone;
    return `******${phone.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500">Manage and track your patients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search patient by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Mobile view: Cards */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {filteredPatients.length > 0 ? filteredPatients.map(patient => {
              const activeReferral = getActiveReferral(patient.id);
              return (
                <div key={patient.id} className="p-4 space-y-3 cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/patient/${patient.id}`)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                      <p className="text-sm text-slate-500">{patient.id}</p>
                    </div>
                    <StatusBadge status={patient.status || 'active'} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-slate-600 gap-1.5">
                      <User size={14} className="text-slate-400" /> {patient.age} yrs, {patient.gender.charAt(0)}
                    </div>
                    <div className="flex items-center text-slate-600 gap-1.5">
                      <MapPin size={14} className="text-slate-400" /> {patient.village}
                    </div>
                  </div>
                  {activeReferral && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Active Referral</p>
                      <Link to={`/referral/${activeReferral.id}`} onClick={e => e.stopPropagation()} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                        {activeReferral.referralId} — {activeReferral.facilityName}
                      </Link>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="p-8 text-center text-slate-500">No patients found.</div>
            )}
          </div>

          {/* Desktop view: Table */}
          <table className="w-full text-left hidden sm:table">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Patient</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Location & Contact</th>
                <th className="px-6 py-4">Active Referral</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.length > 0 ? filteredPatients.map((patient) => {
                const activeReferral = getActiveReferral(patient.id);
                return (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{patient.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{patient.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {patient.age} yrs • {patient.gender}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{patient.village}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{maskPhone(patient.phone)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {activeReferral ? (
                        <Link 
                          to={`/referral/${activeReferral.id}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 font-medium hover:underline flex items-center gap-1"
                        >
                          View Referral
                          <ChevronRight size={14} />
                        </Link>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={patient.status || 'active'} />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Ramesh Kumar" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input required type="number" min="0" max="150" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="10-digit number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Village/Town</label>
              <input required type="text" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
              <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Save Patient</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
