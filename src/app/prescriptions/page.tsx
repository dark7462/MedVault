'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Pill, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Re-use the same interface
interface MedicalRecord {
  id: string;
  type: 'Lab Report' | 'Prescription' | 'Scan' | 'Vaccination';
  date: Date;
  doctorName: string;
  hospitalName: string;
  documentUrl?: string;
}

// Mock data - Same as MyRecords, but we'll filter it
const mockRecords: MedicalRecord[] = [
  { id: 'rec1', type: 'Lab Report', date: new Date(2024, 4, 15), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#' },
  { id: 'rec2', type: 'Prescription', date: new Date(2024, 4, 1), doctorName: 'Dr. Ben Carter', hospitalName: 'General Hospital', documentUrl: '#' },
  { id: 'rec3', type: 'Scan', date: new Date(2024, 3, 20), doctorName: 'Dr. Chloe Davis', hospitalName: 'Metro Imaging', documentUrl: '#' },
  { id: 'rec4', type: 'Vaccination', date: new Date(2023, 10, 5), doctorName: 'Nurse Eva Green', hospitalName: 'Community Health', documentUrl: '#' },
  { id: 'rec5', type: 'Lab Report', date: new Date(2023, 8, 10), doctorName: 'Dr. Anya Sharma', hospitalName: 'City Clinic', documentUrl: '#' },
  { id: 'rec6', type: 'Prescription', date: new Date(2023, 1, 28), doctorName: 'Dr. Ken Adams', hospitalName: 'General Hospital', documentUrl: '#' },
];


export default function PrescriptionsPage() {
  const router = useRouter();
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    // In a real app, fetch data specifically for prescriptions or filter after fetching all
    setTimeout(() => {
      const prescriptionRecords = mockRecords
        .filter(record => record.type === 'Prescription')
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecords(prescriptionRecords);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);


  const filteredRecords = useMemo(() => {
    return records // Already filtered by type in useEffect for this page
      .filter(record => !filterDate || format(record.date, 'yyyy-MM-dd').startsWith(filterDate))
      .filter(record =>
        searchTerm === '' ||
        record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [records, filterDate, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-primary">My Prescriptions</h1>
         <Button variant="ghost" size="icon" aria-label="Filter prescriptions">
           {/* Can add more specific filters for prescriptions if needed */}
          <Filter className="h-6 w-6" />
        </Button>
      </header>

      <div className="p-4 space-y-4 flex-grow">
         {/* Filter Controls */}
         <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Search prescriptions..."
            />
          </CardContent>
         </Card>

        {/* Records List */}
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Your Prescription History</CardTitle>
            <CardDescription>All your uploaded prescription documents.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height */}
             {isLoading ? (
                 <div className="p-4 text-center text-muted-foreground">Loading prescriptions...</div>
               ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <React.Fragment key={record.id}>
                    <div className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                      <div className="mr-4 p-2 bg-green-100 rounded-full">
                        <Pill className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Prescription</p>
                        <p className="text-sm text-muted-foreground">
                          {record.hospitalName} - Dr. {record.doctorName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(record.date, 'dd MMM yyyy')}</p>
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
                <div className="p-4 text-center text-muted-foreground">No prescriptions found matching your filters.</div>
              )}
            </ScrollArea>
          </CardContent>
           <CardFooter className="p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRecords.length} prescription(s).
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
