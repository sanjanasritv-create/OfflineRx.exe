import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { openPatientReport } from '../utils/reportGenerator';
import { 
  CheckCircle, Clock, FileText, Download, 
  ArrowLeft, ArrowRight, Calendar, FilePlus, User, 
  Building, MapPin, Stethoscope
} from 'lucide-react';
import type { ReferralStatus } from '../types';

const ReferralTracking = () => {
  const { id } = useParams<{ id: string }>();
  const { referrals, updateReferral, addCaseNote, addToast } = useApp();
  
  const referral = referrals.find(r => r.id === id || r.referralId === id);
  
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isCompleteFollowUpModalOpen, setIsCompleteFollowUpModalOpen] = useState(false);
  
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');
  const [followUpOutcome, setFollowUpOutcome] = useState('');

  // Consultation update state
  const [consultationStatus, setConsultationStatus] = useState<'Attended' | 'Not Attended' | 'Rescheduled'>('Attended');
  const [consultationDate, setConsultationDate] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');

  if (!referral) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Referral Not Found</h2>
        <p className="text-slate-600 mb-6">The referral ID you are looking for does not exist.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: ReferralStatus) => {
    updateReferral(referral.id, { status: newStatus });
    addToast({ type: 'success', title: `Status updated to ${newStatus}` });
  };

  // --- CONSULTATION ---
  const handleConsultationUpdate = () => {
    if (!consultationDate) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (consultationStatus === 'Attended') {
      const updatedTimeline = referral.timeline.map(entry =>
        entry.stage === 'Consultation Completed' && entry.status !== 'completed'
          ? { ...entry, status: 'completed' as const, date: consultationDate, time: timeStr, note: consultationNotes || 'Consultation attended.' }
          : entry
      );
      updateReferral(referral.id, {
        status: 'Consultation Completed',
        consultationDate,
        consultationStatus: 'Attended',
        consultationNotes: consultationNotes || undefined,
        timeline: updatedTimeline,
      });
      addCaseNote(referral.id, {
        id: `CN-${Date.now()}`, date: dateStr, time: timeStr, author: 'ANM Priya',
        content: `Consultation completed on ${consultationDate}. ${consultationNotes}`.trim(),
      });
      addToast({ type: 'success', title: 'Consultation marked as completed' });

    } else if (consultationStatus === 'Not Attended') {
      updateReferral(referral.id, { consultationStatus: 'Not Attended' });
      addCaseNote(referral.id, {
        id: `CN-${Date.now()}`, date: dateStr, time: timeStr, author: 'ANM Priya',
        content: `Patient did not attend consultation on ${consultationDate}. ${consultationNotes}`.trim(),
      });
      addToast({ type: 'warning', title: 'Consultation not attended — status unchanged' });

    } else if (consultationStatus === 'Rescheduled') {
      updateReferral(referral.id, { consultationDate, consultationStatus: 'Rescheduled' });
      addCaseNote(referral.id, {
        id: `CN-${Date.now()}`, date: dateStr, time: timeStr, author: 'ANM Priya',
        content: `Consultation rescheduled to ${consultationDate}. ${consultationNotes}`.trim(),
      });
      addToast({ type: 'info', title: `Consultation rescheduled to ${consultationDate}` });
    }

    setIsConsultationModalOpen(false);
    setConsultationStatus('Attended');
    setConsultationDate('');
    setConsultationNotes('');
  };

  // --- SCHEDULE FOLLOW-UP ---
  const handleScheduleFollowUp = () => {
    if (!followUpDate) return;
    const updatedTimeline = referral.timeline.map(entry =>
      entry.stage === 'Follow-up' && entry.status === 'pending'
        ? { ...entry, status: 'current' as const, date: followUpDate }
        : entry
    );
    updateReferral(referral.id, {
      followUpDate,
      followUpReason: followUpReason || undefined,
      followUpStatus: 'Due',
      status: 'Follow-up Due',
      timeline: updatedTimeline,
    });
    addCaseNote(referral.id, {
      id: `CN-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      author: 'ANM Priya',
      content: `Follow-up scheduled for ${followUpDate}. ${followUpReason || ''}`.trim(),
    });
    setIsFollowUpModalOpen(false);
    setFollowUpDate('');
    setFollowUpReason('');
    addToast({ type: 'success', title: 'Follow-up scheduled' });
  };

  // --- COMPLETE FOLLOW-UP ---
  const handleCompleteFollowUp = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const updatedTimeline = referral.timeline.map(entry =>
      entry.stage === 'Follow-up' && entry.status === 'current'
        ? { ...entry, status: 'completed' as const, date: dateStr, time: timeStr, note: followUpOutcome || 'Follow-up completed.' }
        : entry
    );
    updateReferral(referral.id, {
      followUpStatus: 'Completed',
      followUpOutcome: followUpOutcome || undefined,
      status: 'Follow-up Due', // stays until case closed — we show "Follow-up Completed" badge
      timeline: updatedTimeline,
    });
    addCaseNote(referral.id, {
      id: `CN-${Date.now()}`, date: dateStr, time: timeStr, author: 'ANM Priya',
      content: `Follow-up completed. ${followUpOutcome || ''}`.trim(),
    });
    setIsCompleteFollowUpModalOpen(false);
    setFollowUpOutcome('');
    addToast({ type: 'success', title: 'Follow-up completed' });
  };

  // --- CLOSE CASE ---
  const handleCloseCase = () => {
    const now = new Date();
    const updatedTimeline = referral.timeline.map(entry =>
      entry.stage === 'Case Closed' && entry.status !== 'completed'
        ? { ...entry, status: 'completed' as const, date: now.toISOString().split('T')[0], time: now.toLocaleTimeString() }
        : entry
    );
    updateReferral(referral.id, {
      status: 'Completed',
      closedDate: now.toISOString().split('T')[0],
      timeline: updatedTimeline,
    });
    setIsCloseModalOpen(false);
    addToast({ type: 'success', title: 'Referral case closed' });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addCaseNote(referral.id, {
      id: `CN-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      author: 'ANM Priya',
      content: newNote,
    });
    setIsNoteModalOpen(false);
    setNewNote('');
    addToast({ type: 'success', title: 'Note added successfully' });
  };

  const generateReport = () => {
    if (openPatientReport) {
      openPatientReport(referral);
    } else {
      addToast({ type: 'error', title: 'Report generator not available' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-slide-up">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/" className="text-slate-500 hover:text-slate-800 flex items-center mr-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            {referral.patientName}
            <StatusBadge status={referral.status as any} />
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-1">ID: {referral.referralId}</p>
        </div>
        <div className="ml-auto">
          <button onClick={generateReport} className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-slate-400" /> Patient & Referral Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 mb-6">
              <div><p className="text-sm text-slate-500 mb-1">Age / Gender</p><p className="font-medium text-slate-900">{referral.patientAge} yrs, {referral.patientGender}</p></div>
              <div><p className="text-sm text-slate-500 mb-1">Location</p><p className="font-medium text-slate-900">{referral.patientVillage}</p></div>
              <div><p className="text-sm text-slate-500 mb-1">Created On</p><p className="font-medium text-slate-900">{new Date(referral.createdAt).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-slate-500 mb-1">Priority</p><StatusBadge status={referral.priority} /></div>
            </div>
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 mb-6">
              <p className="text-sm text-blue-800 font-medium mb-1">Identified Need</p>
              <p className="text-slate-800">{referral.identifiedNeed}</p>
              {referral.aiReason && <p className="text-sm text-slate-600 mt-2 italic border-l-2 border-blue-200 pl-3">"{referral.aiReason}"</p>}
            </div>
            <h3 className="font-medium text-slate-800 mb-3 flex items-center"><Building className="w-4 h-4 mr-2 text-slate-400" /> Destination Facility</h3>
            <div className="flex items-start justify-between border border-slate-100 bg-slate-50 rounded-lg p-4">
              <div>
                <p className="font-semibold text-slate-900">{referral.facilityName}</p>
                <p className="text-sm text-slate-600 mt-1">{referral.facilityType} • {referral.suggestedDepartment}</p>
                <p className="text-sm text-slate-500 mt-2 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {referral.facilityDistance} km away</p>
              </div>
            </div>
          </div>

          {/* Consultation & Follow-up Info Display */}
          {(referral.consultationStatus === 'Attended' || referral.consultationDate) && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-slate-400" /> Consultation & Follow-up
              </h2>
              {/* Consultation Info */}
              {referral.consultationStatus === 'Attended' && (
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span className="font-medium text-teal-800">Consultation Completed</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-teal-700">Date:</span> <span className="text-slate-800 font-medium">{referral.consultationDate}</span></div>
                    {referral.consultationNotes && (
                      <div className="sm:col-span-2"><span className="text-teal-700">Notes:</span> <span className="text-slate-800">{referral.consultationNotes}</span></div>
                    )}
                  </div>
                </div>
              )}
              {/* Follow-up Info */}
              {referral.followUpDate && (
                <div className={`rounded-lg p-4 border ${referral.followUpStatus === 'Completed' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{referral.followUpStatus === 'Completed' ? 'Follow-up Completed' : 'Follow-up Due'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="opacity-70">Status:</span> <StatusBadge status={referral.followUpStatus === 'Completed' ? 'Completed' : 'Follow-up Due'} /></div>
                    <div><span className="opacity-70">Date:</span> <span className="font-medium">{referral.followUpDate}</span></div>
                    {referral.followUpReason && (
                      <div className="sm:col-span-2"><span className="opacity-70">Reason:</span> <span>{referral.followUpReason}</span></div>
                    )}
                    {referral.followUpOutcome && (
                      <div className="sm:col-span-2"><span className="opacity-70">Outcome:</span> <span>{referral.followUpOutcome}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Case Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-2 text-slate-400" /> Case Notes</h2>
              <button onClick={() => setIsNoteModalOpen(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                <FilePlus className="w-4 h-4 mr-1" /> Add Note
              </button>
            </div>
            <div className="space-y-4">
              {referral.caseNotes && referral.caseNotes.length > 0 ? (
                referral.caseNotes.map(note => (
                  <div key={note.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-slate-800 whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                      <span>{note.author}</span>
                      <span>{note.date} at {note.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-6 italic">No case notes added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Actions + Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3">Actions</h2>
            <div className="space-y-3">
              {referral.status === 'New' && (
                <button onClick={() => handleStatusUpdate('Referred')} className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium border border-blue-100 flex justify-between items-center">
                  Mark as Referred <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {(referral.status === 'Referred' || referral.status === 'New') && (
                <button onClick={() => handleStatusUpdate('Consultation Pending')} className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium border border-indigo-100 flex justify-between items-center">
                  Mark Consultation Pending <CheckCircle className="w-4 h-4" />
                </button>
              )}
              {referral.status === 'Consultation Pending' && (
                <button onClick={() => setIsConsultationModalOpen(true)} className="w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors font-medium border border-emerald-100 flex justify-between items-center">
                  Update Consultation <Stethoscope className="w-4 h-4" />
                </button>
              )}
              {referral.status === 'Consultation Completed' && (
                <button onClick={() => setIsFollowUpModalOpen(true)} className="w-full text-left px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors font-medium border border-amber-100 flex justify-between items-center">
                  Schedule Follow-up <Calendar className="w-4 h-4" />
                </button>
              )}
              {referral.status === 'Follow-up Due' && referral.followUpStatus !== 'Completed' && (
                <button onClick={() => setIsCompleteFollowUpModalOpen(true)} className="w-full text-left px-4 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors font-medium border border-teal-100 flex justify-between items-center">
                  Complete Follow-up <CheckCircle className="w-4 h-4" />
                </button>
              )}
              {referral.status === 'Overdue' && (
                <button onClick={() => setIsCompleteFollowUpModalOpen(true)} className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium border border-red-100 flex justify-between items-center">
                  Complete Follow-up <CheckCircle className="w-4 h-4" />
                </button>
              )}
              {(referral.followUpStatus === 'Completed' || referral.status === 'Overdue') && referral.status !== 'Completed' && (
                <button onClick={() => setIsCloseModalOpen(true)} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors font-medium border border-slate-200 flex justify-between items-center">
                  Close Case <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setIsNoteModalOpen(true)} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors font-medium border border-slate-200 flex justify-between items-center">
                Add Case Note <FilePlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400" /> Timeline
            </h2>
            <div className="relative border-l-2 border-slate-200 ml-3 mt-4 space-y-6">
              {referral.timeline.map((entry, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white
                    ${entry.status === 'completed' ? 'bg-blue-500' : entry.status === 'current' ? 'bg-amber-400 animate-pulse-dot' : 'bg-slate-300'}`}
                  ></div>
                  <p className={`font-medium text-sm ${entry.status === 'completed' ? 'text-slate-900' : entry.status === 'current' ? 'text-amber-700' : 'text-slate-400'}`}>{entry.stage}</p>
                  {entry.date && <p className="text-xs text-slate-500 mt-1">{entry.date} {entry.time ? `• ${entry.time}` : ''}</p>}
                  {entry.note && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100">{entry.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Add Case Note">
        <div className="space-y-4">
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Enter clinical notes..." />
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Note</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isConsultationModalOpen} onClose={() => setIsConsultationModalOpen(false)} title="Update Consultation">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Consultation Status</label>
            <div className="space-y-2">
              {(['Attended', 'Not Attended', 'Rescheduled'] as const).map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <input type="radio" name="consultationStatus" value={option} checked={consultationStatus === option} onChange={() => setConsultationStatus(option)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-slate-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{consultationStatus === 'Rescheduled' ? 'New Consultation Date' : 'Consultation Date'}</label>
            <input type="date" value={consultationDate} onChange={e => setConsultationDate(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea value={consultationNotes} onChange={e => setConsultationNotes(e.target.value)} className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Enter consultation notes..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setIsConsultationModalOpen(false); setConsultationDate(''); setConsultationNotes(''); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleConsultationUpdate} disabled={!consultationDate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isFollowUpModalOpen} onClose={() => setIsFollowUpModalOpen(false)} title="Schedule Follow-up">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <textarea value={followUpReason} onChange={e => setFollowUpReason(e.target.value)} className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Reason for follow-up..." />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsFollowUpModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleScheduleFollowUp} disabled={!followUpDate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Schedule</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isCompleteFollowUpModalOpen} onClose={() => setIsCompleteFollowUpModalOpen(false)} title="Complete Follow-up">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Outcome</label>
            <textarea value={followUpOutcome} onChange={e => setFollowUpOutcome(e.target.value)} className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Describe follow-up outcome..." />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsCompleteFollowUpModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleCompleteFollowUp} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} title="Close Case">
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 font-medium">Are you sure you want to close this case?</p>
            <p className="text-sm text-amber-700 mt-1">This indicates the referral cycle is completely finished.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsCloseModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handleCloseCase} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">Confirm & Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReferralTracking;
