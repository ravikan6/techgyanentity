"use client";
import { Button, MenuItem, Switch, TextField } from "@/components/rui";
import { getArticledetails, updatePostDetailsAction } from "@/lib/actions/blog";
import { StudioContext } from "@/lib/context";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { InputHeader } from "../author/_edit-funcs";
import { getCldImageUrl } from "next-cloudinary";
import { getCImageUrl, imgUrl } from "@/lib/helpers";
import { Box, Chip, InputAdornment, Select } from '@mui/material';
import Image from 'next/image';

const PostDetailsEditor = () => {
    const [state, setState] = useState({ canSave: false, canUndo: false });
    const [post, setPost] = useState({})
    const [npst, setNpst] = useState({})

    const { data, setData, loading, setLoading } = useContext(StudioContext)

    useEffect(() => {
        const dtHandler = async () => {
            !loading && setLoading(true)
            let dt = await getArticledetails(data?.article?.shortId);
            if (dt?.data) {
                setPost(dt.data)
                setNpst({ title: dt.data?.title, slug: dt.data?.slug, description: dt.data?.description, tags: dt.data?.tags, image: dt.data?.image, privacy: dt.data?.privacy, published: dt.data?.published })
                setLoading(false)
            } else { toast.warn('Something went worng while fetching data from servers, Please reload the page to retry.') }
        }
        if (data?.article?.shortId) dtHandler();
    }, [data?.article?.shortId])

    let ref = useRef(null);

    const undoHandler = () => {
        setNpst({ title: post?.title, slug: post?.slug, description: post?.description, tags: post?.tags, image: post?.image, privacy: post?.privacy, published: post?.published })
        setState({ ...state, canUndo: false, canSave: false })
    }

    const publishHandler = async () => {
        setLoading(true)
        try {
            let res = await updatePostDetailsAction({ id: data?.article?.shortId, data: npst })
            if (res?.status === 200 && res.data) {
                setPost({ ...post, ...res.data })
                setState({ ...state, canUndo: false, canSave: false })
                let img;
                if (res.data?.image?.provider === 'cloudinary') {
                    img = await getCImageUrl(res.data?.image?.url, { width: 640, height: 360, crop: 'fill', quality: 'auto' });
                }
                setData({ ...data, article: { ...data?.article, ...res.data, image: img } })
                setLoading(false)
                toast.success('Post details saved successfully.')
            } else {
                setLoading(false)
                toast.error('Something went wrong while saving post details, Please try again.')
            }
        } catch (e) {
            setLoading(false)
            toast.error('Something went wrong while saving post details, Please try again.')
        }
    }

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

    const handleUpdateNewPost = (e, key, c) => {
        if (c) setNpst({ ...npst, [key]: e?.target?.checked })
        else if (e?.target?.value && key)
            if (key.includes('.')) {
                let [k1, k2] = key.split('.');
                setNpst({ ...npst, [k1]: { ...npst[k1], [k2]: e?.target?.value } })
            } else setNpst({ ...npst, [key]: e?.target?.value })
    }

    let image;

    if (post?.image?.url) {
        image = getCldImageUrl({
            width: 320,
            height: 160,
            src: post?.image?.url,
        });
    }

    useEffect(() => {
        if (JSON.stringify(npst) !== JSON.stringify({ title: post?.title, slug: post?.slug, description: post?.description, tags: post?.tags, image: post?.image, privacy: post?.privacy, published: post?.published })) {
            setState({ ...state, canSave: true, canUndo: true })
        } else {
            setState({ ...state, canSave: false, canUndo: false })
        }
    }, [npst])

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
                                <TextField disabled={loading} size="small" required helperText={''} counter inputProps={{ maxLength: 150 }} label="Title" value={npst?.title || post?.title || ''} onChange={(e) => handleUpdateNewPost(e, 'title')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Slug" desc={'The slug is the URL of your post. It is automatically generated based on the title of your post, but you can customize it.'} tip={'The slug is the URL of your post.'} />
                                <TextField disabled={loading} size="small" helperText={''} counter InputProps={{ maxLength: 250, endAdornment: <InputAdornment position="end"><div className="mx-1 text-gray-600 dark:text-gray-400 stymie">-{post?.shortId}</div></InputAdornment> }} label="Slug" value={npst?.slug || post?.slug || ''} onChange={(e) => handleUpdateNewPost(e, 'slug')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Description" desc={'The description provides a summary of your post and helps readers understand what it is about. Make it engaging, informative, and concise.'} tip={'The description of your post is a brief summary of what your post is about.'} />
                                <TextField disabled={loading} size="large" helperText={''} multiline counter minRows={4} inputProps={{ maxLength: 5000 }} value={npst?.description || post?.description || ''} onChange={(e) => handleUpdateNewPost(e, 'description')} />
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
                                {image ? <Image width={320} height={168} src={imgUrl(image)} alt={post?.image?.alt} className="w-full object-cover rounded-lg" /> : <div className="w-[320px] h-[168px] rounded-lg border border-dashed flex justify-center items-center">
                                    <div className="text-gray-400 dark:text-gray-600">No Image</div>
                                </div>}
                                <div className="flex flex-col space-y-3">
                                    <InputHeader label="" desc={'The image is the visual representation of your post. Choose an image that is engaging and relevant to your post.'} />
                                    <TextField disabled={loading} size="small" required label="Caption" value={npst?.image?.caption || post?.image?.caption || ''} onChange={(e) => handleUpdateNewPost(e, 'image.caption')} helperText="Add a caption for the image." />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <InputHeader label={'Privacy'} desc={'Choose the privacy settings for your post. You can make your post public, private, or password-protected.'} tip={'Choose the privacy settings for your post.'} />
                                <Select size="small" className="!rounded-full" value={npst?.privacy || post?.privacy || 'PUBLIC'} label="" onChange={(e) => handleUpdateNewPost(e, 'privacy')} disabled={loading}>
                                    <MenuItem value="PUBLIC">Public</MenuItem>
                                    <MenuItem value="PRIVATE">Private</MenuItem>
                                    <MenuItem value="UNLISTED">Unlisted</MenuItem>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Published" desc={'Choose whether you want to publish your post immediately or schedule it for a later date.'} tip={'Choose whether you want to publish your post immediately or schedule it for a later date.'} />
                                <Switch label="Published" checked={(npst?.published === undefined || npst?.published === null) ? ((post?.published === undefined || post?.published === null) ? false : !!post?.published) : !!npst?.published} onChange={(e) => handleUpdateNewPost(e, 'published', true)} />
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
    const [focus, setFocus] = useState(false);
    const backspaceCountRef = useRef(0);
    const timeoutRef = useRef(null);
    const [width, setWidth] = useState(0);

    const handleAddTag = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && inputValue.trim() === '' && tags.length > 0) {
            backspaceCountRef.current += 1;

            if (backspaceCountRef.current === 2) {
                setTags(tags.slice(0, tags.length - 1));
                backspaceCountRef.current = 0;
            }

            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                backspaceCountRef.current = 0;
            }, 300);
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const handleFocus = () => {
        if (tags && tags?.length <= 0) {
            setFocus(true)
        } else setFocus(false)
    }

    useEffect(() => {
        if ((inputValue.length * 8 + 40) < 100) setWidth(100)
        else setWidth(inputValue.length * 8 + 40)
    }, [inputValue])

    return (
        <Box onClick={handleFocus} className={`${(tags && tags?.length > 0) ? 'p-2 rounded-2xl' : 'p-0 rounded-full'} border dark:border-white/40 border-black/40 focus-within:dark:border-white focus-within:border-black`}>
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
                    placeholder="Add a tag..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { handleAddTag(e), handleKeyDown(e) }}
                    className="!h-[32px] !mx-1"
                    sx={{ width: `${width}px`, maxWidth: 'fit-content', mx: '6px', my: '4px !important', '& .MuiInputBase-root': { '& .MuiInputBase-input': { padding: '0px 10px !important', height: '32px !important' } } }}
                    variant="standard"
                    margin="dense"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    focus={focus}
                />
            </Box>
        </Box>
    );
};



export default PostDetailsEditor;