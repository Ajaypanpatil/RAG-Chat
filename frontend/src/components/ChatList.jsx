import { useEffect, useState } from "react";
import { listChats, createChat } from "../lib/api";

export default function ChatList({ selectedChat, onSelect }) {
  const [chats, setChats] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const { chats } = await listChats();
    setChats(chats);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return alert("Enter chat name");
    setLoading(true);
    try {
      const { chat } = await createChat(name.trim());
      setName("");
      await refresh();
      onSelect(chat);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Create Chat */}
      <div className="flex gap-2 mb-3">
        <input
          className="border rounded-lg px-3 py-2 flex-1 text-sm"
          placeholder="New chat (e.g. Big Data)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
        >
          {loading ? "..." : "Create"}
        </button>
      </div>

      {/* Chat List */}
      <div className="space-y-1 overflow-y-auto max-h-[65vh] pr-1">
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`cursor-pointer rounded-lg p-2 text-left transition ${
              selectedChat?.id === c.id
                ? "bg-blue-100 border border-blue-400"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium text-gray-800">{c.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(c.updatedAt || c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
