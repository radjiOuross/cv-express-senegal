import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoachDrawer from "./CoachDrawer";

const CoachButton = () => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  return (
    <>
      <motion.button
        onClick={() => { setOpen(true); setUnread(0); }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer"
        style={{ background: "#00A651", color: "#fff", zIndex: 9999 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Coach IA — Je suis là pour t'aider !"
      >
        💬
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid #00A651" }}
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
        />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#EF4444", color: "#fff" }}>{unread}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && <CoachDrawer onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default CoachButton;
