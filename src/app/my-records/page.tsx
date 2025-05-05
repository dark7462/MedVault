'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Filter, FileText, FlaskConical, Microscope, Pill } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Mock data structure
interface MedicalRecord {
  id: string;
  type: 'Lab Report' | 'Prescription' | 'Scan' | 'Vaccination';
  date: Date;
  doctorName: string;
  hospitalName: string;
  documentUrl?: string; // Optional link to view the document
}

// Mock data - Replace with actual data fetching
const mockRecords: MedicalRecord[] = [
  { id: 'rec1', type: 'Lab Report', date: new Date(2024, 4, 15), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#' },
  { id: 'rec2', type: 'Prescription', date: new Date(2024, 4, 1), doctorName: 'Dr. Ben Carter', hospitalName: 'General Hospital', documentUrl: '#' },
  { id: 'rec3', type: 'Scan', date: new Date(2024, 3, 20), doctorName: 'Dr. Chloe Davis', hospitalName: 'Metro Imaging', documentUrl: '#' },
  { id: 'rec4', type: 'Vaccination', date: new Date(2023, 10, 5), doctorName: 'Nurse Eva Green', hospitalName: 'Community Health', documentUrl: '#' },
  { id: 'rec5', type: 'Lab Report', date: new Date(2023, 8, 10), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#' },
   { id: 'rec6', type: 'Prescription', date: new Date(2023, 1, 28), doctorName: 'Dr. Ken Adams', hospitalName: 'General Hospital', documentUrl: '#' },
];

const getIconForType = (type: MedicalRecord['type']) => {
  switch (type) {
    case 'Lab Report': return <FlaskConical className="h-5 w-5 text-blue-500" />;
    case 'Prescription': return <Pill className="h-5 w-5 text-green-500" />;
    case 'Scan': return <Microscope className="h-5 w-5 text-purple-500" />; // Using Microscope as proxy for Scan
    case 'Vaccination': return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="m18.5 2.5.35.35a1.414 1.414 0 0 1 0 2L8.5 15.2a1.414 1.414 0 0 1-2 0L2.15 10.85a1.414 1.414 0 0 1 0-2l.35-.35"/><path d="M6.5 13.2 11 17.5l10.5-10.5"/><path d="m12.5 6.5 4.5 4.5"/><path d="m18.5 2.5 4.5 4.5"/></svg>; // Syringe Icon
    default: return <FileText className="h-5 w-5 text-gray-500" />;
  }
};


export default function MyRecordsPage() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>(''); // Can be extended for date range
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [records, setRecords] = useState<MedicalRecord[]>([]); // State for fetched records
  const [isLoading, setIsLoading] = useState(true);

   // Simulate fetching data
  useEffect(() => {
    // In a real app, fetch data here
    setTimeout(() => {
      setRecords(mockRecords.sort((a, b) => b.date.getTime() - a.date.getTime())); // Sort by date desc initially
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const filteredRecords = useMemo(() => {
    return records
      .filter(record => filterType === 'all' || record.type === filterType)
      .filter(record => !filterDate || format(record.date, 'yyyy-MM-dd').startsWith(filterDate))
      .filter(record =>
        searchTerm === '' ||
        record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [records, filterType, filterDate, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-primary">My Medical Records</h1>
        <Button variant="ghost" size="icon" aria-label="Filter records">
           {/* Basic filter icon, could trigger a popover/dialog for advanced filters */}
          <Filter className="h-6 w-6" />
        </Button>
      </header>

      <div className="p-4 space-y-4 flex-grow">
         {/* Filter Controls */}
         <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
             <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Lab Report">Lab Report</SelectItem>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Scan">Scan</SelectItem>
                <SelectItem value="Vaccination">Vaccination</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by Date"
            />
             <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
            />
          </CardContent>
         </Card>

        {/* Records List */}
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Your History</CardTitle>
            <CardDescription>Chronological view of your uploaded medical documents.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height as needed */}
               {isLoading ? (
                 <div className="p-4 text-center text-muted-foreground">Loading records...</div>
               ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <React.Fragment key={record.id}>
                    <div className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                      <div className="mr-4 p-2 bg-secondary rounded-full">
                        {getIconForType(record.type)}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.hospitalName} - Dr. {record.doctorName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(record.date, 'dd MMM yyyy')}</p>
                        {/* Optional: Link to view document */}
                         {record.documentUrl && (
                          <a href={record.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                            View Doc
                          </a>
                        )}
                      </div>
                    </div>
                    {index < filteredRecords.length - 1 && <Separator className="my-0" />}
                  </React.Fragment>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No records found matching your filters.</div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRecords.length} of {records.length} records.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
