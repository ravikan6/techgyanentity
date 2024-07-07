"use client";
import { Button, Dialog } from "../rui";
import React, { useState, useContext, useEffect } from 'react';
import { updatePostAction } from '@/lib/actions/blog';
import { TextField } from '@mui/material';
import Editor from "../create/editor";
import { StudioWriterContext } from "@/lib/context";
import { toast } from "react-toastify";

const CreatePost = ({ id }) => {
    const [post, setPost] = useState({
        slug: '',
        title: '',
        content: '',
        authorId: '',
        published: false,
        privacy: 'PUBLIC',
        tags: '',
        imageUrl: '',
        imageAlt: '',
    });
    const [open, setOpen] = useState(false);
    const [keyPress, setKeyPress] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postLoading, setPostLoading] = useState(true)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const { data } = useContext(StudioWriterContext);
    // const handleSwitchChange = (e) => {
    //     const { name, checked } = e.target;
    //     setPost((prevPost) => ({
    //         ...prevPost,
    //         [name]: checked,
    //     }));
    // };

    useEffect(() => {
        const handler = () => {
            if (data?.article) {
                setPost({ ...post, title: data?.article?.title, ...data?.article })
                if (data?.article?.content) {
                    setBlocks(data?.article?.content);
                }
            }
            setPostLoading(false);
        }
        handler();
    }, [data?.article])


    const handleSubmit = async () => {
        if (post.title === '' || post.content === '') {
            return;
        }
        toast.promise(updatePostAction({ ...post, id: id, content: blocks }), {
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

            <Button className="!mt-52" variant="outlined" color="button" onClick={() => setOpen(true)}>
                Preview Json
            </Button>

            <Button className="" variant="outlined" color="button" onClick={() => handleSubmit()}>
                Submit
            </Button>

            <Dialog open={open} sx={{ maxWidth: '600px', p: 4, minWidth: '150px', minHeight: '150px' }} onClose={() => setOpen(false)}>
                <strong> {id} </strong>

                <div className="mt-2 overflow-x-scroll">
                    <pre className="mt-4">{JSON.stringify(blocks, null, 2)}</pre>
                </div>
            </Dialog>
        </>
    );
};

export { CreatePost }