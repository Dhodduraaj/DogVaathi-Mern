import React, { useState } from "react";
import api from "../utils/axios.js";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m Dog Vaathi’s assistant. Ask me about the store, achievements, videos, or your orders." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Animation state for smooth closing
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300); // match duration-300
  };

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
        onClick={() => open ? handleClose() : setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-2xl text-white shadow-xl shadow-brand-500/40 transition-all duration-300 hover:scale-110 hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/30 ${open && !isClosing ? 'rotate-90 scale-90 bg-slate-800 hover:bg-slate-700' : ''}`}
        aria-label="Toggle Chat"
      >
        {open && !isClosing ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {(open || isClosing) && (
        <div className={`fixed bottom-24 right-6 z-40 flex h-[380px] w-80 flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white text-lg shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 origin-bottom-right ${isClosing ? 'scale-50 opacity-0' : 'scale-100 opacity-100 animate-fade-in'}`}>
          <div className="flex items-center justify-between border-b border-cream-100 bg-brand-500 bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cream-100 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cream-50"></span>
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Dog Vaathi Assistant
              </p>
            </div>
            <button onClick={handleClose} className="text-white/80 transition-colors hover:text-white focus:outline-none">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 bg-cream-50/50 dark:bg-slate-900/50 scroll-smooth">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-[13px] leading-relaxed ${
                    m.from === "user"
                      ? "rounded-tr-sm bg-brand-500 text-white"
                      : "rounded-tl-sm border border-cream-200 bg-white text-dark-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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
          <form onSubmit={sendMessage} className="border-t border-cream-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-lg text-dark-900 outline-none transition-colors focus:border-brand-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:bg-slate-900"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-semibold text-white shadow-md transition-all hover:bg-brand-600 hover:shadow-lg disabled:opacity-50 disabled:hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                aria-label="Send message"
              >
                <svg className="h-4 w-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

