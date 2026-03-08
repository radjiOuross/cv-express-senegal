import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Minus, Trash2, Send } from "lucide-react";
import { callCoach } from "@/services/geminiService";
import { loadFormData } from "@/lib/storage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "coach_history";
const QUICK_CHIPS = [
  "💡 Améliorer mon CV",
  "💰 Prétention salariale",
  "📧 Relancer un recruteur",
  "🤝 Négocier mon salaire",
  "😰 Pas de réponse depuis 2 semaines",
  "🎤 Préparer un entretien",
  "🌍 Travailler à l'étranger",
  "📝 Rédiger un email pro",
];

const CoachDrawer = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const formData = loadFormData();
  const prenom = formData?.personal?.prenom || "ami(e)";
  const cvJson = JSON.stringify(formData);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(parsed);
        if (parsed.length > 0) setShowWelcome(false);
      }
    } catch {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const persist = (msgs: Message[]) => {
    const last30 = msgs.slice(-30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(last30));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setShowWelcome(false);
    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    persist(updatedMessages);
    setInput("");
    setTyping(true);

    try {
      const reply = await callCoach(text.trim(), updatedMessages.slice(-20), cvJson);
      const aiMsg: Message = { role: "assistant", content: reply };
      const final = [...updatedMessages, aiMsg];
      setMessages(final);
      persist(final);
    } catch {
      const errorMsg: Message = { role: "assistant", content: "Désolé, une erreur est survenue. Réessaie dans un instant ! 🙏" };
      const final = [...updatedMessages, errorMsg];
      setMessages(final);
      persist(final);
    } finally {
      setTyping(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowWelcome(true);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full flex flex-col"
      style={{ width: "min(380px, 100vw)", zIndex: 10000, background: "#111" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: "rgba(0,166,81,0.15)" }}>🤖</div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#fff" }}>Coach CVExpress</p>
            <p className="text-xs" style={{ color: "#00A651" }}>● En ligne maintenant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: "#999" }}><Minus className="w-4 h-4" /></button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: "#999" }}><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {showWelcome && (
          <div className="rounded-lg p-4" style={{ background: "#2a2a2a", borderLeft: "3px solid #00A651" }}>
            <p style={{ color: "#eee", fontSize: 14, lineHeight: 1.6 }}>
              👋 Salut {prenom} ! Je suis ton coach carrière personnel. Je connais ton CV par cœur et je suis là 24h/24 pour t'aider dans ta recherche d'emploi.
              <br /><br />Par où veux-tu commencer ?
            </p>
          </div>
        )}

        {showWelcome && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:brightness-110"
                style={{ background: "#1a1a1a", border: "1px solid #333", color: "#ccc" }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-lg px-4 py-2.5 text-sm"
              style={
                msg.role === "user"
                  ? { background: "#00A651", color: "#fff" }
                  : { background: "#2a2a2a", color: "#eee", borderLeft: "3px solid #00A651" }
              }
            >
              <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.content}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-3 flex gap-1" style={{ background: "#2a2a2a" }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#00A651" }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid #2a2a2a" }}>
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ton message..."
            className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
            disabled={typing}
          />
          <button
            type="submit"
            disabled={typing || !input.trim()}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: "#00A651", color: "#fff" }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <button onClick={clearHistory} className="flex items-center gap-1 mx-auto mt-2 text-xs transition-all hover:brightness-125" style={{ color: "#555" }}>
          <Trash2 className="w-3 h-3" /> Effacer la conversation
        </button>
      </div>
    </motion.div>
  );
};

export default CoachDrawer;
