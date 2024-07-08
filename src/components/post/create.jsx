"use client";
import { Button, Dialog } from "../rui";
import React, { useState, useContext, useEffect } from 'react';
import { getArticleContent, updatePostAction } from '@/lib/actions/blog';
import { TextField } from '@mui/material';
import Editor from "../create/editor";
import { StudioContext, StudioWriterContext } from "@/lib/context";
import { toast } from "react-toastify";

const CreatePost = ({ id }) => {
    const [post, setPost] = useState({
        shortId: id,
        title: '',
        content: '',
    });

    const [open, setOpen] = useState(false);
    const [keyPress, setKeyPress] = useState(false);

    const [blocks, setBlocks] = useState([]);
    const [postLoading, setPostLoading] = useState(true);

    const { loading, setState, state } = useContext(StudioWriterContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const { data } = useContext(StudioContext);

    useEffect(() => {
        const handler = async () => {
            if (data?.article) {
                setPost({ ...post, ...data?.article })
                let dt = await getArticleContent(data?.article?.shortId);
                if (dt?.content) {
                    setBlocks(dt?.content);
                }
            }
            setPostLoading(false);
        }
        handler();
    }, [data?.article])


    useEffect(() => {
        if ((post.title === '' || blocks.length === 0 || loading)) {
            setState({ ...state, save: true, runner: handleSubmit })
        } else {
            setState({ ...state, save: false, runner: null })
        }
    }, [blocks, post]);


    const handleSubmit = async () => {
        if (post.title === '' || blocks.length === 0 || loading) {
            return;
        }
        toast.promise(updatePostAction({ id: post.shortId, content: blocks, title: post.title }), {
            pending: 'Updating Post...',
            success: 'Post Updated',
            error: 'Error updating post',
        })
    };

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
                <div className='flex space-x-2 justify-center items-centerw-full my-10 dark:invert'>
                    <span className='sr-only'>Loading...</span>
                    <div className='h-6 w-6 bg-lightButton dark:bg-darkButton rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-6 w-6 bg-lightButton dark:bg-darkButton rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-6 w-6 bg-lightButton dark:bg-darkButton rounded-full animate-bounce'></div>
                </div>
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

            <Button className="!mt-52" size="small" variant="outlined" color="button" onClick={() => setOpen(true)}>
                Preview Json
            </Button>

            <Dialog open={open} sx={{ maxWidth: '600px', minWidth: '150px', minHeight: '150px' }} onClose={() => setOpen(false)}>
                <div className="p-4">
                    <strong> {id} </strong>

                    <div className="mt-2 overflow-x-scroll">
                        <pre className="mt-4">{JSON.stringify(blocks, null, 2)}</pre>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export { CreatePost }