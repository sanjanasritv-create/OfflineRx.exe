import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilities } from '../data/facilities';
import SearchBar from '../components/ui/SearchBar';
import { Building2, MapPin, CheckCircle2 } from 'lucide-react';

export default function Facilities() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  const types = ['All', 'PHC', 'CHC', 'Government Hospital', 'District Hospital', 'Specialist Centre'];

  const filtered = useMemo(() => {
    return facilities.filter(f => {
      const matchType = activeType === 'All' || f.type === activeType;
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.departments.some(d => d.toLowerCase().includes(search.toLowerCase())) ||
        f.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [search, activeType]);

  const typeColors: Record<string, string> = {
    PHC: 'bg-blue-100 text-blue-700',
    CHC: 'bg-indigo-100 text-indigo-700',
    'Government Hospital': 'bg-emerald-100 text-emerald-700',
    'District Hospital': 'bg-violet-100 text-violet-700',
    'Specialist Centre': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Healthcare Facilities</h1>
        <p className="text-slate-500">Browse the facility knowledge base.</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search facilities, departments, or services..." />

      {/* Type Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeType === type
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Facility List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No facilities match your search.</p>
          </div>
        ) : (
          filtered.map(facility => (
            <button
              key={facility.id}
              onClick={() => navigate(`/facility/${facility.id}`)}
              className="w-full text-left rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{facility.name}</h3>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${typeColors[facility.type] || 'bg-slate-100 text-slate-700'}`}>
                    {facility.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {facility.distance} km
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`h-2 w-2 rounded-full ${facility.isOpen ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    <span className="text-xs text-slate-500">{facility.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {facility.departments.slice(0, 4).map(dept => (
                  <span key={dept} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{dept}</span>
                ))}
                {facility.departments.length > 4 && (
                  <span className="text-xs text-slate-400">+{facility.departments.length - 4} more</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <CheckCircle2 className="h-3 w-3" />
                Last verified: {facility.lastVerified}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
