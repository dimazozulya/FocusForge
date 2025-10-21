import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import MyButton from "./ui/MyButton";
import Modal from "./Modal";

export default function FocusForge () {

    const minArr = [0.1 , 5, 15, 20, 25, 30, 40, 45];
    
    const [settingOpen, setSettingOpen] = useState (false);

    const [minutes, setMinutes ] = useState (25);
    
    const [ remainingMs, setRemainingMs ] = useState(minutes * 60_000)
    const [ running, setRunning ] = useState (false);

    const ping = useRef (new Audio ('/sounds/ping.mp3'))
    const rafRef = useRef (null);
    const lastTsRef = useRef (null);

    useEffect (() => {
        if (!running) setRemainingMs (minutes * 60_000)
    }, [minutes]);

    useEffect (() => {
        if (!running) return;

        const loop = (ts) => {
            const last = lastTsRef.current ?? ts;
            const delta = ts - last;
            lastTsRef.current = ts;

            setRemainingMs (prev => {
                const next = Math.max (0, prev - delta);
                if (prev > 0 && next === 0) {
                    setRunning (false);
                    lastTsRef.current = null;
                    ping.current.currentTime = 0;
                    ping.current.play().catch(() => {})
                } 
                return next;
            })

            rafRef.current = requestAnimationFrame(loop);
        }

        rafRef.current = requestAnimationFrame(loop);
        
        return () => {
            cancelAnimationFrame (rafRef.current);
            lastTsRef.current = null;
        }
    }, [running])

    function toggleStart () {
        setRunning ((r) => !r);
        ping.current.currentTime = 0;
        ping.current.play().catch(() => {})
    }

    const totalSec = Math.ceil(remainingMs / 1000); 
    const mm = String (Math.floor(totalSec / 60)).padStart (2, '0');
    const ss = String (totalSec % 60).padStart(2, '0');

    const energy = Math.max (0, Math.min (1, remainingMs / (minutes * 60_000)))


    function reset () {
        setRunning (false) 
        setRemainingMs (minutes * 60_000);
        lastTsRef.current = null;
    }

    const onClose = () => setSettingOpen (false)  
        
    return (
        <div>
            <div className="my-15 text-9xl">
                {mm} : {ss}
            </div> 


            <div className="my-15 h-3 w-full bg-neutral-800 rounded-full overflow-hidden mt-4">
                    <motion.div 
                        className="h-full bg-emerald-400"
                        animate={{width : `${energy * 100}%`}} 
                        transition={{ease : 'easeOut', duration: 0.5}}/>
            </div>

                <div className="flex gap-2 mb-3">       
            {minArr.map (m => (
                <button
                key={m}
                onClick={() => setMinutes(m)}
                disabled={running}
                className={`p-4 rounded-full border text-sm transition-all duration-500${
                    minutes === m ? 'border-white/50 bg-emerald-600' : 'border-neutral-700 hover:bg-emerald-700'  
                }`}>
                    {m}m
                </button>
                ))}
                </div>

               
            <MyButton
                onClick={() => toggleStart()}
            >
                {running  ? '⏸ Пауза' : '▶️ Старт'}
            </MyButton>
            <MyButton
                onClick={() => reset()}>
                ⟳ Сброс
            </MyButton>

            <MyButton
                onClick={() => setSettingOpen(true)}
            >Настройки</MyButton>

            <Modal onClose={onClose} open={settingOpen}></Modal>


        </div>
    )
}