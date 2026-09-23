import type { Referral } from '../types';

export function generatePatientReport(referral: Referral): string {
  const completedStages = referral.timeline.filter((t) => t.status === 'completed');
  const currentStage = referral.timeline.find((t) => t.status === 'current');
  const pendingStages = referral.timeline.filter((t) => t.status === 'pending');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Patient Progress Report — ${referral.referralId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #1e40af; font-size: 24px; margin-bottom: 4px; }
    .header .subtitle { color: #64748b; font-size: 14px; }
    .header .referral-id { color: #2563eb; font-size: 16px; font-weight: 600; margin-top: 8px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 16px; font-weight: 700; color: #1e40af; border-bottom: 1px solid #dbeafe; padding-bottom: 8px; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
    .info-item { display: flex; gap: 8px; }
    .info-label { font-weight: 600; color: #64748b; min-width: 140px; font-size: 13px; }
    .info-value { color: #1e293b; font-size: 13px; }
    .status-badge { display: inline-block; padding: 2px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-new { background: #dbeafe; color: #1e40af; }
    .status-referred { background: #e0e7ff; color: #3730a3; }
    .status-consultation { background: #fff7ed; color: #c2410c; }
    .status-followup { background: #fef3c7; color: #92400e; }
    .status-overdue { background: #fef2f2; color: #dc2626; }
    .status-completed { background: #dcfce7; color: #166534; }
    .timeline { margin: 12px 0; }
    .timeline-item { display: flex; gap: 12px; padding: 8px 0; border-left: 2px solid #dbeafe; margin-left: 8px; padding-left: 16px; }
    .timeline-item.completed { border-left-color: #16a34a; }
    .timeline-item.current { border-left-color: #2563eb; }
    .timeline-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    .dot-completed { background: #16a34a; }
    .dot-current { background: #2563eb; }
    .dot-pending { background: #e2e8f0; }
    .timeline-content { flex: 1; }
    .timeline-stage { font-weight: 600; font-size: 13px; }
    .timeline-date { color: #64748b; font-size: 12px; }
    .timeline-note { color: #475569; font-size: 12px; font-style: italic; margin-top: 2px; }
    .case-note { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; }
    .case-note .note-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .case-note .note-author { font-weight: 600; font-size: 12px; color: #1e40af; }
    .case-note .note-date { font-size: 11px; color: #94a3b8; }
    .case-note .note-content { font-size: 13px; color: #334155; }
    .disclaimer { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 24px; }
    .disclaimer p { font-size: 12px; color: #1e40af; }
    .disclaimer strong { font-size: 13px; }
    .pending-actions { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; }
    .pending-actions ul { list-style: none; padding: 0; }
    .pending-actions li { padding: 4px 0; font-size: 13px; color: #9a3412; }
    .pending-actions li::before { content: "⚠ "; }
    .footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>OfflineRx — Patient Progress Report</h1>
    <p class="subtitle">AI-Assisted Referral Management System</p>
    <p class="referral-id">${referral.referralId}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Patient Information</h2>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Name:</span><span class="info-value">${referral.patientName}</span></div>
      <div class="info-item"><span class="info-label">Age:</span><span class="info-value">${referral.patientAge} years</span></div>
      <div class="info-item"><span class="info-label">Gender:</span><span class="info-value">${referral.patientGender}</span></div>
      <div class="info-item"><span class="info-label">Village:</span><span class="info-value">${referral.patientVillage}</span></div>
      <div class="info-item"><span class="info-label">Patient ID:</span><span class="info-value">${referral.patientId}</span></div>
      <div class="info-item"><span class="info-label">Referral Created:</span><span class="info-value">${referral.createdAt}</span></div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Current Status</h2>
    <p><span class="status-badge status-${referral.status.toLowerCase().replace(/\s+/g, '')}">${referral.status}</span></p>
  </div>

  <div class="section">
    <h2 class="section-title">Healthcare Need</h2>
    <p style="font-size:13px;color:#334155;margin-bottom:8px;">${referral.healthcareNeed}</p>
  </div>

  <div class="section">
    <h2 class="section-title">AI-Assisted Referral Analysis</h2>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Identified Need:</span><span class="info-value">${referral.identifiedNeed}</span></div>
      <div class="info-item"><span class="info-label">Suggested Dept:</span><span class="info-value">${referral.suggestedDepartment}</span></div>
      <div class="info-item"><span class="info-label">Priority:</span><span class="info-value">${referral.priority}</span></div>
      <div class="info-item"><span class="info-label">Match Score:</span><span class="info-value">${referral.matchScore}%</span></div>
    </div>
    <p style="font-size:12px;color:#475569;margin-top:8px;font-style:italic;">${referral.aiReason}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Selected Facility</h2>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Facility:</span><span class="info-value">${referral.facilityName}</span></div>
      <div class="info-item"><span class="info-label">Type:</span><span class="info-value">${referral.facilityType}</span></div>
      <div class="info-item"><span class="info-label">Distance:</span><span class="info-value">${referral.facilityDistance} km</span></div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Case Timeline</h2>
    <div class="timeline">
      ${referral.timeline.map((entry) => `
        <div class="timeline-item ${entry.status}">
          <div class="timeline-dot dot-${entry.status}"></div>
          <div class="timeline-content">
            <div class="timeline-stage">${entry.stage} ${entry.status === 'completed' ? '✓' : entry.status === 'current' ? '●' : '○'}</div>
            ${entry.date ? `<div class="timeline-date">${entry.date}${entry.time ? ' — ' + entry.time : ''}</div>` : ''}
            ${entry.note ? `<div class="timeline-note">${entry.note}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  ${referral.caseNotes.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Case Notes</h2>
    ${referral.caseNotes.map((note) => `
      <div class="case-note">
        <div class="note-header">
          <span class="note-author">${note.author}</span>
          <span class="note-date">${note.date} — ${note.time}</span>
        </div>
        <p class="note-content">${note.content}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${pendingStages.length > 0 || currentStage ? `
  <div class="section">
    <h2 class="section-title">Pending Actions</h2>
    <div class="pending-actions">
      <ul>
        ${currentStage ? `<li>${currentStage.stage} — In Progress${currentStage.note ? ' (' + currentStage.note + ')' : ''}</li>` : ''}
        ${pendingStages.map((s) => `<li>${s.stage} — Pending</li>`).join('')}
      </ul>
    </div>
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">Summary</h2>
    <p style="font-size:13px;color:#334155;">
      This case for <strong>${referral.patientName}</strong> (${referral.patientAge}/${referral.patientGender}) was created on ${referral.createdAt}.
      ${completedStages.length} of ${referral.timeline.length} stages have been completed.
      ${currentStage ? `The case is currently at the "${currentStage.stage}" stage.` : ''}
      ${referral.status === 'Completed' ? 'This case has been closed successfully.' : ''}
      ${referral.status === 'Overdue' ? 'This case has overdue follow-up actions requiring attention.' : ''}
    </p>
  </div>

  <div class="disclaimer">
    <p><strong>⚕ Important Disclaimer</strong></p>
    <p>AI provides referral assistance only. This report does not contain diagnosis or treatment recommendations. The health worker remains responsible for the final referral decision and patient care coordination.</p>
  </div>

  <div class="footer">
    <p>Generated by OfflineRx — Offline AI-Powered Referral Assistance</p>
    <p>Report generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
    <p>RIGHT PATIENT → RIGHT FACILITY → RIGHT TIME → COMPLETED FOLLOW-UP</p>
  </div>

  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="background:#2563eb;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;">Print / Save as PDF</button>
    <button onclick="window.close()" style="background:#e2e8f0;color:#334155;border:none;padding:12px 32px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600;margin-left:12px;">Close</button>
  </div>
</body>
</html>`;

  return html;
}

export function openPatientReport(referral: Referral) {
  const html = generatePatientReport(referral);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
