"use client";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import '@/styles/editor.css';

const Editor = () => {
    const editor = useCreateBlockNote({ enableBlockNoteExtensions: true, });

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