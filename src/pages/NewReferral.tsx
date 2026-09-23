import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { analyzePatientNeed, getMatchingFacilities, exampleSuggestions } from '../data/aiResponses';
import { facilities as allFacilities } from '../data/facilities';
import StatusBadge from '../components/ui/StatusBadge';
import FacilityCard from '../components/ui/FacilityCard';
import AIRecommendation from '../components/ui/AIRecommendation';
import { 
  CheckCircle, Mic, ArrowLeft, ArrowRight, User, 
  Stethoscope, MapPin, Building, AlertTriangle, Loader2
} from 'lucide-react';
import type { Patient, Facility, AIAnalysis, Referral } from '../types';

const NewReferral: React.FC = () => {
  const navigate = useNavigate();
  const { patients, addReferral, addToast } = useApp();
  
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState<Partial<Patient>>({
    name: '',
    age: undefined,
    gender: 'Other',
    phone: '',
    village: '',
    id: ''
  });

  // Patient search state
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const filteredPatients = patientSearch.trim()
    ? patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()))
    : [];
  
  const [needText, setNeedText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [matchingFacilities, setMatchingFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [createdReferralId, setCreatedReferralId] = useState('');
  const [searchRadius, setSearchRadius] = useState(10);
  const [radiusConfirmed, setRadiusConfirmed] = useState(false);

  const steps = [
    { num: 1, title: 'Patient Info', icon: User },
    { num: 2, title: 'Healthcare Need', icon: Stethoscope },
    { num: 3, title: 'Facility Match', icon: Building },
    { num: 4, title: 'Review', icon: CheckCircle }
  ];

  const handleAnalyze = () => {
    if (!needText.trim()) return;
    
    setStep(3);
    setIsAnalyzing(true);
    setLoadingStep(1);
    setRadiusConfirmed(false);
    setMatchingFacilities([]);
    
    setTimeout(() => setLoadingStep(2), 1000);
    setTimeout(() => setLoadingStep(3), 2000);
    
    setTimeout(() => {
      const analysis = analyzePatientNeed(needText);
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 3500);
  };

  const handleFindMatches = () => {
    if (!aiAnalysis) return;
    const allMatches = getMatchingFacilities(aiAnalysis.suggestedDepartment, allFacilities);
    setMatchingFacilities(allMatches.filter((f: any) => f.distance <= searchRadius));
    setRadiusConfirmed(true);
  };

  const handleConfirm = () => {
    if (!patientData.name || !aiAnalysis || !selectedFacility) return;
    
    const newId = `RX-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const newReferral: Referral = {
      id: newId,
      referralId: newId,
      patientId: patientData.id || `PT-${Math.floor(Math.random() * 10000)}`,
      patientName: patientData.name,
      patientAge: patientData.age || 0,
      patientGender: patientData.gender || 'Other',
      patientVillage: patientData.village || '',
      healthcareNeed: needText,
      identifiedNeed: aiAnalysis.identifiedNeed,
      suggestedDepartment: aiAnalysis.suggestedDepartment,
      priority: aiAnalysis.priority,
      aiReason: aiAnalysis.reason,
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      facilityType: selectedFacility.type,
      facilityDistance: selectedFacility.distance,
      matchScore: 95, 
      status: 'New',
      timeline: [{ stage: 'Referral Created', status: 'completed', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString() }],
      caseNotes: [],
      createdAt: new Date().toISOString()
    };
    
    addReferral(newReferral);
    setCreatedReferralId(newId);
    setStep(5);
    addToast({ type: 'success', title: 'Referral created successfully' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-slide-up">
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map(s => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                    ${isActive ? 'border-blue-600 bg-white text-blue-600' : 
                      isPast ? 'border-blue-600 bg-blue-600 text-white' : 
                      'border-slate-300 bg-slate-50 text-slate-400'}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block
                    ${isActive ? 'text-blue-700' : isPast ? 'text-slate-700' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {step === 1 && (
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Patient Information</h2>
            
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Existing Patient</label>
              <input
                type="text"
                placeholder="Search patient by name..."
                value={patientSearch}
                onChange={e => {
                  setPatientSearch(e.target.value);
                  setShowPatientDropdown(true);
                  // Clear selection if user edits the search after selecting
                  if (patientData.id) {
                    setPatientData({ name: '', age: undefined, gender: 'Other', phone: '', village: '', id: '' });
                  }
                }}
                onFocus={() => { if (patientSearch.trim()) setShowPatientDropdown(true); }}
                className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500"
              />
              {/* Dropdown results */}
              {showPatientDropdown && patientSearch.trim() && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-lg border border-slate-200 shadow-lg max-h-60 overflow-y-auto">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPatientData({ ...p });
                          setPatientSearch(p.name);
                          setShowPatientDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <span className="font-medium text-slate-800">{p.name}</span>
                        <span className="text-sm text-slate-500 ml-2">{p.age} yrs • {p.gender} • {p.village}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center">
                      <p className="text-sm text-slate-500 mb-2">Patient not found</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientData({ name: patientSearch, age: undefined, gender: 'Other', phone: '', village: '', id: '' });
                          setShowPatientDropdown(false);
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Create New Patient
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  value={patientData.name}
                  onChange={e => setPatientData({...patientData, name: e.target.value})}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500" 
                  placeholder="Enter patient name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                  <input 
                    type="number" 
                    value={patientData.age || ''}
                    onChange={e => setPatientData({...patientData, age: parseInt(e.target.value) || undefined})}
                    className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500" 
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                  <select 
                    value={patientData.gender}
                    onChange={e => setPatientData({...patientData, gender: e.target.value as any})}
                    className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={patientData.phone}
                  onChange={e => setPatientData({...patientData, phone: e.target.value})}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500" 
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Village / Location</label>
                <input 
                  type="text" 
                  value={patientData.village}
                  onChange={e => setPatientData({...patientData, village: e.target.value})}
                  className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500" 
                  placeholder="Enter village"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!patientData.name || !patientData.age}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 flex items-center font-medium transition-colors"
              >
                Next Step <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 md:p-8">
            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Describe Patient Need</h2>
            <p className="text-slate-600 mb-6">You don't need to know the exact medical department. Just describe the patient's need.</p>
            
            <div className="relative mb-6">
              <textarea 
                value={needText}
                onChange={e => setNeedText(e.target.value)}
                className="w-full h-40 rounded-lg border-slate-300 border p-4 focus:border-blue-500 focus:ring-blue-500 resize-none"
                placeholder="Describe what the patient needs in your own words..."
              ></textarea>
              <button className="absolute bottom-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors" title="Voice Input">
                <Mic className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">Example Descriptions</label>
              <div className="flex flex-wrap gap-2">
                {exampleSuggestions.map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setNeedText(suggestion)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-full transition-colors border border-blue-100 text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-6">
              <span className="text-sm text-slate-500 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
                Offline AI model will process this locally
              </span>
              <button 
                onClick={handleAnalyze}
                disabled={!needText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-8 py-3 text-lg font-medium transition-colors"
              >
                Analyze Patient Need
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 md:p-8 bg-slate-50 min-h-[400px]">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <div className="mt-8 space-y-4 w-full max-w-sm">
                  <div className={`flex items-center text-sm ${loadingStep >= 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    <CheckCircle className={`w-5 h-5 mr-3 ${loadingStep >= 1 ? 'text-blue-500' : 'text-slate-300'}`} />
                    Understanding patient need...
                  </div>
                  <div className={`flex items-center text-sm ${loadingStep >= 2 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    <CheckCircle className={`w-5 h-5 mr-3 ${loadingStep >= 2 ? 'text-blue-500' : 'text-slate-300'}`} />
                    Retrieving relevant facility information...
                  </div>
                  <div className={`flex items-center text-sm ${loadingStep >= 3 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    <CheckCircle className={`w-5 h-5 mr-3 ${loadingStep >= 3 ? 'text-blue-500' : 'text-slate-300'}`} />
                    Matching suitable facilities...
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium mb-6">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Edit Need
                </button>
                
                {aiAnalysis && <AIRecommendation analysis={aiAnalysis} />}

                {/* Phase 1: Radius Selection (before Find Matches) */}
                {!radiusConfirmed && (
                  <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">How far should we search for facilities?</h3>
                    <p className="text-sm text-slate-500 mb-6">Select a search radius to find matching public healthcare facilities nearby.</p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      {[5, 10, 15, 25, 50].map(km => (
                        <button
                          key={km}
                          onClick={() => setSearchRadius(km)}
                          className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            searchRadius === km
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {km} km
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleFindMatches}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 font-medium transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-5 h-5" />
                      Find Matches
                    </button>
                  </div>
                )}

                {/* Phase 2: Facility Results (after Find Matches) */}
                {radiusConfirmed && (
                  <div className="mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">Recommended Facilities</h3>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        Within {searchRadius} km
                        <button
                          onClick={() => setRadiusConfirmed(false)}
                          className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs font-medium"
                        >
                          Change
                        </button>
                      </span>
                    </div>

                    {matchingFacilities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchingFacilities.map(facility => (
                          <div key={facility.id} onClick={() => { setSelectedFacility(facility); setStep(4); }} className="cursor-pointer">
                            <FacilityCard facility={facility} showMatchScore={true} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 py-10 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                        <p className="text-amber-800 font-medium">No suitable facility found within {searchRadius} km.</p>
                        <p className="text-sm text-amber-700 mt-1 mb-4">Try increasing the search radius.</p>
                        <button
                          onClick={() => setRadiusConfirmed(false)}
                          className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-5 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          Change Search Radius
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Review Referral</h2>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">Patient</h4>
                  <p className="font-medium text-slate-900">{patientData.name} • {patientData.age} yr • {patientData.gender}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">Location</h4>
                  <p className="font-medium text-slate-900">{patientData.village || 'Not specified'}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium text-slate-500 mb-1">Stated Need</h4>
                  <p className="text-slate-800 italic">"{needText}"</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Target Facility
                </h3>
                <StatusBadge status={aiAnalysis?.priority || 'Moderate'} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Selected Facility</h4>
                  <p className="font-medium text-blue-900">{selectedFacility?.name}</p>
                  <p className="text-sm text-blue-700 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {selectedFacility?.distance} km away
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Suggested Department</h4>
                  <p className="font-medium text-blue-900">{aiAnalysis?.suggestedDepartment}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Search Radius</h4>
                  <p className="font-medium text-blue-900">Within {searchRadius} km</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> The health worker remains responsible for the final referral decision. AI suggestions are to assist, not replace medical judgment.
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-6">
              <button 
                onClick={() => setStep(1)}
                className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2"
              >
                Edit Referral
              </button>
              <button 
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-2.5 font-medium transition-colors"
              >
                Confirm Referral
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Referral Created</h2>
            <p className="text-slate-600 mb-6">The referral has been successfully saved offline and will sync when connected.</p>
            
            <div className="bg-slate-50 rounded-lg py-4 px-6 inline-block mb-10 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Referral ID</p>
              <p className="text-xl font-mono font-bold text-slate-900">{createdReferralId}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => {
                  setStep(1);
                  setPatientData({ name: '', age: undefined, gender: 'Other', phone: '', village: '', id: '' });
                  setNeedText('');
                  setAiAnalysis(null);
                  setSelectedFacility(null);
                }}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Create Another
              </button>
              <button 
                onClick={() => navigate(`/referral/${createdReferralId}`)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Track Referral
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReferral;
