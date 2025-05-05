// src/types/index.ts

export type DocumentType = 'Lab Report' | 'Prescription' | 'Scan' | 'Vaccination' | 'Note' | 'Invoice' | 'Other';

export interface MedicalRecord {
  id: string;
  userId: string; // Link to the patient
  type: DocumentType;
  date: Date | string; // Store as ISO string or Date object
  doctorName: string;
  hospitalName: string;
  notes?: string;
  documentUrl?: string; // URL to the stored document (e.g., in Firebase Storage)
  uploadedBy: 'patient' | 'hospital'; // Track who uploaded the record
  uploadTimestamp: Date | string;
}

export interface PatientInfo {
  userId: string; // Matches Firebase Auth UID
  username: string; // Unique username for sharing/lookup
  name: string;
  dob: string; // Store as YYYY-MM-DD string
  contact: string; // Phone number or email
  emergencyContact?: string;
  // Add other relevant fields like address, blood type, allergies etc.
}

export interface HospitalInfo {
    hospitalId: string;
    name: string;
    // Add other details like address, contact info etc.
}

// For Access Logs
export interface AccessLog {
    logId: string;
    patientUserId: string;
    accessorId: string; // Could be hospital ID or doctor ID
    accessorType: 'hospital_staff' | 'patient' | 'system';
    action: 'viewed_history' | 'uploaded_document' | 'granted_access' | 'revoked_access';
    timestamp: Date | string;
    details?: string; // e.g., Document ID uploaded, Doctor Name who viewed
}

// For Notifications
export interface Notification {
    notificationId: string;
    userId: string; // User receiving the notification
    type: 'new_document' | 'access_granted' | 'access_revoked' | 'record_viewed' | 'reminder';
    title: string;
    message: string;
    timestamp: Date | string;
    isRead: boolean;
    relatedItemId?: string; // e.g., the ID of the new document or the access log ID
}
