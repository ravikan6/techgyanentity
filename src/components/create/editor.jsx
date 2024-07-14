"use client";
import React, { useEffect, useMemo, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";
import '@/styles/editor.css';

const Editor = ({ setBlocks, focus, content }) => {

    const editor = useMemo(() => {
        if (!content) {
            return undefined;
        }
        if (content && typeof initialContent === "object" && initialContent.length > 0) {
            return BlockNoteEditor.create({ initialContent });
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
