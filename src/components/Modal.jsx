import { useEffect } from "react";
import MyButtonWhite from "./ui/MyButtonWhite";
import MyButton from "./ui/MyButton";

export default function Modal ({onClose, open, volume, onSettingVolume, onSave, soundBank, selectedSound, onSelectedSound, onPlay}) {


    useEffect (() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.();} 
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener ('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;
    
    return (
        <div className="fixed inset-0 z-50">
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}>
                    <div
                    role="dialog"
                    aria-modal='true'
                    className="absolute inset-x-0 top-16 mx-auto w-96 rounded-xl bg-white p-6 shadow-xl text-black"
                    onClick={(e) => e.stopPropagation()}>
                        <header className="flex justify-between ">
                            <h2 className="text-xl font-bold mb-4">Settings</h2>
                            <MyButtonWhite 
                                onClick={onClose}>
                                    Close
                            </MyButtonWhite>
                        </header>
                        <section 
                            className="space-y-5">
                                <div className=" items-center justify-between">
                                    <div className="my-5">
                                        <span className="text-2xl font-bold m-5">Master Volume</span>
                                        <span className="text-sm opacity-70 tabular-nums">
                                            {volume}%
                                        </span>
                                    </div>

                                    <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={volume}
                                    onChange={(e) => onSettingVolume(e)}
                                    className="w-full"/>
                                </div>
                                <h3 className="text-2xl font-bold my-5 border-t-2 pt-2">Choose sound</h3>
                                <div className="flex justify-around">
                                    
                                    <select
                                    value={selectedSound}
                                    onChange={(e) => onSelectedSound (e.target.value)}
                                    className="px-3 py-2 cursor-pointer border-2 rounded-xl">
                                    {Object.entries(soundBank).map (([id, v]) => (
                                        <option key={id} value={id}>{v.label}</option>
                                    ))}
                                    </select>
                                    <MyButtonWhite onClick={() => onPlay()}>
                                        Preview
                                    </MyButtonWhite>
                                </div>
                                
                                <MyButtonWhite 
                                    onClick={() => onSave()}
                                    className="mx-auto">
                                        
                                    Сохранить
                                </MyButtonWhite>
                        </section>
                                
                        
                    </div>
                </div>
            
        </div>
    )

}
