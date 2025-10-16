import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';

export default function FocusForge () {

    
    const [ remainingMs, setRemainingMs ] = useState (5 * 60_000)
    const [ running, setRunning ] = useState (false);


    const rafRef = useRef (null);
    const lastTsRef = useRef (null);

    useEffect (() => {
        if (!running) return;

        const loop = (ts) => {
            const last = lastTsRef.current ?? ts;
            const delta = ts - last;
            lastTsRef.current = ts;

            setRemainingMs (prev => {
                const next = Math.max (0, prev - delta);
                if ( next === 0) setRunning (false);
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

    const totalSec = Math.ceil(remainingMs / 1000); 
    const mm = String (Math.floor(totalSec / 60)).padStart (2, '0');
    const ss = String (totalSec % 60).padStart(2, '0');

    const energy = Math.max (0, Math.min (1, remainingMs / (5 * 60_000)))

    function reset () {
        setRunning (false) 
        setRemainingMs (5 * 60_000);
    }
    return (
        <div>
            <h1>FocusForge</h1>
               <div>{mm} : {ss}</div> 
               <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden mt-4">
                    <motion.div 
                        className="h-full bg-emerald-400"
                        animate={{width : `${energy * 100}%`}} 
                        transition={{ease : 'easeOut', duration: 0.5}}/>
               </div>
            <button
                className="bg-white/50 p-4 rounded-2xl cursor-pointer" 
                onClick={() => setRunning ((r) => !r)}
            >
                {running  ? '⏸ Пауза' : '▶️ Старт'}
            </button>
            <button
                className="bg-white/50 p-4 ml-4 rounded-2xl cursor-pointer"
                onClick={() => reset()}>
                ⟳ Сброс
            </button>


        </div>
    )
}