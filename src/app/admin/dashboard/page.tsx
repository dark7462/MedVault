'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, User, Upload, History, LogOut, QrCode, FileText, Pill, Microscope, FlaskConical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import QRCode from 'qrcode.react'; // Assuming qrcode.react is installed

// Mock Data Structures
interface PatientInfo {
  username: string;
  name: string;
  dob: string; // Date of Birth
  contact: string;
  emergencyContact?: string;
}

interface MedicalRecord {
  id: string;
  type: 'Lab Report' | 'Prescription' | 'Scan' | 'Vaccination' | 'Note';
  date: Date;
  doctorName: string;
  hospitalName: string;
  notes?: string;
  documentUrl?: string;
}

// Mock Data (Replace with API calls)
const mockPatient: PatientInfo = {
  username: 'patient123',
  name: 'John Doe',
  dob: '1985-07-22',
  contact: '+1-555-123-4567',
  emergencyContact: 'Jane Doe (+1-555-987-6543)',
};

const mockHistory: MedicalRecord[] = [
 { id: 'rec1', type: 'Lab Report', date: new Date(2024, 4, 15), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#' },
  { id: 'rec2', type: 'Prescription', date: new Date(2024, 4, 1), doctorName: 'Dr. Ben Carter', hospitalName: 'General Hospital', documentUrl: '#' },
  { id: 'rec3', type: 'Scan', date: new Date(2024, 3, 20), doctorName: 'Dr. Chloe Davis', hospitalName: 'Metro Imaging', documentUrl: '#' },
  { id: 'admin_note1', type: 'Note', date: new Date(2024, 3, 1), doctorName: 'Dr. Ben Carter', hospitalName: 'General Hospital', notes: 'Patient reported mild side effects to medication.'},
  { id: 'rec4', type: 'Vaccination', date: new Date(2023, 10, 5), doctorName: 'Nurse Eva Green', hospitalName: 'Community Health', documentUrl: '#' },
  { id: 'rec5', type: 'Lab Report', date: new Date(2023, 8, 10), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#' },
];

const getIconForType = (type: MedicalRecord['type']) => {
  switch (type) {
    case 'Lab Report': return <FlaskConical className="h-5 w-5 text-blue-500" />;
    case 'Prescription': return <Pill className="h-5 w-5 text-green-500" />;
    case 'Scan': return <Microscope className="h-5 w-5 text-purple-500" />;
    case 'Vaccination': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="m18.5 2.5.35.35a1.414 1.414 0 0 1 0 2L8.5 15.2a1.414 1.414 0 0 1-2 0L2.15 10.85a1.414 1.414 0 0 1 0-2l.35-.35"/><path d="M6.5 13.2 11 17.5l10.5-10.5"/><path d="m12.5 6.5 4.5 4.5"/><path d="m18.5 2.5 4.5 4.5"/></svg>; // Syringe Icon
    case 'Note': return <FileText className="h-5 w-5 text-yellow-600" />;
    default: return <FileText className="h-5 w-5 text-gray-500" />;
  }
};


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [patientFound, setPatientFound] = useState<boolean>(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [patientHistory, setPatientHistory] = useState<MedicalRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadDocType, setUploadDocType] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({ title: "Search Error", description: "Please enter a patient username or scan QR code.", variant: "destructive" });
      return;
    }
    setIsSearching(true);
    setPatientFound(false); // Reset previous results
    setPatientInfo(null);
    setPatientHistory([]);

    // --- TODO: Implement backend search API call ---
    console.log("Searching for patient:", searchTerm);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // --- Mock Search Result ---
    if (searchTerm.toLowerCase() === 'patient123') {
      setPatientInfo(mockPatient);
      setPatientHistory(mockHistory.sort((a, b) => b.date.getTime() - a.date.getTime()));
      setPatientFound(true);
      toast({ title: "Patient Found", description: `Displaying records for ${mockPatient.name}.` });
    } else {
      toast({ title: "Patient Not Found", description: "No patient found with that username.", variant: "destructive" });
    }
    // --- End Mock ---
    setIsSearching(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!uploadFile || !uploadDocType) {
        toast({ title: "Upload Error", description: "Please select a file and document type.", variant: "destructive" });
        return;
      }
      if (!patientInfo) {
           toast({ title: "Upload Error", description: "No patient selected.", variant: "destructive" });
           return;
      }

      setIsUploading(true);
      // --- TODO: Implement backend file upload API call ---
      // - Send file, notes, docType, patientUsername to backend
      // - Backend saves the file, creates a record, associates with patient
      console.log("Uploading file:", uploadFile.name, "Type:", uploadDocType, "Notes:", uploadNotes, "for Patient:", patientInfo.username);
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('notes', uploadNotes);
      formData.append('documentType', uploadDocType);
      formData.append('patientUsername', patientInfo.username);
      // Example: await fetch('/api/admin/upload', { method: 'POST', body: formData });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

       // --- Mock Upload Success ---
      // Add to local state to simulate update (in real app, refetch history or rely on push updates)
      const newRecord: MedicalRecord = {
          id: `admin_upload_${Date.now()}`,
          type: uploadDocType as any, // Cast needed for mock, validate properly in real app
          date: new Date(),
          doctorName: 'Dr. Admin Upload', // Get actual logged-in doctor name
          hospitalName: 'Current Hospital', // Get from admin session
          notes: uploadNotes,
          documentUrl: '#', // Placeholder URL
      };
      setPatientHistory(prev => [newRecord, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));

      toast({ title: "Upload Successful", description: `${uploadFile.name} uploaded for ${patientInfo.name}.`, variant: "default" });
      setUploadFile(null);
      setUploadNotes('');
      setUploadDocType('');
      // Optionally switch tab back to history
      // --- End Mock ---
      setIsUploading(false);
  };


  const handleLogout = () => {
     // TODO: Implement actual logout
     toast({ title: "Logged Out", description: "Admin session ended." });
     router.push('/admin/login');
  };

  // Placeholder for QR Scan functionality
  const handleQrScan = () => {
      toast({ title: "QR Scan", description: "QR code scanning not implemented in this prototype." });
      // In a real app, this would trigger a camera modal to scan the QR
      // and populate the searchTerm state with the result.
      // Example: setSearchTerm(scannedUsername); handleSearch();
  };

  return (
    <div className="flex flex-col h-screen bg-secondary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-background border-b shadow-sm">
        <div className="flex items-center gap-2">
           <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <h1 className="text-xl font-semibold text-primary">MediVault Admin Dashboard</h1>
        </div>
         {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
            <Input
              type="search"
              placeholder="Enter Patient Username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
             <Button type="button" variant="outline" size="icon" onClick={handleQrScan} aria-label="Scan Patient QR Code">
               <QrCode className="h-5 w-5" />
             </Button>
            <Button type="submit" disabled={isSearching}>
              <Search className="mr-2 h-4 w-4" /> {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 overflow-auto">
        {!patientFound ? (
          <Card className="mt-6 text-center">
            <CardHeader>
              <CardTitle>Find Patient Records</CardTitle>
              <CardDescription>Enter a patient's unique username or scan their QR code to view their medical history.</CardDescription>
            </CardHeader>
             <CardContent>
               <User size={48} className="mx-auto text-muted-foreground mb-4" />
               <p className="text-muted-foreground">Waiting for patient search...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="history" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info"><User className="mr-2 h-4 w-4" />Patient Info</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />View History</TabsTrigger>
              <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" />Upload Report</TabsTrigger>
            </TabsList>

            {/* Patient Info Tab */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                   <CardDescription>Basic details for {patientInfo?.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p><strong>Username:</strong> {patientInfo?.username}</p>
                  <p><strong>Full Name:</strong> {patientInfo?.name}</p>
                  <p><strong>Date of Birth:</strong> {patientInfo?.dob ? format(new Date(patientInfo.dob), 'dd MMM yyyy') : 'N/A'}</p>
                  <p><strong>Contact:</strong> {patientInfo?.contact}</p>
                   <p><strong>Emergency Contact:</strong> {patientInfo?.emergencyContact || 'Not provided'}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* View History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History Timeline</CardTitle>
                  <CardDescription>Chronological record for {patientInfo?.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[55vh]"> {/* Adjust height as needed */}
                    <Table>
                       <TableCaption>End of records for {patientInfo?.name}.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Hospital/Clinic</TableHead>
                          <TableHead>Details/Notes</TableHead>
                           <TableHead className="text-right">View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientHistory.length > 0 ? patientHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{format(record.date, 'dd MMM yyyy')}</TableCell>
                            <TableCell className="flex items-center gap-2">
                               {getIconForType(record.type)} {record.type}
                            </TableCell>
                            <TableCell>{record.doctorName}</TableCell>
                            <TableCell>{record.hospitalName}</TableCell>
                             <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{record.notes || 'N/A'}</TableCell>
                             <TableCell className="text-right">
                              {record.documentUrl && record.type !== 'Note' ? (
                                <Button variant="link" size="sm" asChild>
                                  <a href={record.documentUrl} target="_blank" rel="noopener noreferrer">View Doc</a>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )) : (
                           <TableRow>
                             <TableCell colSpan={6} className="text-center text-muted-foreground h-24">No medical history found for this patient.</TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

             {/* Upload Report Tab */}
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Document</CardTitle>
                   <CardDescription>Add a new medical report for {patientInfo?.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={handleUploadSubmit} className="space-y-4">
                     <div>
                       <label htmlFor="file-upload" className="block text-sm font-medium mb-1">Select File (PDF, JPG, PNG)</label>
                       <Input
                         id="file-upload"
                         type="file"
                         onChange={handleFileUpload}
                         accept=".pdf,.jpg,.jpeg,.png"
                         required
                       />
                        {uploadFile && <p className="text-xs text-muted-foreground mt-1">Selected: {uploadFile.name}</p>}
                     </div>
                     <div>
                        <label htmlFor="doc-type" className="block text-sm font-medium mb-1">Document Type</label>
                        <select
                          id="doc-type"
                          value={uploadDocType}
                          onChange={(e) => setUploadDocType(e.target.value)}
                          required
                           className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>Select type...</option>
                          <option value="Lab Report">Lab Report</option>
                          <option value="Prescription">Prescription</option>
                          <option value="Scan">Scan</option>
                          <option value="Vaccination">Vaccination Record</option>
                           <option value="Note">Doctor Note</option>
                          <option value="Other">Other</option>
                        </select>
                     </div>
                      <div>
                        <label htmlFor="upload-notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
                         <textarea
                           id="upload-notes"
                           value={uploadNotes}
                           onChange={(e) => setUploadNotes(e.target.value)}
                           placeholder="Add any relevant notes..."
                           rows={3}
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                         />
                     </div>
                     <Button type="submit" className="w-full" disabled={isUploading}>
                        <Upload className="mr-2 h-4 w-4" /> {isUploading ? 'Uploading...' : 'Upload Document'}
                     </Button>
                   </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
