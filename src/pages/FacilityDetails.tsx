import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { facilities } from '../data/facilities';
import EmptyState from '../components/ui/EmptyState';

export default function FacilityDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const facility = facilities.find(f => f.id === id);

  if (!facility) {
    return (
      <EmptyState 
        icon={MapPin}
        title="Facility Not Found"
        message="The facility you are looking for does not exist or has been removed."
        action={{ label: 'Back to Facilities', onClick: () => navigate('/find-facility') }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/find-facility')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Facilities
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{facility.name}</h1>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {facility.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Verified Facility</span>
                <span className="text-slate-300">•</span>
                <span>Distance: {facility.distance || '5km'}</span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                  <span>{facility.address || 'Medical College Road, City Center'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-slate-400" />
                  <span>{facility.phone || '+91 800 123 4567'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-slate-400" />
                  <span>{facility.openingHours || '24/7 Emergency, OPD 9AM - 4PM'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <button 
                onClick={() => navigate(`/new-referral?facility=${facility.id}`)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-medium transition-colors shadow-sm"
              >
                Create Referral
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-slate-50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Why this facility was recommended</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Department match for required treatment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Services available for patient needs</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Location within accessible distance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Departments</h3>
            <div className="flex flex-wrap gap-2">
              {facility.departments.map(dep => (
                <span key={dep} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-sm font-medium">
                  {dep}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Services</h3>
            <div className="flex flex-wrap gap-2">
              {facility.services?.map(service => (
                <span key={service} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-md text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
