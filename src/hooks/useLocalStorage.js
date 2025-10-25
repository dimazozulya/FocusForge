import { useState, useEffect } from "react";

export default function useLocalStorage ( key, initialValue ) {
    const [ value, setValue ] = useState (() => {
        const stored = localStorage.getItem(key);
        return stored ?? initialValue;
    });

    useEffect (() => {
        localStorage.setItem (key, value);
    }, [ key, value ]);

    return [ value, setValue ];
}