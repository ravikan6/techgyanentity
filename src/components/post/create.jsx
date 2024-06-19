"use client";
import CreateAuthor from "../author/create";
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
} from '@mui/material';
import Editor from "../create/editor";

const CreatePost = ({ onSubmit = () => { } }) => {
    const [post, setPost] = useState({
        slug: '',
        title: '',
        content: '',
        authorId: '', // This should be set dynamically based on logged-in user
        published: false,
        privacy: 'PUBLIC',
        tags: '',
        imageUrl: '',
        imageAlt: '',
    });

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
        console.log(post, '_______________________post by setPost!')
        await createPostAction(post)

        // onSubmit(post);
    };

    return (
        <>
            <div className="my-10">
                <Editor />
            </div>


            <Box
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
                    label="Title"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    fullWidth
                    className={'!mb-8'}
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
            </Box>

            <div className="mt-32">
                <CreateAuthor />
            </div>
        </>
    );
};

export { CreatePost }