"use client";
import React, { useState, useContext, useEffect } from 'react';
import { updatePostAction } from '@/lib/actions/blog';
import { TextField } from '@mui/material';
import Editor from "../create/editor";
import { StudioContext, StudioWriterContext } from "@/lib/context";
import { toast } from "react-toastify";

const CreatePost = (props) => {
    const [post, setPost] = useState({ ...props.data });
    const [keyPress, setKeyPress] = useState(false);
    const [blocks, setBlocks] = useState(JSON.parse(props.data.content) || []);

    const { loading, setState, state } = useContext(StudioWriterContext);
    const { data, setData } = useContext(StudioContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    useEffect(() => {
        if ((post.title !== '' || blocks.length !== 0 || !loading)) {
            if ((post.title === data?.article?.title) && (JSON.stringify(blocks) === JSON.stringify(post?.content))) {
                setState({ ...state, save: false, cancle: false })
            } else {
                setState({ ...state, save: true, cancle: true, runner: handleSubmit, onCancle: handleCancle })
            }
        } else {
            setState({ ...state, save: false, runner: null, cancle: false })
        }
    }, [blocks, post]);


    const handleSubmit = async () => {
        if (post.title === '' || blocks.length === 0 || loading) {
            return;
        }
        try {
            const dt = await updatePostAction({ title: post.title, key: props.data.key, content: blocks });
            if (dt?.status === 200 && dt?.data) {
                setPost({ ...post, ...dt?.data });
                setData({ ...data, article: { ...data?.article, title: dt.data?.title } });
                toast.success('Post updated successfully');
            }
        } catch {
            toast.error('Something went wrong');
        }

    };

    const handleCancle = () => {
        setPost({ ...post, title: props?.data?.title });
        setBlocks(JSON.parse(props?.data?.content) || []);
        setState({ ...state, save: false, cancle: false });
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
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
                    value={post.title}
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
                <Editor content={post.content} setBlocks={setBlocks} focus={keyPress} />
            </div>
        </div>
    </>);
};

export { CreatePost }