// src/services/patient.ts

import type { PatientInfo, MedicalRecord } from '@/types';
import { format } from 'date-fns';

// Mock Data (Replace with actual backend API calls, e.g., to Firebase Firestore)

const mockPatients: { [username: string]: PatientInfo } = {
  'patient123': {
    userId: 'user-firebase-id-1', // Example Firebase Auth UID
    username: 'patient123',
    name: 'John Doe',
    dob: '1985-07-22',
    contact: '+1-555-123-4567',
    emergencyContact: 'Jane Doe (+1-555-987-6543)',
  },
   'jane.smith': {
    userId: 'user-firebase-id-2',
    username: 'jane.smith',
    name: 'Jane Smith',
    dob: '1992-03-15',
    contact: 'jane.s@email.com',
  },
};

const mockRecordsDb: { [userId: string]: MedicalRecord[] } = {
    'user-firebase-id-1': [
        { id: 'rec1', userId: 'user-firebase-id-1', type: 'Lab Report', date: new Date(2024, 4, 15), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#', uploadedBy: 'hospital', uploadTimestamp: new Date(2024, 4, 16) },
        { id: 'rec2', userId: 'user-firebase-id-1', type: 'Prescription', date: new Date(2024, 4, 1), doctorName: 'Dr. Ben Carter', hospitalName: 'General Hospital', documentUrl: '#', uploadedBy: 'patient', uploadTimestamp: new Date(2024, 4, 2) },
        { id: 'rec3', userId: 'user-firebase-id-1', type: 'Scan', date: new Date(2024, 3, 20), doctorName: 'Dr. Chloe Davis', hospitalName: 'Metro Imaging', documentUrl: '#', uploadedBy: 'hospital', uploadTimestamp: new Date(2024, 3, 21) },
        { id: 'admin_note1', userId: 'user-firebase-id-1', type: 'Note', date: new Date(2024, 3, 1), doctorName: 'Dr. Ben Carter', hospitalName: 'General Hospital', notes: 'Patient reported mild side effects to medication.', uploadedBy: 'hospital', uploadTimestamp: new Date(2024, 3, 1) },
        { id: 'rec4', userId: 'user-firebase-id-1', type: 'Vaccination', date: new Date(2023, 10, 5), doctorName: 'Nurse Eva Green', hospitalName: 'Community Health', documentUrl: '#', uploadedBy: 'patient', uploadTimestamp: new Date(2023, 10, 6) },
        { id: 'rec5', userId: 'user-firebase-id-1', type: 'Lab Report', date: new Date(2023, 8, 10), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#', uploadedBy: 'hospital', uploadTimestamp: new Date(2023, 8, 11) },
    ],
     'user-firebase-id-2': [
        { id: 'rec10', userId: 'user-firebase-id-2', type: 'Prescription', date: new Date(2024, 5, 1), doctorName: 'Dr. Ken Adams', hospitalName: 'Downtown Medical', documentUrl: '#', uploadedBy: 'patient', uploadTimestamp: new Date(2024, 5, 2) },
     ],
};

/**
 * Asynchronously retrieves patient information by username.
 * MOCK IMPLEMENTATION.
 *
 * @param username The unique username of the patient.
 * @returns A promise that resolves to the PatientInfo object or null if not found.
 */
export async function getPatientByUsername(username: string): Promise<PatientInfo | null> {
  // TODO: Replace with actual backend/database query
  console.log(`MOCK: Searching for patient with username: ${username}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

  const patient = mockPatients[username.toLowerCase()];
  if (patient) {
    console.log(`MOCK: Found patient: ${patient.name}`);
    return { ...patient }; // Return a copy
  } else {
    console.log(`MOCK: Patient not found`);
    return null;
  }
}

/**
 * Asynchronously retrieves a patient's medical records.
 * MOCK IMPLEMENTATION.
 *
 * @param userId The unique ID of the patient (e.g., Firebase Auth UID).
 * @returns A promise that resolves to an array of MedicalRecord objects, sorted by date descending.
 */
export async function getPatientMedicalHistory(userId: string): Promise<MedicalRecord[]> {
  // TODO: Replace with actual backend/database query (e.g., query Firestore collection for records where userId matches)
  console.log(`MOCK: Fetching medical history for user ID: ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

  const records = mockRecordsDb[userId] || [];
  // Ensure dates are Date objects and sort
  const sortedRecords = records
     .map(record => ({
       ...record,
       date: typeof record.date === 'string' ? new Date(record.date) : record.date,
       uploadTimestamp: typeof record.uploadTimestamp === 'string' ? new Date(record.uploadTimestamp) : record.uploadTimestamp,
     }))
     .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by record date desc

  console.log(`MOCK: Found ${sortedRecords.length} records`);
  return sortedRecords;
}


export interface UploadRecordData {
    userId: string;
    type: MedicalRecord['type'];
    date: string; // Expecting YYYY-MM-DD from input usually
    doctorName: string;
    hospitalName: string;
    notes?: string;
    file: File; // The actual file to upload
    uploadedBy: 'patient' | 'hospital';
}

/**
 * Asynchronously uploads a new medical record and its associated file.
 * MOCK IMPLEMENTATION.
 *
 * @param data The data for the new record, including the file.
 * @returns A promise that resolves to the newly created MedicalRecord object.
 */
export async function uploadMedicalRecord(data: UploadRecordData): Promise<MedicalRecord> {
    // TODO: Implement actual backend upload logic:
    // 1. Upload the file (data.file) to storage (e.g., Firebase Storage). Get the download URL.
    // 2. Create a new record document in the database (e.g., Firestore) with metadata and the file URL.

    console.log(`MOCK: Uploading record for user ${data.userId}, type: ${data.type}, file: ${data.file.name}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload delay

    // Simulate storage URL
    const mockDocumentUrl = `https://mockstorage.example.com/${data.userId}/${Date.now()}_${data.file.name}`;

    const newRecord: MedicalRecord = {
        id: `rec_${Date.now()}`, // Generate a unique ID
        userId: data.userId,
        type: data.type,
        date: new Date(data.date), // Convert string date to Date object
        doctorName: data.doctorName,
        hospitalName: data.hospitalName,
        notes: data.notes,
        documentUrl: mockDocumentUrl,
        uploadedBy: data.uploadedBy,
        uploadTimestamp: new Date(),
    };

     // Add to mock DB
    if (!mockRecordsDb[data.userId]) {
        mockRecordsDb[data.userId] = [];
    }
    mockRecordsDb[data.userId].push(newRecord);


    console.log(`MOCK: Record uploaded successfully. ID: ${newRecord.id}, URL: ${mockDocumentUrl}`);
    return newRecord;
}

// Add functions for updating profile, managing permissions, fetching notifications, etc. as needed.

