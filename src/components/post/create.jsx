"use client";
import { Button, Dialog } from "../rui";
import React, { useState, useContext } from 'react';
import { createPostAction } from '@/lib/actions/blog';
import { TextField } from '@mui/material';
import Editor from "../create/editor";
import { StudioWriterContext } from "@/lib/context";

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
        if (data?.article) {
            setPost({ ...post, title: data?.article?.title })
        }
    }, [data?.article])


    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPostAction(post)

        // onSubmit(post);
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
            <div className="">
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
                            sx: { fontSize: '2.45rem', lineHeight: '2.6rem', fontWeight: 900, fontFamily: 'Karnak' },
                            notched: false
                        }}
                    />
                </div>
                <div className="my-2 lg:-mx-8">
                    <Editor setBlocks={setBlocks} focus={keyPress} />
                </div>
            </div>

            <Button className="mt-10" variant="outlined" color="button" onClick={() => setOpen(true)}>Preview Json</Button>

            <Dialog open={open} sx={{ maxWidth: '600px', p: 4, minWidth: '150px', minHeight: '150px' }} onClose={() => setOpen(false)}>
                <strong> {id} </strong>

                <div className="mt-2 overflow-x-scroll">
                    <pre className="mt-4">
                        {JSON.stringify(blocks, null, 2)}
                    </pre>
                </div>
            </Dialog>
        </>
    );
};

export { CreatePost }