"use client";

import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState('undefined');

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches) {
            setMatches(true);
        } else setMatches(false);

        const listener = (event) => setMatches(event.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

export default useMediaQuery;