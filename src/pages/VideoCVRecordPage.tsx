import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, CameraOff, Mic, MicOff, RotateCcw, Settings } from "lucide-react";

const VideoCVRecordPage = () => {
  const navigate = useNavigate();
  const script = localStorage.getItem("cvexpress_video_script") || "";
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const [status, setStatus] = useState<"waiting" | "countdown" | "recording" | "done">("waiting");
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [fontSize, setFontSize] = useState(24);
  const [showSettings, setShowSettings] = useState(false);

  // Init camera
  useEffect(() => {
    initCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  const initCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      console.error("Camera access error:", e);
    }
  };

  const toggleCamera = () => {
    stream?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    stream?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicOn(!micOn);
  };

  const startCountdown = () => {
    setStatus("countdown");
    let c = 3;
    setCountdown(3);
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        startRecording();
      }
    }, 1000);
  };

  const startRecording = () => {
    if (!stream) return;
    setStatus("recording");
    setTimer(0);
    chunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      localStorage.setItem("cvexpress_video_blob_url", URL.createObjectURL(blob));
      // Store blob reference for upload
      (window as any).__cvexpress_video_blob = blob;
      setStatus("done");
    };

    recorder.start(100);

    // Start timer
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    (window as any).__cvTimerInterval = timerInterval;

    // Start teleprompter scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      scrollIntervalRef.current = window.setInterval(() => {
        scrollRef.current?.scrollBy({ top: scrollSpeed * 1.5 });
      }, 50);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    clearInterval((window as any).__cvTimerInterval);
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (!script) {
    navigate("/video-cv/script");
    return null;
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Countdown overlay */}
      {status === "countdown" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.9)" }}
        >
          <motion.span
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            style={{ fontSize: 120, fontWeight: 700, color: "#00A651" }}
          >
            {countdown}
          </motion.span>
        </motion.div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3" style={{ background: "#111", borderBottom: "1px solid #1a1a1a" }}>
        <div className="flex items-center gap-3">
          <span className="text-sm">
            {status === "waiting" && "⚫ En attente"}
            {status === "recording" && "🔴 Enregistrement"}
            {status === "done" && "✅ Terminé"}
          </span>
          {status === "recording" && (
            <span className="font-mono text-sm" style={{ color: "#00A651" }}>{formatTime(timer)}</span>
          )}
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-white/10" style={{ color: "#999" }}>
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-6 py-3 flex gap-6 items-center flex-wrap" style={{ background: "#111", borderBottom: "1px solid #1a1a1a" }}>
          <label className="flex items-center gap-2 text-xs" style={{ color: "#999" }}>
            🐢 Vitesse 🐇
            <input type="range" min={0.5} max={3} step={0.25} value={scrollSpeed} onChange={(e) => setScrollSpeed(Number(e.target.value))} className="w-24" />
          </label>
          <label className="flex items-center gap-2 text-xs" style={{ color: "#999" }}>
            A Taille A+++
            <input type="range" min={16} max={36} step={2} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24" />
          </label>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Teleprompter */}
        <div className="flex-[3] overflow-hidden p-6 relative" style={{ background: "#0a0a0a" }}>
          <div ref={scrollRef} className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="max-w-xl mx-auto py-20">
              <p style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", fontSize, lineHeight: 1.8, color: "#eee" }}>{script}</p>
            </div>
          </div>
          {/* Highlight line indicator */}
          <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "45%", height: fontSize * 2, background: "rgba(0,166,81,0.08)", borderTop: "1px solid rgba(0,166,81,0.2)", borderBottom: "1px solid rgba(0,166,81,0.2)" }} />
        </div>

        {/* Camera */}
        <div className="flex-[2] flex flex-col items-center justify-center p-4 gap-4" style={{ background: "#111" }}>
          <div className="w-full max-w-xs aspect-square rounded-full overflow-hidden relative" style={{ border: "3px solid #00A651" }}>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#1a1a1a" }}>
                <CameraOff className="w-8 h-8" style={{ color: "#555" }} />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={toggleCamera} className="p-3 rounded-full" style={{ background: cameraOn ? "#1a1a1a" : "#EF4444" }}>
              {cameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>
            <button onClick={toggleMic} className="p-3 rounded-full" style={{ background: micOn ? "#1a1a1a" : "#EF4444" }}>
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 px-6 py-4" style={{ background: "#111", borderTop: "1px solid #1a1a1a" }}>
        {status === "waiting" && (
          <button onClick={startCountdown} className="px-8 py-3 rounded-full font-semibold text-lg flex items-center gap-2" style={{ background: "#EF4444", color: "#fff" }}>
            🔴 Démarrer l'enregistrement
          </button>
        )}
        {status === "recording" && (
          <button onClick={stopRecording} className="px-8 py-3 rounded-full font-semibold text-lg flex items-center gap-2" style={{ background: "#EF4444", color: "#fff" }}>
            ⏹️ Arrêter
          </button>
        )}
        {status === "done" && (
          <div className="flex gap-3">
            <button onClick={() => { setStatus("waiting"); setTimer(0); }} className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium" style={{ background: "#1a1a1a", border: "1px solid #333", color: "#ccc" }}>
              <RotateCcw className="w-4 h-4" /> Recommencer
            </button>
            <button onClick={() => navigate("/video-cv/preview")} className="px-6 py-3 rounded-lg font-semibold" style={{ background: "#00A651", color: "#fff" }}>
              ✅ Voir le résultat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCVRecordPage;
