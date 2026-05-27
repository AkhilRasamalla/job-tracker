// Shared TypeScript types for the Job Tracker application

// All valid status values for a job application
export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export type ApplicationPriority = 'Low' | 'Medium' | 'High';

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  changedAt: string;
}

export interface ResumeAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  data: string;
  uploadedAt: string;
}

// Shape of a single job application document
export interface JobApplication {
  _id: string;
  userId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string; // ISO date string
  jobUrl?: string;
  salary?: string;
  location?: string;
  priority?: ApplicationPriority;
  source?: string;
  contactName?: string;
  contactEmail?: string;
  followUpDate?: string;
  jobDescription?: string;
  statusHistory?: StatusHistoryEntry[];
  resume?: ResumeAttachment | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Payload used when creating or updating an application
export type ApplicationPayload = Omit<
  JobApplication,
  '_id' | 'userId' | 'createdAt' | 'updatedAt'
>;

// Shape of a registered user
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

// Auth response returned by login / register
export interface AuthResponse {
  token: string;
  user: User;
}

// Generic API error shape
export interface ApiError {
  message: string;
  status?: number;
}
