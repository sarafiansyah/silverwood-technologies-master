"use client";

import { Input, Card } from "antd";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const { Search } = Input;

export default function GeminiSearch() {
  const [result, setResult] = useState("");

  const onSearch = async (value: string) => {
    const res = await fetch("/api/generative-ai/gemini-integration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: value }),
    });

    const data = await res.json();
    setResult(data.text);
  };

  return (
    <Card title="Gemini Text Search">
      <Search
        placeholder="Ask something..."
        enterButton
        onSearch={onSearch}
      />

      <div style={{ marginTop: 16 }}>
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </Card>
  );
}
