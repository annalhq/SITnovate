"use client";

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2, Upload, Download, AlertTriangle, Shield, FileText } from 'lucide-react';
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AnalysisResult {
  id: string;
  content: string;
  subject?: string;
  sender?: string;
  classification: 'Spam' | 'Not Spam' | 'Phishing';
  confidence: number;
  threats: string[];
  md5: string;
  sha256: string;
  timestamp: Date;
}

export default function DetectPage() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/json': ['.json'],
    },
    onDrop: handleFileDrop,
  });

  async function handleFileDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const content = await file.text();
        const data = JSON.parse(content);
        if (data.emails && Array.isArray(data.emails)) {
          analyzeBatch(data.emails);
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }

  function generateHashes(text: string) {
    const md5 = CryptoJS.MD5(text).toString();
    const sha256 = CryptoJS.SHA256(text).toString();
    return { md5, sha256 };
  }

  async function analyzeSingle() {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { md5, sha256 } = generateHashes(inputText);

      const result: AnalysisResult = {
        id: Math.random().toString(36).substr(2, 9),
        content: inputText,
        classification: Math.random() > 0.5 ? 'Spam' : 'Not Spam',
        confidence: Math.random() * 100,
        threats: ['Suspicious Links', 'Urgency Language'],
        md5,
        sha256,
        timestamp: new Date(),
      };

      setResults((prev) => [result, ...prev]);
      setInputText('');
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(0);
      }, 500);
    }
  }

  async function analyzeBatch(emails: any[]) {
    setIsAnalyzing(true);
    setProgress(0);

    const totalEmails = emails.length;
    let processed = 0;

    const newResults: AnalysisResult[] = [];

    for (const email of emails) {
      const { md5, sha256 } = generateHashes(email.body);

      const result: AnalysisResult = {
        id: Math.random().toString(36).substr(2, 9),
        content: email.body,
        subject: email.subject,
        sender: email.sender,
        classification: Math.random() > 0.5 ? 'Spam' : 'Not Spam',
        confidence: Math.random() * 100,
        threats: ['Suspicious Links', 'Urgency Language'],
        md5,
        sha256,
        timestamp: new Date(),
      };

      newResults.push(result);
      processed++;
      setProgress((processed / totalEmails) * 100);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setResults((prev) => [...newResults, ...prev]);
    setIsAnalyzing(false);
  }

  function generateReport(result: AnalysisResult) {
    const pdf = new jsPDF();
    const timestamp = format(result.timestamp, 'yyyy-MM-dd HH:mm:ss');

    pdf.setFontSize(20);
    pdf.text('Email Analysis Report', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Generated: ${timestamp}`, 20, 30);

    const tableData = [
      ['Classification', result.classification],
      ['Confidence', `${result.confidence.toFixed(2)}%`],
      ['MD5 Hash', result.md5],
      ['SHA-256 Hash', result.sha256],
      ['Threats Detected', result.threats.join(', ')],
    ];

    if (result.subject) tableData.unshift(['Subject', result.subject]);
    if (result.sender) tableData.unshift(['Sender', result.sender]);

    (pdf as any).autoTable({
      startY: 40,
      head: [['Property', 'Value']],
      body: tableData,
    });

    (pdf as any).autoTable({
      startY: (pdf as any).lastAutoTable.finalY + 10,
      head: [['Email Content']],
      body: [[result.content]],
    });

    pdf.save(`analysis-report-${result.id}.pdf`);
  }

  function generateBatchReport() {
    const pdf = new jsPDF();
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    pdf.setFontSize(20);
    pdf.text('Batch Analysis Report', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Generated: ${timestamp}`, 20, 30);

    const tableData = results.map(result => [
      result.subject || 'N/A',
      result.classification,
      `${result.confidence.toFixed(2)}%`,
      result.threats.join(', '),
    ]);

    (pdf as any).autoTable({
      startY: 40,
      head: [['Subject', 'Classification', 'Confidence', 'Threats']],
      body: tableData,
    });

    pdf.save(`batch-analysis-report.pdf`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Analysis</h1>
        <p className="text-muted-foreground">
          Detect spam and phishing attempts in emails
        </p>
      </div>

      <TooltipProvider>
        <Tabs defaultValue="single" className="mb-8">
          <TabsList>
            <TabsTrigger value="single">
              <Tooltip>
                <TooltipTrigger>Single Analysis</TooltipTrigger>
                <TooltipContent>
                  Analyze a single email by pasting its content
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="batch">
              <Tooltip>
                <TooltipTrigger>Batch Analysis</TooltipTrigger>
                <TooltipContent>
                  Upload a JSON file containing multiple emails
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Single Email Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste email content here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] mb-4"
                />
                <Button
                  onClick={analyzeSingle}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing..
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle>Batch Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary' : 'border-border'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Drag & drop a JSON file here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Format: {`{"emails": [{"subject": "", "body": "", "sender": ""}]}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </TooltipProvider>

      {isAnalyzing && (
        <div className="mb-8">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Analyzing... {progress.toFixed(0)}%
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Results</h2>
            {results.length > 1 && (
              <Button onClick={generateBatchReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Batch Report
              </Button>
            )}
          </div>

          {results.map((result) => (
            <Card key={result.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    {result.subject && (
                      <p className="font-medium">Subject: {result.subject}</p>
                    )}
                    {result.sender && (
                      <p className="text-sm text-muted-foreground">
                        From: {result.sender}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport(result)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                  <div className="flex items-center space-x-2">
                    {result.classification === 'Spam' ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Shield className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">{result.classification}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.confidence.toFixed(2)}% confidence
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Threats Detected</p>
                    <p className="text-sm text-muted-foreground">
                      {result.threats.join(', ')}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Analysis Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(result.timestamp, 'PPpp')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Content</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {result.content}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">MD5 Hash</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {result.md5}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">SHA-256 Hash</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {result.sha256}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}