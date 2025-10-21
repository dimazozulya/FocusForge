import { useEffect } from "react";

export default function Modal ({onClose, open}) {

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
                            <h2 className="text-xl font-bold mb-4" >Settings</h2>
                            <button 
                                className="border-2 rounded-xl cursor-pointer px-5 hover:bg-emerald-500 transition-all duration-300"
                                onClick={onClose}>Close
                            </button>
                        </header>
                        <div>
                                Здесь будут настройки
                        </div>
                    </div>
                </div>
            
        </div>
    )

}
