"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle, Shield, Download } from "lucide-react";
import crypto from "crypto";

interface PredictionResponse {
  predicted_class: number;
  probabilities: number[];
  blacklist_weight?: number;
  link_anomalies?: string[];
  hash?: string;
  error?: string;
}

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
        setResponse(data);
      }
    } catch (error) {
      setError("Error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!response) return;
    const blob = new Blob([JSON.stringify(response, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `spam_report_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Spam Detection</h1>
        <p className="text-muted-foreground">
          Detect spam, phishing, and legitimate emails
        </p>
      </div>

      <Tabs defaultValue="single" className="mb-8">
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
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {response && !error && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center text-lg font-bold">
              {response.predicted_class === 1 ? (
                <>
                  <AlertTriangle className="mr-2 text-red-600" /> Spam Detected
                </>
              ) : (
                <>
                  <Shield className="mr-2 text-green-600" /> Not a Spam
                </>
              )}
            </p>
            <p className="mt-2 font-semibold">Probabilities:</p>
            <ul className="list-disc pl-4">
              {response.probabilities.map((prob, index) => (
                <li key={index}>
                  {index === 1 ? "Spam Probability" : "Not a Spam Probability"}:{" "}
                  {(prob * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
            {response.blacklist_weight !== undefined && (
              <p className="mt-2 text-sm">
                Blacklist Word Weight: {response.blacklist_weight}
              </p>
            )}
            {response.link_anomalies && response.link_anomalies.length > 0 && (
              <>
                <p className="mt-2 font-semibold">Suspicious Links Detected:</p>
                <ul className="list-disc pl-4 text-red-600">
                  {response.link_anomalies.map((link, index) => (
                    <li key={index}>{link}</li>
                  ))}
                </ul>
              </>
            )}
            <p className="mt-2 text-sm">SHA-256 Hash: {response.hash}</p>
            <Button
              onClick={handleDownloadReport}
              className="mt-4 flex items-center"
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
