import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function FocusForge() {
  // пресеты в минутах
  const presets = [5, 15, 25, 50];

  const [minutes, setMinutes] = useState(25);
  const [remainingMs, setRemainingMs] = useState(minutes * 60_000);
  const [running, setRunning] = useState(false);

  // refs для rAF
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  // если меняем пресет во время паузы — обновляем оставшееся время
  useEffect(() => {
    if (!running) setRemainingMs(minutes * 60_000);
  }, [minutes, running]);

  // главный цикл на requestAnimationFrame → плавная энергия
  useEffect(() => {
    if (!running) return;

    const loop = (ts) => {
      const last = lastTsRef.current ?? ts;
      const delta = ts - last; // прошедшее время с прошлого кадра
      lastTsRef.current = ts;

      setRemainingMs((prev) => Math.max(0, prev - delta));
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [running]);

  // когда дошли до нуля — ставим на паузу
  useEffect(() => {
    if (remainingMs === 0 && running) {
      setRunning(false);
      lastTsRef.current = null;
    }
  }, [remainingMs, running]);

  // энергия 0..1
  const energy = Math.max(0, Math.min(1, remainingMs / (minutes * 60_000)));

  function toggle() {
    setRunning((r) => !r);
  }
  function reset() {
    setRunning(false);
    setRemainingMs(minutes * 60_000);
    lastTsRef.current = null;
  }

  // формат времени MM:SS
  const totalSec = Math.ceil(remainingMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <div className=" grid place-items-center bg-black text-neutral-100">
      <div className="w-full max-w-xl p-6 rounded-2xl border border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">FocusForge</h1>

          <div className="flex gap-2">
            {presets.map((m) => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                disabled={running}
                className={`px-3 py-1 rounded-xl border text-sm ${
                  minutes === m
                    ? "border-white/80 bg-white/10"
                    : "border-neutral-700 hover:bg-white/5"
                }`}
                title="Длительность спринта"
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* энергия */}
        <div className="h-3 w-full rounded-full bg-neutral-800 overflow-hidden mb-6">
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: `${energy * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        {/* большой таймер */}
        <div className="text-center">
          <div className="text-6xl sm:text-7xl font-mono tabular-nums select-none">
            {mm}:{ss}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={toggle}
              className={`px-4 py-2 rounded-xl font-semibold ${
                running
                  ? "bg-amber-400/90 hover:bg-amber-400 text-neutral-950"
                  : "bg-emerald-500/90 hover:bg-emerald-500 text-neutral-950"
              }`}
            >
              {running ? "⏸ Пауза" : "▶️ Старт"}
            </button>

            <button
              onClick={reset}
              className="px-3 py-2 rounded-xl border border-neutral-700 hover:bg-white/5"
            >
              ⟳ Сброс
            </button>
          </div>

          <p className="mt-3 text-sm opacity-70">
            Полоса — это «уровень энергии» ⚡ Чем меньше — тем ближе финиш.
          </p>
        </div>
      </div>
    </div>
  );
}
