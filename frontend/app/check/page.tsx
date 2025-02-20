"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  AlertTriangle,
  Shield,
  Download,
  Mail,
  Lock,
  BarChart,
} from "lucide-react";
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

  if (/DMARC: reject|quarantine/i.test(text)) protocolStatus.DMARC = "Safe";
  else if (/DMARC: none|fail/i.test(text)) protocolStatus.DMARC = "Unsafe";

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
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Mail className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Email Shield
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs
            defaultValue="single"
            className="w-full"
          >
            <TabsList className="w-full mb-4 bg-transparent flex">
              <TabsTrigger
                value="single"
                className="flex-1 py-3 font-medium"
              >
                <Mail className="w-4 h-4 mr-2" />
                Single Analysis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="single">
              <Card className="border-none shadow-lg bg-white rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Analyze Email Content
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Paste your email to scan for spam and security issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Textarea
                    placeholder="Paste email content here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] mb-6 border-slate-200 focus:border-indigo-300 transition-all rounded-lg resize-none"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !inputText.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white py-2 font-medium text-lg transition-all"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      "Analyze Email"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Error: {error}
            </div>
          )}

          {response && (
            <Card className="mt-6 border-none shadow-lg bg-white rounded-xl overflow-hidden">
              <CardHeader
                className={
                  response.predicted_class === 1
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                }
              >
                <CardTitle className="flex items-center">
                  {response.predicted_class === 1 ? (
                    <AlertTriangle className="mr-2 h-6 w-6" />
                  ) : (
                    <Shield className="mr-2 h-6 w-6" />
                  )}
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-white opacity-90">
                  {response.predicted_class === 1
                    ? "Potential threat detected in this email"
                    : "This email appears to be legitimate"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500 font-medium">
                      Spam Probability
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        response.probabilities[1] > 0.5
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {(response.probabilities[1] * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        response.probabilities[1] > 0.5
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${response.probabilities[1] * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-indigo-600" />
                    Classification
                  </h3>
                  <div
                    className={`p-4 rounded-lg flex items-center ${
                      response.predicted_class === 1
                        ? "bg-red-50 text-red-800"
                        : "bg-green-50 text-green-800"
                    }`}
                  >
                    {response.predicted_class === 1 ? (
                      <>
                        <AlertTriangle className="mr-3 h-6 w-6 text-red-600" />
                        <div>
                          <p className="font-bold">Spam Detected</p>
                          <p className="text-sm opacity-80">
                            This email contains suspicious content
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Shield className="mr-3 h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-bold">Legitimate Email</p>
                          <p className="text-sm opacity-80">
                            This email appears to be safe
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-indigo-600" />
                    Security Protocols
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(response.protocols || {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border flex items-center ${
                            value === "Safe"
                              ? "bg-green-50 border-green-100 text-green-700"
                              : value === "Unsafe"
                              ? "bg-red-50 border-red-100 text-red-700"
                              : "bg-slate-50 border-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="font-medium mr-2">{key}:</span>
                          <span
                            className={`text-sm font-bold ${
                              value === "Safe"
                                ? "text-green-600"
                                : value === "Unsafe"
                                ? "text-red-600"
                                : "text-slate-600"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleDownloadReport}
                  className="w-full flex items-center justify-center bg-slate-800 hover:bg-slate-900 transition-colors"
                >
                  <Download className="mr-2 h-5 w-5" /> Download Analysis Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
