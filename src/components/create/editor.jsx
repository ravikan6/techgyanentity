"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import '@/styles/editor.css';
import { useState, useEffect } from "react";

const Editor = () => {
    const [theme, setTheme] = useState("light"); // ["light", "dark"]
    const editor = useCreateBlockNote();

    useEffect(() => {
        if (localStorage.getItem('theme') || localStorage.getItem('mui-mode')) {
            let getTheme = localStorage.getItem('theme');
            setTheme(getTheme);
            if (!getTheme || getTheme == null) {
                setTheme(localStorage.getItem('mui-mode'));
            };
        }
    }, []);

    if (typeof document !== 'undefined') {
        return (
            <>
                <BlockNoteView editor={editor} />
            </>
        );
    } else {
        return null;
    }
}

export default Editor;