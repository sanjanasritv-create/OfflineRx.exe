export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  village: string;
  district: string;
  activeReferralId?: string;
  lastVisit?: string;
  nextFollowUp?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'Government Hospital' | 'District Hospital' | 'Specialist Centre';
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
  phone: string;
  departments: string[];
  services: string[];
  openingHours: string;
  isOpen: boolean;
  lastVerified: string;
  availableFacilities: string[];
}

export interface FacilityMatch extends Facility {
  matchScore: number;
  matchReasons: string[];
}

export type ReferralStatus =
  | 'New'
  | 'Referred'
  | 'Consultation Pending'
  | 'Consultation Completed'
  | 'Follow-up Due'
  | 'Overdue'
  | 'Completed';

export type ReferralPriority = 'Low' | 'Moderate' | 'High' | 'Urgent';

export interface TimelineEntry {
  stage: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  time?: string;
  note?: string;
}

export interface CaseNote {
  id: string;
  date: string;
  time: string;
  author: string;
  content: string;
}

export interface Referral {
  id: string;
  referralId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientVillage: string;
  healthcareNeed: string;
  identifiedNeed: string;
  suggestedDepartment: string;
  priority: ReferralPriority;
  aiReason: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  facilityDistance: number;
  matchScore: number;
  status: ReferralStatus;
  timeline: TimelineEntry[];
  caseNotes: CaseNote[];
  createdAt: string;
  followUpDate?: string;
  consultationDate?: string;
  closedDate?: string;
  // Consultation tracking
  consultationStatus?: 'Attended' | 'Not Attended' | 'Rescheduled';
  consultationNotes?: string;
  // Follow-up tracking
  followUpReason?: string;
  followUpStatus?: 'Due' | 'Completed';
  followUpOutcome?: string;
}

export interface FollowUp {
  id: string;
  referralId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientVillage: string;
  facilityName: string;
  followUpType: string;
  dueDate: string;
  dueTime?: string;
  status: 'Due' | 'Overdue' | 'Completed';
  daysOverdue?: number;
  completedDate?: string;
}

export interface Notification {
  id: string;
  category: 'Urgent' | 'Follow-up' | 'Referral' | 'System';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AIAnalysis {
  identifiedNeed: string;
  suggestedDepartment: string;
  priority: ReferralPriority;
  reason: string;
  keywords: string[];
}

export type SyncState = 'online' | 'offline' | 'syncing' | 'pending';

export interface AppUser {
  name: string;
  workerId: string;
  role: string;
  district: string;
  block: string;
}
