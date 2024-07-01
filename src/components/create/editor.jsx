"use client";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
import '@/styles/editor.css';

const Editor = ({ setBlocks, focus }) => {
    const editor = useCreateBlockNote();

    if (focus)
        editor.focus();

    if (typeof document !== 'undefined') {
        return (
            <>
                <BlockNoteView editor={editor} onChange={() => {
                    setBlocks(editor.document);
                }} />
            </>
        );
    } else {
        return null;
    }
}

export default Editor;