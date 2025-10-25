export const LS_KEYS = {
    settings : 'ff:settings',
    volume : 'ff:volume',
    sound : 'ff:sound',
    theme: 'ff:theme',
};



export function tryParseJSON (raw) {
    try { 
        return JSON.parse(raw); 
    } catch {
        return raw;
    } 
}

export function lsGet (key, fallback = null ) {
    try {
        const raw = window.localStorage.getItem (key);
        if (raw === null) return fallback;
        return tryParseJSON (raw);
    } catch (e) {
        console.error ('lsGet error:' , e);
        return fallback;
    }
}

export function lsSet (key, value) { 
    try {
        const str = typeof value === 'string' ? value : JSON.stringify (value)
        window.localStorage.setItem (key, str);
    } catch (e) { 
        console.error ('lsSet error: ', e );
    }
}

export function lsRemove (key) { 
    try {
        window.localStorage.removeItem (key);
    } catch (e) {
        console.log ('lsRemove error : ', e);
    }
}

export function lsClearAll () {
    try {
        window.localStorage.clear ();
    } catch (e) {
        console.log ('lsClearAll error :', e );
    }
}