import React, { useEffect, useState } from "react";

type Message = {
  topic: string;
  payload?: any;
  past?: any[];
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log(process.env.REACT_APP_WS_URL);
    const ws = new WebSocket(process.env.REACT_APP_WS_URL?.trim()!);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "subscribe",
          topic: "client:client_A:sms",
          sendLast: true,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (err) => console.error("WS error:", err);
    ws.onclose = () => console.log("❌ WebSocket disconnected");

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📡 Real-Time Client Dashboard</h1>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            <pre>{JSON.stringify(m, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
