"use client";
import React, { useEffect, useMemo } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";
import '@/styles/editor.css';

const Editor = ({ setBlocks, focus, content }) => {

    const editor = useMemo(() => {
        if (content === undefined || content === null) {
            return undefined;
        }
        if (content && typeof content === "object" && content.length > 0) {
            return BlockNoteEditor.create({ initialContent: content });
        }
        return BlockNoteEditor.create();
    }, [content]);

    useEffect(() => {
        if (editor !== undefined) {
            if (focus) {
                editor.focus();
            }
        }
    }, [focus, editor]);


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
