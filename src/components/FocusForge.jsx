import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import MyButton from "./ui/MyButton";
import Modal from "./Modal";
import { SOUND_BANK } from '../constants/sound.js'
import useLocalStorageV2 from "../hooks/useLocalStorageV2.js";
 
export default function FocusForge () {

    const minArr = [0.1 , 5, 15, 20, 25, 30, 40, 45];
    
    const [settingOpen, setSettingOpen] = useState (false);

    
    const [ selectedSound, setSelectedSound ] = useLocalStorageV2 ('ff:sound', 'ping');
    const [ volume, setVolume ] = useLocalStorageV2 ('ff:volume', '90');

    const [minutes, setMinutes ] = useState (25);
    
    const [ savedVolume, setSavedVolume ] = useState (100);
    
    const [ remainingMs, setRemainingMs ] = useState(minutes * 60_000)
    const [ running, setRunning ] = useState (false);

    const ping = useRef (new Audio ())

    const rafRef = useRef (null);
    const lastTsRef = useRef (null);

    useEffect (() => {
        setSavedVolume (Number(volume))
    }, [])
    
    useEffect (() => {
        if (!ping.current) return;
        ping.current.src = SOUND_BANK[selectedSound].path;
        ping.current.volume = Math.min(Math.max (savedVolume / 100, 0), 1)
    }, [selectedSound, savedVolume])
    
    const onSettingVolume = (e) => setVolume(e.target.value);
    
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
                    ping.current.volume = savedVolume/100;
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
    }, [running, savedVolume])

    function toggleStart () {
        setRunning ((r) => !r);
        ping.current.volume = savedVolume/100;
        ping.current.currentTime = 0;
        ping.current.play().catch(() => {})
    }
    function previewStart () {
        ping.current.volume = Math.min (Math.max(Number(volume) / 100 ));

        ping.current.play().catch (() => {})
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
    
    const handleSave = () => {
        setSavedVolume (Number (volume));
        onClose ();
    }
    
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
                onKeyDown= {(e) => {
                    if (e.key === 'Space') {
                        e.preventDefault();
                        toggleStart ();
                    }
                }}
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

            <Modal 
                onClose={onClose} 
                open={settingOpen}
                volume={volume}
                onSettingVolume={onSettingVolume}
                onSave={handleSave}
                soundBank={SOUND_BANK}
                selectedSound={selectedSound}
                onSelectedSound={(id) => setSelectedSound (id)}
                onPlay={previewStart}></Modal>
                

        </div>
    )
}