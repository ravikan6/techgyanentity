"use client";
import { TextField, Button } from "../rui";
import React, { useState } from 'react';
import { createPostAction } from '@/lib/actions/blog';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    InputBase,
} from '@mui/material';
import Editor from "../create/editor";

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

    const [blocks, setBlocks] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPostAction(post)

        // onSubmit(post);
    };

    return (
        <>
            <div className="">
                <div className="px-5">
                    <InputBase label="Title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        fullWidth
                        autoFocus
                    />
                </div>
                <div className="my-2">
                    <Editor setBlocks={setBlocks} />
                </div>
            </div>
            <p> {id} </p>

            <div>
                <p>Below is The Json output of the block content</p>

                <pre className="mtt-4">
                    {JSON.stringify(blocks, null, 2)}
                </pre>
            </div>

            {/* <Box
                component="form"
                onSubmit={handleSubmit}
                className="p-4 dark:bg-darkHead bg-lightHead shadow-md rounded-xl"
            >
                <TextField
                    label="Slug"
                    name="slug"
                    value={post.slug}
                    onChange={handleChange}
                    fullWidth
                    className={'!mb-8'}
                    sx={{ mb: 4 }}
                />

                <TextField
                    label="Content"
                    name="content"
                    value={post.content}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    className={'!mb-8'}
                />
                <FormControl fullWidth className={'!mb-8'}>
                    <InputLabel>Privacy</InputLabel>
                    <Select
                        name="privacy"
                        value={post.privacy}
                        onChange={handleChange}
                    >
                        <MenuItem value="PUBLIC">Public</MenuItem>
                        <MenuItem value="PRIVATE">Private</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Tags (comma separated)"
                    name="tags"
                    value={post.tags}
                    onChange={handleChange}
                    fullWidth
                    className={'!mb-8'}
                />
                <TextField
                    label="Image URL"
                    name="imageUrl"
                    value={post.imageUrl}
                    onChange={handleChange}
                    fullWidth
                    className={'!mb-8'}
                />
                <TextField
                    label="Image Alt Text"
                    name="imageAlt"
                    value={post.imageAlt}
                    onChange={handleChange}
                    fullWidth
                    className={'!mb-8'}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={post.published}
                            onChange={handleSwitchChange}
                            name="published"
                        />
                    }
                    label="Published"
                    className={'!mb-8'}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Create Post
                </Button>
            </Box> */}
        </>
    );
};

export { CreatePost }