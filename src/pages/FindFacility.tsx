import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Building2, ArrowRight, ChevronDown, AlertCircle } from 'lucide-react';
import { facilities, healthcareNeeds } from '../data/facilities';

// Simulate match percentage based on whether the facility offers the requested service
function calculateMatch(facilityServices: string[], need: string): number {
  if (facilityServices.some(s => s.toLowerCase() === need.toLowerCase())) return 95;
  // partial keyword match
  const needWords = need.toLowerCase().split(' ');
  const partialMatch = facilityServices.some(s =>
    needWords.some(w => s.toLowerCase().includes(w))
  );
  if (partialMatch) return 72;
  return 40;
}

export default function FindFacility() {
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const [need, setNeed] = useState('');
  const [radius, setRadius] = useState('10');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<
    { facility: typeof facilities[0]; matchPercent: number }[]
  >([]);

  const handleSearch = () => {
    if (!location.trim() || !need) return;

    const maxDistance = parseInt(radius);

    // Filter by distance and sort by match then distance
    const matched = facilities
      .map(f => ({ facility: f, matchPercent: calculateMatch(f.services, need) }))
      .filter(r => r.facility.distance <= maxDistance)
      .filter(r => r.matchPercent >= 50) // only show reasonable matches
      .sort((a, b) => b.matchPercent - a.matchPercent || a.facility.distance - b.facility.distance)
      .slice(0, 5);

    setResults(matched);
    setHasSearched(true);
  };

  const handleIncreaseRadius = () => {
    const current = parseInt(radius);
    if (current < 10) setRadius('10');
    else if (current < 25) setRadius('25');
    else setRadius('50');
    // re-trigger search with new radius
    setTimeout(() => {
      const maxDistance = current < 10 ? 10 : current < 25 ? 25 : 50;
      const matched = facilities
        .map(f => ({ facility: f, matchPercent: calculateMatch(f.services, need) }))
        .filter(r => r.facility.distance <= maxDistance)
        .filter(r => r.matchPercent >= 50)
        .sort((a, b) => b.matchPercent - a.matchPercent || a.facility.distance - b.facility.distance)
        .slice(0, 5);
      setResults(matched);
    }, 0);
  };

  const typeColors: Record<string, string> = {
    PHC: 'bg-blue-100 text-blue-700',
    CHC: 'bg-indigo-100 text-indigo-700',
    'Government Hospital': 'bg-emerald-100 text-emerald-700',
    'District Hospital': 'bg-violet-100 text-violet-700',
    'Specialist Centre': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Nearby Facility</h1>
        <p className="text-slate-500">
          Search for the nearest public healthcare facility based on your location, need, and preferred radius.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <MapPin className="inline-block w-4 h-4 mr-1 -mt-0.5 text-blue-600" />
              Patient / Current Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Sulur, Coimbatore"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Healthcare Need */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Building2 className="inline-block w-4 h-4 mr-1 -mt-0.5 text-blue-600" />
              Healthcare Need / Service
            </label>
            <div className="relative">
              <select
                value={need}
                onChange={e => setNeed(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">Select healthcare need...</option>
                {healthcareNeeds.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Search className="inline-block w-4 h-4 mr-1 -mt-0.5 text-blue-600" />
              Search Radius
            </label>
            <div className="relative">
              <select
                value={radius}
                onChange={e => setRadius(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSearch}
            disabled={!location.trim() || !need}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 font-medium transition-colors shadow-sm"
          >
            <Search className="w-5 h-5" />
            Find Nearby Facilities
          </button>
        </div>
      </div>

      {/* Results Section */}
      {!hasSearched ? (
        /* Default empty state */
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <MapPin className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-600">Enter location + need + radius</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            to find nearby public healthcare facilities suited to the patient's requirements.
          </p>
        </div>
      ) : results.length === 0 ? (
        /* No results */
        <div className="rounded-2xl border border-amber-200 bg-amber-50 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-7 w-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-amber-800">
            No suitable public healthcare facility found within {radius} km.
          </h3>
          <p className="text-sm text-amber-700 mt-1 mb-5">
            Try increasing the search radius to find more options.
          </p>
          <button
            onClick={handleIncreaseRadius}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-6 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            Increase Search Radius
          </button>
        </div>
      ) : (
        /* Results list */
        <div>
          <p className="text-sm text-slate-500 mb-4">
            Showing <strong>{results.length}</strong> suitable {results.length === 1 ? 'facility' : 'facilities'} within <strong>{radius} km</strong> for <strong>{need}</strong>
          </p>
          <div className="space-y-3">
            {results.map(({ facility, matchPercent }) => (
              <div
                key={facility.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: facility info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">{facility.name}</h3>
                      <span className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${typeColors[facility.type] || 'bg-slate-100 text-slate-700'}`}>
                        {facility.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {facility.distance} km away
                      </span>
                      <span className="text-blue-600 font-medium">{need}</span>
                    </div>
                  </div>

                  {/* Right: match + actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Match badge */}
                    <div className={`text-center px-3 py-1.5 rounded-lg ${
                      matchPercent >= 90
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : matchPercent >= 70
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <p className="text-xs font-medium">Match</p>
                      <p className="text-lg font-bold">{matchPercent}%</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/facility/${facility.id}`)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/new-referral?facility=${facility.id}`)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm"
                      >
                        Select Facility
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
