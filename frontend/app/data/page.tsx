"use client";

import { useEffect, useState } from "react";
import { EmailData } from "@/types";

export default function Home() {
  const [data, setData] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emails")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Failed to load data</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Email Data</h1>

      <h2 className="text-xl font-semibold mt-4">Headers</h2>
      <pre className=" p-2 rounded">
        {JSON.stringify(data.headers, null, 2)}
        console.log(data.headers);
      </pre>

      <h2 className="text-xl font-semibold mt-4">Links</h2>
      <pre className=" p-2 rounded">{JSON.stringify(data.links, null, 2)}</pre>

      <h2 className="text-xl font-semibold mt-4">Texts</h2>
      <pre className=" p-2 rounded">{JSON.stringify(data.texts, null, 2)}</pre>
    </div>
  );
}
