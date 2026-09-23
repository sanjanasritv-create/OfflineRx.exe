import { MapPin, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { FacilityMatch, Facility } from '../../types';

interface FacilityCardProps {
  facility: Facility | FacilityMatch;
  onSelect?: () => void;
  onViewDetails?: () => void;
  showMatchScore?: boolean;
  compact?: boolean;
}

export default function FacilityCard({ facility, onSelect, onViewDetails, showMatchScore = false, compact = false }: FacilityCardProps) {
  const matchFacility = facility as FacilityMatch;
  const hasMatchScore = showMatchScore && 'matchScore' in facility;

  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{facility.name}</h3>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {facility.type}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {facility.distance} km
            </span>
            <span className={`flex items-center gap-1 text-xs font-medium ${facility.isOpen ? 'text-emerald-600' : 'text-slate-400'}`}>
              {facility.isOpen ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {facility.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
        {hasMatchScore && (
          <div className="flex flex-col items-center shrink-0 ml-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl font-bold text-lg ${
              matchFacility.matchScore >= 90 ? 'bg-emerald-50 text-emerald-600' :
              matchFacility.matchScore >= 80 ? 'bg-blue-50 text-blue-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              {matchFacility.matchScore}%
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">Match</span>
          </div>
        )}
      </div>

      {!compact && (
        <>
          <div className="mb-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Departments</p>
            <div className="flex flex-wrap gap-1">
              {facility.departments.slice(0, 4).map((dept) => (
                <span key={dept} className="rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600 border border-slate-100">
                  {dept}
                </span>
              ))}
              {facility.departments.length > 4 && (
                <span className="text-xs text-slate-400">+{facility.departments.length - 4} more</span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs font-medium text-slate-500 mb-1">Services</p>
            <div className="flex flex-wrap gap-1">
              {facility.services.slice(0, 4).map((svc) => (
                <span key={svc} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  {svc}
                </span>
              ))}
              {facility.services.length > 4 && (
                <span className="text-xs text-slate-400">+{facility.services.length - 4} more</span>
              )}
            </div>
          </div>

          {hasMatchScore && matchFacility.matchReasons && (
            <div className="mb-3 rounded-lg bg-emerald-50 p-3 border border-emerald-100">
              <p className="text-xs font-medium text-emerald-700 mb-1">Why recommended</p>
              {matchFacility.matchReasons.map((reason, i) => (
                <p key={i} className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {reason}
                </p>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {facility.openingHours}
          </div>
        </>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        {onSelect && (
          <button
            onClick={onSelect}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            Select Facility <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className={`rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors ${onSelect ? '' : 'flex-1'}`}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
