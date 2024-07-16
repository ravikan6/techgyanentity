"use client";
import { Button, MenuItem, Switch, TextField } from "@/components/rui";
import { deletePostAction, getArticledetails, updatePostDetailsAction } from "@/lib/actions/blog";
import { StudioContext } from "@/lib/context";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { InputHeader } from "../author/_edit-funcs";
import { getCldImageUrl } from "next-cloudinary";
import { getCImageUrl, imgUrl } from "@/lib/helpers";
import { Box, Chip, InputAdornment, Select } from '@mui/material';
import { default as NextImage } from 'next/image';
import { PostDetailsActionMenu, PostDetailsImageMenu } from "@/components/Buttons";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import confirm from "@/lib/confirm";

const PostDetailsEditor = () => {
    const [state, setState] = useState({ canSave: false, canUndo: false });
    const [post, setPost] = useState({})
    const [npst, setNpst] = useState({})

    const router = useRouter();

    const { data, setData, loading, setLoading } = useContext(StudioContext)

    useEffect(() => {
        const dtHandler = async () => {
            !loading && setLoading(true)
            let dt = await getArticledetails(data?.article?.shortId);
            if (dt?.data) {
                setPost(dt.data)
                setNpst({ title: dt.data?.title, slug: dt.data?.slug, description: dt.data?.description, tags: dt.data?.tags, image: dt.data?.image, privacy: dt.data?.privacy, published: dt.data?.published })
            } else { toast.warn('Something went worng while fetching data from servers, Please reload the page to retry.') }
        }
        if (data?.article?.shortId) dtHandler().finally(() => setLoading(false));
    }, [data?.article?.shortId])

    let ref = useRef(null);

    const undoHandler = () => {
        setNpst({ title: post?.title, slug: post?.slug, description: post?.description, tags: post?.tags, image: post?.image, privacy: post?.privacy, published: post?.published })
        setState({ ...state, canUndo: false, canSave: false })
    }

    const publishHandler = async () => {
        setLoading(true)
        try {
            const npstData = Object.assign({}, npst);
            let file = new FormData();
            if (npst?.image && npst?.image?.provider === 'file') {
                file.append('image', npst?.image?.url)
                npstData.image.url = post?.image?.url;
            }
            let res = await updatePostDetailsAction({ id: data?.article?.shortId, data: npstData, file: file })
            if (res?.status === 200 && res.data) {
                let img;
                if (res.data?.image?.provider === 'cloudinary') {
                    img = await getCImageUrl(res.data?.image?.url, { width: 640, height: 360, crop: 'fill', quality: 'auto' });
                }
                setPost({ ...post, ...res.data })
                setState({ ...state, canUndo: false, canSave: false })
                setData({ ...data, article: { ...data?.article, ...res.data, image: img } })
                toast.success('Post details saved successfully.')
            }
            res?.errors.map((e) => toast.error(e.message))
        } catch (e) {
            toast.error('Something went wrong while saving post details, Please try again.')
        } finally { setLoading(false) }
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
        if (key) {
            const isHTMLContent = /<[a-z][\s\S]*>/i.test(e?.target?.value);
            if (!isHTMLContent) {
                if (c) {
                    setNpst({ ...npst, [key]: e?.target?.checked });
                } else if (key.includes('.')) {
                    let [k1, k2] = key.split('.');
                    setNpst({ ...npst, [k1]: { ...npst[k1], [k2]: e?.target?.value } });
                } else {
                    setNpst({ ...npst, [key]: e?.target?.value });
                }
            }
        }
    }

    const handleImageData = (dt) => {
        setNpst({ ...npst, image: { ...npst?.image, ...dt } });
    }

    useEffect(() => {
        if (JSON.stringify(npst) !== JSON.stringify({ title: post?.title, slug: post?.slug, description: post?.description, tags: post?.tags, image: post?.image, privacy: post?.privacy, published: post?.published })) {
            setState({ ...state, canSave: true, canUndo: true })
        } else {
            setState({ ...state, canSave: false, canUndo: false })
        }
    }, [npst])

    const onDelete = async () => {
        try {
            if (await confirm('Are you sure you want to delete this post?')) {
                try {
                    setLoading(true)
                    let res = await deletePostAction(data?.article?.shortId)
                    if (res?.status === 200 && res.data) {
                        toast.success('Post deleted successfully.')
                        router.replace(`/${process.env.NEXT_PUBLIC_STUDIO_PATH}/content`)
                    } else {
                        throw new Error('Something went wrong while deleting post, Please try again.')
                    }
                } catch (e) {
                    toast.error(e.message)
                } finally {
                    setLoading(false)
                }
            }

        } catch (e) {
            console.error('Error navigating:', e);
        }
    }

    const list = [
        { label: 'Delete', icon: RiDeleteBin5Line, onClick: onDelete },
    ]

    return (
        <>
            <div className="relative">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Post Details</h2>
                    <div ref={ref} className="flex justify-between mb-1 mt-1 sm:justify-end w-full sm:w-auto transition-all duration-500 items-center space-x-2 md:space-x-3">
                        <Button disabled={state?.canUndo ? loading : true} onClick={undoHandler} variant="text" sx={{ px: { xs: 3, sm: 1.3, lg: 3 } }} className="font-bold -tracking-tighter cheltenham !bg-light dark:!bg-dark" color="primary" size="small" > Undo Changes </Button>
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <Button disabled={state?.canSave ? loading : true} onClick={() => publishHandler()} variant="outlined" sx={{ px: { xs: 4, sm: 2, lg: 4 } }} className="font-bold -tracking-tighter cheltenham !bg-light dark:!bg-dark" color="button" size="small" > Save </Button>
                            <PostDetailsActionMenu disabled={loading} list={list} />
                        </div>
                    </div>
                </div>

                <div className="flex items-start mt-5 justify-between flex-wrap">
                    <div className="w-full md:w-8/12 min-w-[400px]">
                        <div className="flex flex-col space-y-8 mb-5">
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Title" desc={'The title of your post. Make it catchy and engaging to attract readers.'} tip={'The title of your post is the first thing that your readers will see.'} />
                                <TextField disabled={loading} size="small" required helperText={''} counter inputProps={{ maxLength: 150 }} label="Title" value={npst?.title || ''} onChange={(e) => handleUpdateNewPost(e, 'title')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Slug" desc={'The slug is the URL of your post. It is automatically generated based on the title of your post, but you can customize it.'} tip={'The slug is the URL of your post.'} />
                                <TextField disabled={loading} size="small" helperText={''} counter InputProps={{ maxLength: 250, endAdornment: <InputAdornment position="end"><div className="mx-1 text-gray-600 dark:text-gray-400 stymie">-{post?.shortId}</div></InputAdornment> }} label="Slug" value={npst?.slug || ''} onChange={(e) => handleUpdateNewPost(e, 'slug')} />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Description" desc={'The description provides a summary of your post and helps readers understand what it is about. Make it engaging, informative, and concise.'} tip={'The description of your post is a brief summary of what your post is about.'} />
                                <TextField disabled={loading} size="large" helperText={''} multiline counter minRows={4} inputProps={{ maxLength: 5000 }} value={npst?.description || ''} onChange={(e) => handleUpdateNewPost(e, 'description')} placeholder="Add brief summary of what your post is about" />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <InputHeader label="Tags" desc={'Tags help readers find your post. Add tags that are relevant to the content of your post.'} tip={'Tags help readers find your post.'} />
                                <TagInput tags={npst?.tags || []} setTags={(tags) => setNpst({ ...npst, tags })} />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-3/12 min-w-[300px]">
                        <div className="flex flex-col space-y-8">

                            <FtImage img={npst?.image} handleImageData={handleImageData} handleUpdateNewPost={handleUpdateNewPost} />

                            <div className="flex flex-col space-y-3">
                                <InputHeader label={'Privacy'} desc={'Choose the privacy settings for your post. You can make your post public, private, or unlisted.'} tip={'Choose the privacy settings for your post.'} />
                                <Select size="small" className="!rounded-full" value={npst?.privacy || 'PUBLIC'} label="" onChange={(e) => handleUpdateNewPost(e, 'privacy')} disabled={loading}>
                                    <MenuItem value="PUBLIC">Public</MenuItem>
                                    <MenuItem value="PRIVATE">Private</MenuItem>
                                    <MenuItem value="UNLISTED">Unlisted</MenuItem>
                                </Select>
                            </div>

                            {(npst?.published === false || npst?.published === false) ? <>
                                <Button fullWidth disabled={loading} variant="outlined" color="button" className="dark:text-black" onClick={() => { handleUpdateNewPost({ target: { value: true } }, 'doPublish'), publishHandler() }}>
                                    Publish
                                </Button>
                            </> : null}

                            {/* <div className="flex flex-col space-y-3">
                                <InputHeader label="Published" desc={'Choose whether you want to publish your post immediately or schedule it for a later date.'} tip={'Choose whether you want to publish your post immediately or schedule it for a later date.'} />
                                <Switch label="Published" checked={(npst?.published === undefined || npst?.published === null) ? ((post?.published === undefined || post?.published === null) ? false : !!post?.published) : !!npst?.published} onChange={(e) => handleUpdateNewPost(e, 'published', true)} />
                            </div> */}

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
            let value = inputValue?.trim()?.replaceAll(' ', '')
            setTags([...tags, value]);
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

    const handleOnChange = (e) => {
        let value = e.target?.value;
        value = value?.replaceAll(' ', '')
        if (value && value.includes(',')) {
            let arr = value.split(',')
            setTags([...tags, ...arr.filter((a) => { if (a?.length >= 3) { return a } })])
            setInputValue('')
        } else setInputValue(e.target.value)
    }

    return (
        <Box onClick={handleFocus} className={`${(tags && tags?.length > 0) ? 'p-2 rounded-2xl' : 'p-0 rounded-full'} border dark:border-white/30 border-black/30 focus-within:dark:border-white focus-within:border-black`}>
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
                    onChange={(e) => handleOnChange(e)}
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

const FtImage = ({ img, handleImageData, handleUpdateNewPost }) => {
    const [error, setError] = useState({ error: false, message: null });
    const [image, setImage] = useState({});
    const { data, setData, loading, setLoading } = useContext(StudioContext)
    const [imageUrl, setImageUrl] = useState(null);

    useMemo(() => {
        if (img?.url) {
            if (img?.provider === 'cloudinary') {
                setImageUrl(getCldImageUrl({
                    width: 320,
                    height: 160,
                    src: img?.url,
                }));
            } else if ((img?.provider === 'file') && (typeof img?.url === 'object')) {
                setImageUrl(URL.createObjectURL(img?.url));
            }
        }
    }, [img])

    const handleFeaturedImageUpload = () => {
        const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
        const MIN_WIDTH = 600;
        const MIN_HEIGHT = Math.round((MIN_WIDTH / 16) * 9);

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg, image/gif';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const image = new Image();
                    image.src = e.target.result;
                    image.onload = () => {
                        const { width, height } = image;
                        const fileSize = file.size;
                        const fileType = file.type;

                        // Check file size
                        if (fileSize > 6 * 1024 * 1024) {
                            setError({ error: true, message: 'File size should be less than 6MB.' });
                            return;
                        }

                        // Check file type
                        if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
                            setError({ error: true, message: 'Invalid file type. Please upload a PNG, JPEG, or GIF file.' });
                            return;
                        }

                        // Check dimensions
                        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                            setError({ error: true, message: `Minimum width and height should be ${MIN_WIDTH}px * ${MIN_HEIGHT}px` });
                            return;
                        }

                        // Clear previous error message if any
                        setError({ error: false, message: null });

                        setImage({ file: file });
                    };
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    useEffect(() => {
        if (image?.file && !error.error) {
            handleImageData({ url: image?.file, provider: 'file' })
        }
    }, [image])

    return (
        <div className="flex flex-col space-y-2">
            {imageUrl ?
                <div className="relative">
                    <NextImage width={320} height={168} src={imgUrl(imageUrl)} alt={img?.alt} className="w-full object-cover rounded-lg" />
                    <div className="absolute top-2 right-2">
                        <PostDetailsImageMenu disabled={loading} onFistClick={handleFeaturedImageUpload} />
                    </div>
                </div> : <>
                    <div onClick={handleFeaturedImageUpload} className="w-full h-[168px] rounded-lg border border-dashed flex justify-center items-center border-lightHead dark:border-darkHead">
                        <div className={`${loading ? 'text-lightButton/60 dark:text-darkButton/60' : 'text-lightButton dark:text-darkButton'}`}>{loading ? 'Loading...' : 'Upload Image'}</div>
                    </div>
                    {error.error && <span className=" mt-1 text-xs text-red-700 dark:text-red-500">
                        {error?.message}
                    </span>}
                </>}
            <div className="flex flex-col space-y-3">
                <InputHeader label="" desc={'The image is the visual representation of your post. Choose an image that is engaging and relevant to your post.'} />
                {imageUrl && <TextField disabled={loading} size="small" label="Caption" value={img?.caption || ''} onChange={(e) => handleUpdateNewPost(e, 'image.caption')} helperText="Add a caption for the image." />}
            </div>
        </div >
    )
}



export default PostDetailsEditor;