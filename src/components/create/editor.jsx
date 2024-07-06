"use client";
import React, { useEffect, useMemo, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";
import '@/styles/editor.css';

const Editor = ({ setBlocks, focus, content, loading }) => {
    const [initialContent, setInitialContent] = useState('loading');

    const editor = useMemo(() => {
        if (initialContent === "loading") {
            return undefined;
        }
        return BlockNoteEditor.create({ initialContent });
    }, [initialContent]);

    useEffect(() => {
        if (!loading) {
            setInitialContent(content);
        }
    }, [content, loading]);

    useEffect(() => {
        if (editor !== undefined && !loading) {
            if (focus) {
                editor.focus();
            }
        }
    }, [loading, focus, editor]);


    if (editor === undefined) {
        return "Loading content...";
    }

    return (
        <>
            <BlockNoteView editor={editor} onChange={() => {
                setBlocks(editor.document);
            }} />
        </>
    );
}

export default Editor;
