"use client";
import React, { useState, useContext, useEffect } from 'react';
import { TextField } from '@mui/material';
import Editor from "../create/editor";
import { StudioContext, StudioWriterContext } from "@/lib/context";
import { toast } from "react-toastify";
import { updateStoryContent } from '@/lib/actions/setters/story';

function jsonToObject(json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return [];
    }
}

function objectToJson(obj) {
    try {
        return JSON.stringify(obj);
    } catch (error) {
        return obj;
    }
}

const Create = (props) => {
    const [story, setStory] = useState({ ...props.data });
    const [keyPress, setKeyPress] = useState(false);
    const [blocks, setBlocks] = useState(props.data?.content || []);

    const { loading, setState, state } = useContext(StudioWriterContext);
    const { data, setData } = useContext(StudioContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStory((prevStory) => ({
            ...prevStory,
            [name]: value,
        }));
    };

    useEffect(() => {
        if ((story.title !== '' || blocks.length !== 0 || !loading)) {
            if ((story.title === data?.article?.title) && (JSON.stringify(blocks) === JSON.stringify(story?.content))) {
                setState({ ...state, save: false, cancle: false })
            } else {
                setState({ ...state, save: true, cancle: true, runner: handleSubmit, onCancle: handleCancle })
            }
        } else {
            setState({ ...state, save: false, runner: null, cancle: false })
        }
    }, [blocks, story]);


    const handleSubmit = async () => {
        if (story.title === '' || blocks.length === 0 || loading) {
            return;
        }
        try {
            const dt = await updateStoryContent({ title: story.title, key: props.data.key, content: objectToJson(blocks) });
            if (dt?.success && dt?.data) {
                setStory({ ...story, ...dt?.data, content: jsonToObject(dt?.data?.content) });
                setData({ ...data, article: { ...data?.article, title: dt.data?.title } });
                toast.success('Story updated successfully');
            }
        } catch {
            toast.error('Something went wrong');
        }

    };

    const handleCancle = () => {
        setStory({ ...story, title: props?.data?.title });
        setBlocks(props?.data?.content);
        setState({ ...state, save: false, cancle: false });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation(); button
            setKeyPress(true);
        } else {
            setKeyPress(false);
        }
    }

    return (<>
        <div>
            <div className="mx-5">
                <TextField
                    name="title"
                    value={story.title}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    placeholder="Title"
                    multiline
                    variant="standard"
                    fullWidth
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            sx: {
                                fontSize: '2.6rem',
                                lineHeight: '2.7rem',
                                fontWeight: 900,
                                fontFamily: 'rb-karnak',
                                color: (theme) => theme.palette.text.primary,
                            },
                        }
                    }}
                />
            </div>
            <div className="my-2 lg:-mx-8">
                <Editor content={story.content} setBlocks={setBlocks} focus={keyPress} />
            </div>
        </div>
    </>);
};

export { Create }