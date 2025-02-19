"use client";

import { useState } from "react";

interface PredictionResponse {
  predicted_class: number;
  probabilities: number[];
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data: PredictionResponse = await res.json();
      console.log("API Response:", data);

      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data);
      }
    } catch (error) {
      console.error(error);
      setError("Error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>Next.js Predict API</h1>

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text"
        style={{ marginRight: "10px", padding: "5px", width: "100%" }}
      />

      <button
        onClick={handleSubmit}
        style={{ padding: "10px", marginTop: "10px", width: "100%" }}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {response && !error && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        >
          <h2>Response:</h2>
          <p>
            <strong>Predicted Class:</strong> {response.predicted_class}
          </p>
          <p>
            <strong>Probabilities:</strong>
          </p>
          <ul>
            {response.probabilities.map((prob, index) => (
              <li key={index}>
                Class {index}: {(prob * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
