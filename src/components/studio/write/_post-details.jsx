"use client";
import { Button, MenuItem, Switch, TextField } from "@/components/rui";
import { getArticledetails } from "@/lib/actions/blog";
import { StudioContext } from "@/lib/context";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { InputHeader } from "../author/_edit-funcs";
import { getCldImageUrl } from "next-cloudinary";
import { imgUrl } from "@/lib/helpers";
import { Box, Chip, InputAdornment, Select } from '@mui/material';
import Image from 'next/image';

const PostDetailsEditor = () => {
    const [state, setState] = useState({ canSave: false, canUndo: false });
    const [post, setPost] = useState({})
    const [npst, setNpst] = useState({})

    const { data, setData, loading, setLoading } = useContext(StudioContext)

    useEffect(() => {
        !loading && setLoading(true)
        const dtHandler = async () => {
            let dt = await getArticledetails(data?.article?.shortId);
            if (dt?.data) { setPost(dt.data); setLoading(false) } else { toast.warn('Something went worng while fetching data from servers, Please reload the page to retry.') }
        }
        if (data?.article?.shortId) dtHandler();
    }, [data?.article])

    let ref = useRef(null);

    const undoHandler = () => { }
    const publishHandler = () => { }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 110) {
                ref.current.classList.add('fixed', 'top-[54px]', 'right-0', 'z-20', 'bg-lightHead', 'dark:bg-darkHead', 'shadow-md', 'px-4', 'py-2', 'rounded-b-lg', '!mt-0', '!mb-0');
            } else {
                ref.current.classList.remove('fixed', 'top-[54px]', 'right-0', 'z-20', 'bg-lightHead', 'dark:bg-darkHead', 'shadow-md', 'px-4', 'py-2', 'rounded-b-lg', '!mt-0', '!mb-0');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleUpdateNewPost = (e, key) => {
        if (e?.target?.value && key)
            setNpst({ ...npst, [key]: e?.target?.value })
    }

    let image;

    if (post?.image?.url) {
        image = getCldImageUrl({
            width: 320,
            height: 160,
            src: post?.image?.url,
        });
    }

    return (
        <>
            <div className="relative">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Post Details</h2>
                    <div ref={ref} className="flex justify-between mb-1 mt-1 sm:justify-end w-full sm:w-auto transition-all duration-500 items-center space-x-2 md:space-x-3">
                        <Button disabled={state?.canUndo ? loading : true} onClick={undoHandler} variant="text" sx={{ px: { xs: 3, sm: 1.3, lg: 3 } }} className="font-bold -tracking-tighter cheltenham !bg-light dark:!bg-dark" color="primary" size="small" > Undo Changes </Button>
                        <Button disabled={state?.canSave ? loading : true} onClick={() => publishHandler()} variant="outlined" sx={{ px: { xs: 4, sm: 2, lg: 4 } }} className="font-bold -tracking-tighter cheltenham !bg-light dark:!bg-dark" color="button" size="small" > Save </Button>
                    </div>
                </div>

                <div className="flex items-start mt-5 justify-between">
                    <div className=" w-8/12">
                        <div className="flex flex-col space-y-8 mb-5">
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Title" desc={'The title of your post. Make it catchy and engaging to attract readers.'} tip={'The title of your post is the first thing that your readers will see.'} />
                                <TextField disabled={loading} size="small" required helperText={''} counter inputProps={{ maxLength: 150 }} className="" label="Title" value={npst?.title || post?.title || ''} onChange={(e) => handleUpdateNewPost(e, 'title')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Slug" desc={'The slug is the URL of your post. It is automatically generated based on the title of your post, but you can customize it.'} tip={'The slug is the URL of your post.'} />
                                <TextField disabled={loading} size="small" required helperText={''} counter InputProps={{ maxLength: 250 }} endAdornment={<InputAdornment position="end"><div className="mx-1 font-semibold text-gray-600 dark:text-gray-400 stymie">{post?.shortId}</div></InputAdornment>} className="" label="Slug" value={npst?.slug || post?.slug || ''} onChange={(e) => handleUpdateNewPost(e, 'slug')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Description" desc={'The description provides a summary of your post and helps readers understand what it is about. Make it engaging, informative, and concise.'} tip={'The description of your post is a brief summary of what your post is about.'} />
                                <TextField disabled={loading} size="large" helperText={''} multiline counter minRows={4} inputProps={{ maxLength: 5000 }} className="" value={npst?.description || post?.description || ''} onChange={(e) => handleUpdateNewPost(e, 'description')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Tags" desc={'Tags help readers find your post. Add tags that are relevant to the content of your post.'} tip={'Tags help readers find your post.'} />
                                <TagInput tags={npst?.tags || post?.tags || []} setTags={(tags) => setNpst({ ...npst, tags })} />
                            </div>
                        </div>
                    </div>
                    <div className="w-3/12">
                        <div className="flex flex-col space-y-8">
                            <div className="flex flex-col space-y-2">
                                <Image width={320} height={160} src={imgUrl(image)} alt={post?.image?.alt} className="w-full object-cover rounded-lg" />
                                <div className="flex flex-col space-y-3">
                                    <InputHeader label="" desc={'The image is the visual representation of your post. Choose an image that is engaging and relevant to your post.'} tip={'The image is the visual representation of your post.'} />
                                    {/* <TextField readOnly disabled={loading} size="small" required helperText={''} className="" label="Image URL" value={npst?.image?.url || post?.image?.url || ''} onChange={(e) => handleUpdateNewPost(e, 'image')} /> */}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <InputHeader label={'Privacy'} desc={'Choose the privacy settings for your post. You can make your post public, private, or password-protected.'} tip={'Choose the privacy settings for your post.'} />
                                <Select size="small" value={npst?.privacy || post?.privacy || 'PUBLIC'} label="" onChange={(e) => handleUpdateNewPost(e, 'privacy')} disabled={loading}>
                                    <MenuItem value="PUBLIC">Public</MenuItem>
                                    <MenuItem value="PRIVATE">Private</MenuItem>
                                    <MenuItem value="UNLISTED">Unlisted</MenuItem>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Published" desc={'Choose whether you want to publish your post immediately or schedule it for a later date.'} tip={'Choose whether you want to publish your post immediately or schedule it for a later date.'} />
                                <Switch label="Published" checked={(npst?.published === undefined || npst?.published === null) ? ((npst?.post === undefined || post?.published === null) ? false : post?.published) : npst?.published} onChange={(e) => handleUpdateNewPost(e, 'published')} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    return (
        <Box className={`${(tags && tags?.length > 0) ? 'p-2' : 'p-0'} border rounded-2xl dark:border-white/40 border-black/40 focus-within:dark:border-white focus-within:border-black`}>
            <Box display="flex" flexWrap="wrap">
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        className="!m-1"
                    />
                ))}
                <TextField
                    size="small"
                    placeholder="tag"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="!w-auto !h-[32px] !mx-1"
                    variant="standard"
                    margin="dense"
                    InputProps={{
                        disableUnderline: true,
                    }}
                />
            </Box>
        </Box>
    );
};



export default PostDetailsEditor;