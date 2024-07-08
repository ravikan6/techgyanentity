"use client";
import React, { useState, useContext, useEffect } from 'react';
import { getArticleContent, updatePostAction } from '@/lib/actions/blog';
import { TextField } from '@mui/material';
import Editor from "../create/editor";
import { StudioContext, StudioWriterContext } from "@/lib/context";
import { toast } from "react-toastify";
import { BetaLoader2 } from "../studio/content";

const CreatePost = ({ id }) => {
    const [post, setPost] = useState({ shortId: id, title: '', content: [], });
    const [keyPress, setKeyPress] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [postLoading, setPostLoading] = useState(true);

    const { loading, setState, state } = useContext(StudioWriterContext);
    const { data } = useContext(StudioContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    useEffect(() => {
        const handler = async () => {
            if (data?.article) {
                let dt = await getArticleContent(data?.article?.shortId);
                if (dt?.data) {
                    setPost({ ...post, ...data?.article, content: dt?.data })
                } else setPost({ ...post, ...data?.article });
            }
            setPostLoading(false);
        }
        handler();
    }, [data?.article])


    useEffect(() => {
        if ((post.title !== '' || blocks.length !== 0 || !loading)) {
            if (post.title === data?.article?.title && JSON.stringify(blocks) === JSON.stringify(data?.article?.content)) {
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
            let data = {
                title: post.title,
                content: blocks,
                shortId: post.shortId
            }
            const dt = await updatePostAction(data);
            if (dt?.status === 200 && dt?.data) {
                setPost({ ...post, ...dt?.data });
                toast.success('Post updated successfully');
            }
        } catch {
            toast.error('Something went wrong');
        }

    };

    const handleCancle = () => {
        setPost({ ...post, title: data?.article?.title, content: data?.article?.content });
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

    return (
        <>
            {postLoading ? (
                <BetaLoader2 />
            ) : (
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
                            InputProps={{
                                disableUnderline: true,
                                sx: {
                                    fontSize: '2.6rem',
                                    lineHeight: '2.7rem',
                                    fontWeight: 900,
                                    fontFamily: 'rb-karnak',
                                    color: (theme) => theme.palette.text.primary,
                                },
                            }}
                            fullWidth
                        />
                    </div>
                    <div className="my-2 lg:-mx-8">
                        <Editor content={post.content} loading={postLoading} setBlocks={setBlocks} focus={keyPress} />
                    </div>
                </div>
            )}
        </>
    );
};

export { CreatePost }