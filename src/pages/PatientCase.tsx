import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/ui/StatusBadge';
import Timeline from '../components/ui/Timeline';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { openPatientReport } from '../utils/reportGenerator';
import { User, FileText, Plus, Download } from 'lucide-react';

export default function PatientCase() {
  const { id } = useParams<{ id: string }>();
  const { patients, referrals, addCaseNote, addToast } = useApp();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const patient = patients.find(p => p.id === id);
  const patientReferrals = useMemo(() => referrals.filter(r => r.patientId === id), [referrals, id]);
  const latestReferral = patientReferrals[0];

  if (!patient) {
    return <EmptyState icon={User} title="Patient Not Found" message="The patient ID does not exist in our records." />;
  }

  const handleAddNote = () => {
    if (!noteText.trim() || !latestReferral) return;
    addCaseNote(latestReferral.id, {
      id: `CN-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      author: 'ANM Priya',
      content: noteText,
    });
    setIsNoteModalOpen(false);
    setNoteText('');
    addToast({ type: 'success', title: 'Note added' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Patient Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
              <p className="text-sm text-slate-500">{patient.age} yrs • {patient.gender} • {patient.village}</p>
              <p className="text-xs text-slate-400 mt-0.5">ID: {patient.id}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} />
        </div>
      </div>

      {/* Latest Referral Status */}
      {latestReferral && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-blue-900">Current Referral</h2>
            <StatusBadge status={latestReferral.status} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Referral ID</p>
              <p className="font-medium text-blue-900">{latestReferral.referralId}</p>
            </div>
            <div>
              <p className="text-blue-600">Facility</p>
              <p className="font-medium text-blue-900">{latestReferral.facilityName}</p>
            </div>
            <div>
              <p className="text-blue-600">Department</p>
              <p className="font-medium text-blue-900">{latestReferral.suggestedDepartment}</p>
            </div>
            <div>
              <p className="text-blue-600">Priority</p>
              <StatusBadge status={latestReferral.priority} />
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {latestReferral && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Referral Timeline</h2>
          <Timeline entries={latestReferral.timeline} />
        </div>
      )}

      {/* Case Notes */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Case Notes</h2>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Note
          </button>
        </div>
        {latestReferral?.caseNotes?.length ? (
          <div className="space-y-3">
            {latestReferral.caseNotes.map(note => (
              <div key={note.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-600">{note.author}</p>
                  <p className="text-xs text-slate-400">{note.date} • {note.time}</p>
                </div>
                <p className="text-sm text-slate-800">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-4 text-center">No case notes yet.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {latestReferral && (
          <button
            onClick={() => openPatientReport(latestReferral)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Generate Patient Report
          </button>
        )}
        <Link to={`/referral/${latestReferral?.id || ''}`} className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors">
          <FileText className="h-4 w-4" /> View Referral Details
        </Link>
      </div>

      {/* All Referral History */}
      {patientReferrals.length > 1 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Referral History</h2>
          <div className="space-y-3">
            {patientReferrals.map(ref => (
              <Link key={ref.id} to={`/referral/${ref.id}`} className="block rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{ref.referralId} — {ref.identifiedNeed}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ref.facilityName} • {ref.createdAt}</p>
                  </div>
                  <StatusBadge status={ref.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Add Case Note">
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-800 focus:border-blue-400 focus:outline-none resize-none"
          placeholder="Enter your case note..."
        />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button onClick={handleAddNote} disabled={!noteText.trim()} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Note</button>
        </div>
      </Modal>
    </div>
  );
}
