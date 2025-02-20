"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle, Shield, Download } from "lucide-react";
import crypto from "crypto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PredictionResponse {
  predicted_class: number;
  probabilities: number[];
  blacklist_weight?: number;
  link_anomalies?: string[];
  hash?: string;
  error?: string;
  protocols?: Record<string, string>;
}

const analyzeProtocols = (text: string) => {
  const protocolStatus: Record<string, string> = {
    SPF: "Unknown",
    DKIM: "Unknown",
    DMARC: "Unknown",
    TLS: "Unknown",
  };

  if (/SPF: pass/i.test(text)) protocolStatus.SPF = "Safe";
  else if (/SPF: fail|softfail|neutral/i.test(text))
    protocolStatus.SPF = "Unsafe";

  if (/DKIM: pass/i.test(text)) protocolStatus.DKIM = "Safe";
  else if (/DKIM: fail|none/i.test(text)) protocolStatus.DKIM = "Unsafe";

  if (/DMARC: reject|quarantine/i.test(text)) protocolStatus.DMAR = "Safe";
  else if (/DMARC: none|fail/i.test(text)) protocolStatus.DMAR = "Unsafe";

  if (/TLS: (required|enforced)/i.test(text)) protocolStatus.TLS = "Safe";
  else if (/TLS: none|optional/i.test(text)) protocolStatus.TLS = "Unsafe";

  return protocolStatus;
};

const overrideSpamDetection = (
  originalPrediction: number,
  protocols: Record<string, string>
) => {
  const safeCount = Object.values(protocols).filter(
    (status) => status === "Safe"
  ).length;
  return safeCount >= 3 ? 0 : originalPrediction;
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const protocols = analyzeProtocols(inputText);
      const res = await fetch("http://127.0.0.1:8080/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data: PredictionResponse = await res.json();
      if (data.error) setError(data.error);
      else {
        data.hash = crypto.createHash("sha256").update(inputText).digest("hex");
        data.predicted_class = overrideSpamDetection(
          data.predicted_class,
          protocols
        );
        setResponse({ ...data, protocols });
      }
    } catch (error) {
      setError("Error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!response) return;
    const doc = new jsPDF();

    doc.text("Spam Detection Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        [
          "Final Classification",
          response.predicted_class === 1 ? "Spam" : "Not Spam",
        ],
        [
          "Spam Probability",
          `${(response.probabilities[1] * 100).toFixed(2)}%`,
        ],
        [
          "Not Spam Probability",
          `${(response.probabilities[0] * 100).toFixed(2)}%`,
        ],
        ["Blacklist Weight", response.blacklist_weight ?? "N/A"],
        ["SHA-256 Hash", response.hash ?? "N/A"],
      ],
    });

    const finalY = (doc as any).autoTable.previous.finalY;
    doc.text("Security Protocols", 14, finalY + 10);
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Protocol", "Status"]],
      body: Object.entries(response.protocols || {}).map(([key, value]) => [
        key,
        value,
      ]),
    });

    doc.save(`spam_report_${Date.now()}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Email Spam Detection</h1>
      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Single Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Email</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste email content here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] mb-4"
              />
              <Button
                onClick={handleSubmit}
                disabled={loading || !inputText.trim()}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}
      {response && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center text-lg font-bold">
              {response.predicted_class === 1 ? (
                <>
                  <AlertTriangle className="mr-2 text-red-600" /> Spam Detected
                  ({(response.probabilities[1] * 100).toFixed(2)}%)
                </>
              ) : (
                <>
                  <Shield className="mr-2 text-green-600" /> Not a Spam (
                  {(response.probabilities[0] * 100).toFixed(2)}%)
                </>
              )}
            </p>
            <h3 className="font-bold mt-4">Security Protocols:</h3>
            <ul className="list-disc pl-4">
              {Object.entries(response.protocols || {}).map(([key, value]) => (
                <li
                  key={key}
                  className={
                    value === "Safe" ? "text-green-600" : "text-red-600"
                  }
                >
                  {key}: {value}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleDownloadReport}
              className="mt-4 flex items-center"
            >
              <Download className="mr-2 h-4 w-4" /> Download Report (PDF)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
