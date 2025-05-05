'use client';

import React, { useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Camera, File, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { autoCategorizeRecord, AutoCategorizeRecordOutput } from '@/ai/flows/auto-categorize-records';

const formSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  dateOfIssue: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  doctorName: z.string().min(1, "Doctor name is required"),
  hospitalName: z.string().min(1, "Hospital/Clinic name is required"),
  file: z.any().refine(file => file?.length == 1, 'File is required.'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      dateOfIssue: new Date().toISOString().split('T')[0], // Default to today
      doctorName: "",
      hospitalName: "",
      file: undefined,
      notes: "",
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue("file", event.target.files); // Set file in form state

      // Trigger AI categorization
      setIsCategorizing(true);
      try {
        // Simulate reading file content (in real app, need proper file reading)
        const reader = new FileReader();
        reader.onload = async (e) => {
            const textContent = e.target?.result as string;
            // For non-text files, you might need OCR or different handling
             if (textContent) {
                const categorizationResult: AutoCategorizeRecordOutput = await autoCategorizeRecord({ documentText: textContent });

                // Update form fields with AI results if they are empty
                if (!form.getValues("documentType")) form.setValue("documentType", categorizationResult.category || "");
                if (!form.getValues("doctorName")) form.setValue("doctorName", categorizationResult.doctorName || "");
                if (!form.getValues("dateOfIssue") || form.getValues("dateOfIssue") === new Date().toISOString().split('T')[0]) {
                  // Attempt to parse and set date, fallback to today if invalid
                  try {
                     const parsedDate = new Date(categorizationResult.dateOfIssue);
                     if (!isNaN(parsedDate.getTime())) {
                       form.setValue("dateOfIssue", parsedDate.toISOString().split('T')[0]);
                     }
                  } catch (dateError) {
                     console.warn("AI date parse error:", dateError);
                  }
                }
                if (!form.getValues("hospitalName")) form.setValue("hospitalName", categorizationResult.hospitalClinicName || "");

                toast({ title: "AI Categorization", description: "Document details populated." });
             } else {
                 toast({ title: "AI Categorization", description: "Could not read text content for auto-categorization.", variant: "destructive" });
             }
        };
        reader.onerror = () => {
             toast({ title: "File Read Error", description: "Could not read file content.", variant: "destructive" });
             setIsCategorizing(false);
        }
        // Read as text - adjust for different file types if needed
         reader.readAsText(file);

      } catch (error) {
        console.error("AI Categorization Error:", error);
        toast({ title: "AI Error", description: "Could not auto-categorize document.", variant: "destructive" });
      } finally {
        setIsCategorizing(false);
      }
    } else {
      setFileName(null);
      form.setValue("file", undefined);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsUploading(true);
    console.log("Upload Data:", data);
    // TODO: Implement actual file upload logic to backend/storage
    // This typically involves using FormData and fetch/axios

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsUploading(false);
    toast({
      title: "Upload Successful",
      description: `${data.file[0].name} has been added to your records.`,
       variant: "default", // Use default which should pick up accent color styles via CSS
    });
    router.push('/my-records'); // Navigate back or to records page
  };

   const triggerFileInput = () => fileInputRef.current?.click();

   // Placeholder for camera functionality
   const handleCameraUpload = () => {
       toast({ title: "Camera Upload", description: "Camera functionality not yet implemented in this prototype." });
   };

    // Placeholder for Hospital Sync
   const handleHospitalSync = () => {
     toast({ title: "Hospital Sync", description: "Hospital Sync feature not yet implemented in this prototype." });
   };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-background border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-primary ml-4">Upload New Document</h1>
      </header>

      <div className="flex-grow p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Add Medical Record</CardTitle>
            <CardDescription>Upload a document and add its details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Upload Method Buttons */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button type="button" variant="outline" onClick={triggerFileInput}>
                      <File className="mr-2 h-4 w-4" /> From File
                    </Button>
                     <Button type="button" variant="outline" onClick={handleCameraUpload}>
                      <Camera className="mr-2 h-4 w-4" /> Use Camera
                    </Button>
                    {/* <Button type="button" variant="outline" onClick={handleHospitalSync} className="col-span-2">
                       <Hospital className="mr-2 h-4 w-4" /> Sync from Hospital (Future)
                    </Button> */}
                 </div>

                 {/* Hidden File Input */}
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => ( // field includes onChange, onBlur, value, ref
                    <FormItem className="hidden">
                      <FormControl>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png" // Specify acceptable file types
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 {/* Display selected file name */}
                 {fileName && (
                  <div className="text-sm text-muted-foreground border p-2 rounded-md flex justify-between items-center">
                    <span>Selected: {fileName}</span>
                    {isCategorizing && <span className="text-xs text-primary animate-pulse">AI Analyzing...</span>}
                   </div>
                 )}

                 {/* Metadata Fields */}
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lab Report">Lab Report</SelectItem>
                          <SelectItem value="Prescription">Prescription</SelectItem>
                          <SelectItem value="Scan">Scan (X-ray, MRI, etc.)</SelectItem>
                          <SelectItem value="Vaccination">Vaccination Record</SelectItem>
                          <SelectItem value="Invoice">Invoice/Bill</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfIssue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Issue</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dr. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="hospitalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital / Clinic Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., General Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any relevant notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isUploading || isCategorizing}>
                  {isUploading ? (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4 animate-pulse" /> Uploading...
                    </>
                  ) : (
                     <>
                      <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
