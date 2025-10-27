import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ask, getMessages } from "../lib/api";

export default function ChatBox({ chat }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    async function load() {
      if (!chat) return setMessages([]);
      const { messages } = await getMessages(chat.id);
      setMessages(messages);
    }
    load();
  }, [chat?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!question.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    setLoading(true);
    try {
      const { answer } = await ask(chat.id, userMsg.text);
      setMessages((m) => [...m, { id: Date.now(), role: "bot", text: answer }]);
    } catch {
      setMessages((m) => [...m, { id: Date.now(), role: "bot", text: "Error getting answer" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b bg-white px-5 py-3 text-gray-700 font-medium shadow-sm">
        Chat: <span className="text-blue-600 font-semibold">{chat.name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-lg break-words ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white border rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="border-t bg-white p-3 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
