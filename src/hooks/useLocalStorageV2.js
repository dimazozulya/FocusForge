import { useState, useEffect } from "react";

export default function useLocalStorageV2 (key, initialValue) {
    const [ value, setValue ] = useState (() => {
        try {
            const raw = localStorage.getItem (key);
            if (raw === null) return initialValue; 
            try {
                return JSON.parse (raw);
            } catch {
                return raw
            }
            
        } catch (e) {
            console.log ('useLocalStorageV2 init error:', e)
            return initialValue;
        }
    })

    useEffect (() => {
        try { 
           const toStore = 
                typeof value === 'string' ? value : JSON.stringify (value);
            localStorage.setItem (key, toStore);
           
        } catch (e) {
            console.log ('useLocalStorageV2 set error : ', e)
        }
    }, [ key, value ]);

    return [ value, setValue ]
}