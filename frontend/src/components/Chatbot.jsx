import React, { useState } from "react";
import api from "../utils/axios.js";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m Dog Vaathi’s assistant. Ask me about the store, achievements, videos, or your orders." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");

    try {
      setLoading(true);
      const res = await api.post("/chatbot", { message: userMsg });
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.reply || "I’m here to help!" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, I had trouble answering that." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-xl text-white shadow-lg shadow-brand-500/40 hover:bg-brand-600"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-20 right-4 z-40 flex h-80 w-72 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 text-xs shadow-2xl shadow-slate-950/80">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-200">
              Dog Vaathi Assistant
            </p>
            <button onClick={() => setOpen(false)} className="text-slate-400">
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-1.5 ${
                    m.from === "user"
                      ? "bg-brand-500 text-white"
                      : "bg-slate-800 text-slate-50"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-[10px] text-slate-400">Typing…</p>
            )}
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-800 p-2">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-100 outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-brand-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

