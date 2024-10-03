'use client';
import { Button, TextField, Tooltip, IconButton } from "@/components/rui";
import { StudioContext } from "@/lib/context";
import { InputAdornment, Avatar, Grid2 } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BsPatchQuestion } from "react-icons/bs";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { RiDraggable } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { default as NextImage } from 'next/image';
import { updateAuthorAction, updateAuthorImagesAction } from "@/lib/actions/author";
import { SetAuthorStudioCookie } from "@/lib/actions/studio";

const ChannelEditContext = React.createContext();

const ChannelEditLayoutFunc = (props) => {
    return (
        <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center">
            <h3 className="text-2xl stymie font-semibold">
                Coming soon...
            </h3>
        </div>
    );
}

const ChannelBrandFunc = ({ data }) => {
    const [bData, setBData] = useState({ ...data, } || {});
    const context = useContext(StudioContext);
    const { state, setState } = useContext(ChannelEditContext);
    const [files, setFiles] = useState({ logo: null, banner: null, rml: false, rmb: false });
    const [error, setError] = useState({ error: false, message: { logo: null, banner: null } });

    let authorId = context?.data?.data?.key;

    useMemo(() => {
        if (JSON.stringify(bData) !== JSON.stringify(data)) {
            setBData(data);
        }
    }, [data]);

    useMemo(async () => {
        if (state?.run) {
            try {
                let formData = new FormData();
                formData.append('logo', files?.logo);
                formData.append('banner', files?.banner);
                let actions = {
                    image: files?.rml ? 'DELETE' : bData?.media?.image ? 'UPDATE' : 'CREATE',
                    banner: files?.rmb ? 'DELETE' : bData?.media?.banner ? 'UPDATE' : 'CREATE'
                }
                let dt = await updateAuthorImagesAction(bData, formData, actions);

                if (dt?.data) {
                    let image = dt?.data?.image, banner = dt?.data?.banner;
                    setBData({ ...bData, logo: image?.url, banner: banner?.url, media: { image: image, banner: banner } });
                    context?.setData({ ...context?.data, data: { ...context?.data?.data, image: image, logo: image?.url } });
                    context.loading && context.setLoading(false);
                    setState({ ...state, data: { isRunnable: false }, run: false });
                    toast.success('Your have successfully updated your profile branding.');
                }
                dt?.errors && dt?.errors.map((e) => {
                    toast.error(e.message);
                });
            } catch (e) {
                toast.error(e.message)
                setState({ data: { ...state, isRunnable: true }, run: false });
                context.loading && context.setLoading(false);
            } finally {
                setFiles({ ...files, rml: false, rmb: false });
                context.loading && context.setLoading(false);
            }
        }
    }, [state?.run]);

    useEffect(() => {
        if (state?.cancle) {
            setTimeout(() => {
                setState({ ...state, data: { isRunnable: false }, cancle: false });
                setBData(data);
                setFiles({ logo: null, banner: null, rml: false, rmb: false });
                setError({ error: false, message: { logo: null, banner: null } });
                toast.info('Your changes have been discarded. Any unsaved changes have been reverted.');
            }, 100);
        }
    }, [state?.cancle]);

    useMemo(() => {
        if (files?.logo || files?.banner || files?.rml || files?.rmb) {
            if (error?.error || error?.message?.logo || error?.message?.banner) {
                setState({ ...state, data: { isRunnable: false, aCancle: true } });
            } else {
                setState({ ...state, data: { isRunnable: true, } });
            }
        } else {

            setState({ ...state, data: { isRunnable: false, aCancle: false } });
        }
    }, [files]);

    const handleLogoUpload = () => {
        const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
        const MIN_WIDTH = 98;
        const MIN_HEIGHT = 98;

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
                        setFiles({ ...files, logo: file });
                        if (fileSize > 4 * 1024 * 1024) {
                            setError({ error: true, message: { logo: 'File size should be less than 4MB.' } });
                            return;
                        }
                        if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
                            setError({ error: true, message: { logo: 'Invalid file type. Please upload a PNG, JPEG, or GIF file.' } });
                            return;
                        }
                        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                            setError({ error: true, message: { logo: 'Minimum width and height should be 98px' } });
                            return;
                        }
                        setError({ error: error?.message?.banner, message: { logo: null } });
                        setBData({ ...bData, logo: URL.createObjectURL(file) });
                    };
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleBannerUpload = () => {
        const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
        const MIN_WIDTH = 100 // 2048;
        const MIN_HEIGHT = 100 // 1152;

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
                        setFiles({ ...files, banner: file });
                        if (fileSize > 6 * 1024 * 1024) {
                            setError({ error: true, message: { banner: 'File size should be less than 6MB.' } });
                            setState({ ...state, data: { isRunnable: false } });
                            return;
                        }
                        if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
                            setError({ error: true, message: { banner: 'Invalid file type. Please upload a PNG, JPEG, or GIF file.' } });
                            return;
                        }
                        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                            setError({ error: true, message: { banner: `Minimum width and height should be ${MIN_WIDTH}px * ${MIN_HEIGHT}px` } });
                            return;
                        }
                        setError({ error: error?.message?.logo, message: { banner: null } });
                        setBData({ ...bData, banner: URL.createObjectURL(file) });
                    };
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleLogoRemove = () => {
        setBData({ ...bData, logo: null });
        setFiles({ ...files, logo: null, rml: true });
    };

    const handleBannerRemove = () => {
        setBData({ ...bData, banner: null });
        setFiles({ ...files, banner: null, rmb: true });
    };

    useMemo(() => {
        if (authorId != data?.key) {
            !context?.loading && context?.setLoading(true);
            context?.data?.data?.key && setState({ ...state, data: { isRunnable: false } });
        } else {
            context?.loading && context.setLoading(false);
        }
    }, [context?.loading, data?.key, authorId]);

    return (
        <>
            <div className="mt-10 max-w-[900px]">
                <div className="flex flex-col space-y-8 mb-5">
                    <div className="flex flex-col space-y-3">
                        <InputHeader label={'Profile Picture'} desc={'Upload a profile picture that represents you as an author. This image will be displayed on your author page and in search results.'} tip={'Recommended size: 800x800 pixels'} />
                        <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start items-center lg:space-x-8 space-y-4 lg:space-y-0">
                            <div className="w-60 h-32 rounded-xl overflow-hidden bg-lightHead dark:bg-darkHead" {...bData?.logo && { style: { backgroundImage: `url(${bData?.logo})` } }}>
                                <div className={`w-full bg-transparent h-full flex items-center justify-center ${bData?.logo ? 'backdrop-blur-md' : ''}`}>
                                    <Avatar sx={{ boxShadow: 2 }} width={96} height={96} draggable={false} src={bData?.logo} className="!w-24 !h-24 object-cover rounded-xl" alt={context?.data?.data?.name} ></Avatar>
                                </div>
                            </div>
                            <div className="lg:w-[calc(100%-250px)]">
                                {
                                    (error?.error && error?.message?.logo) && <p className="text-red-500 text-sm">{error?.message?.logo}</p>
                                }
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    A profile picture is an image that represents you as an author. It helps readers identify you and can be used to promote your brand.
                                    You can upload a square image which is under 4MB and at least 98 x 98 px in PNG, JPEG, or GIF format. No animated profile pictures are allowed.
                                </p>
                                <div className="mt-3 flex space-x-5">
                                    <Button variant="outlined" color="button" size="small" sx={{ px: 2 }} className="" onClick={handleLogoUpload}> {files?.logo ? 'Change' : 'Upload'} </Button>
                                    <Button variant="text" disabled={!(bData?.logo) || error.message?.logo} color="button" size="small" sx={{ px: 2 }} className="" onClick={handleLogoRemove}>Remove</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <InputHeader label={'Cover Photo'} desc={'Upload a cover photo that represents you as an author. This image will be displayed on your author page and in search results.'} tip={'Recommended size: 2560x1440 pixels'} />
                        <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start items-center lg:space-x-8 space-y-4 lg:space-y-0">
                            <div className="w-60 h-32 rounded-xl bg-lightHead flex items-center justify-center dark:bg-darkHead">
                                <NextImage width={240} draggable={false} height={128} src={bData?.banner || '/static/images/no_banner.png'} alt="banner" className="w-60 h-32 shadow-sm object-cover rounded-xl" />
                            </div>
                            <div className="lg:w-[calc(100%-250px)]">
                                {
                                    (error?.error && error?.message?.banner) && <p className="text-red-500 text-sm">{error?.message?.banner}</p>
                                }
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    A cover photo is a large image that spans the width of your author page. It helps readers understand your brand and can be used to showcase your work.
                                    You can upload an image which is under 6MB and at least 2048 x 1152 px in PNG, JPEG, or GIF format. No animated cover photos are allowed.
                                </p>
                                <div className="mt-3 flex space-x-5">
                                    <Button variant="outlined" color="button" size="small" sx={{ px: 2 }} className="" onClick={handleBannerUpload}>Upload</Button>
                                    <Button variant="text" color="button" disabled={!(bData?.banner) || error.message?.banner} size="small" sx={{ px: 2 }} className="" onClick={handleBannerRemove}>Remove</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const AuthorInfoUpdate = ({ data }) => {
    const context = useContext(StudioContext);
    const [allDisabled, setAllDisabled] = useState(false);
    const [name, setName] = useState({ value: '', error: false, errorText: null });
    const [handle, setHandle] = useState({ value: '', error: false });
    const [description, setDescription] = useState({ value: '', error: false });
    const [email, setEmail] = useState({ value: '', error: false });
    const [links, setLinks] = useState(data?.social || []);
    const { state, setState } = useContext(ChannelEditContext);

    const authorId = context?.data?.data?.key;

    function setDataFromData() {
        setName({ value: data?.name, error: false, errorText: null });
        setHandle({ value: data?.handle, error: false });
        setDescription({ value: data?.description, error: false });
        setEmail({ value: data?.contactEmail, error: false });
        setLinks(data?.social);
    }

    useMemo(() => {
        if (!data) return;
        setDataFromData();
    }, [data]);

    useEffect(() => {
        if (!(name?.value === data?.name) || !(handle?.value === data?.handle) || !(description?.value === data?.bio) || !(email?.value === data?.contactEmail) || (JSON.stringify(links) !== JSON.stringify(data?.social))) {
            if (name.error || handle.error || description.error || email.error) {
                setState({ ...state, data: { aCancle: true } });
            } else {
                setState({ ...state, data: { isRunnable: true } });
            }
        } else {
            setState({ ...state, data: { isRunnable: false, aCancle: false } });
        }
    }, [name?.value, handle?.value, description?.value, email?.value, links]);


    useMemo(async () => {
        if (state?.run) {
            try {
                let newData = await updateAuthorAction({ key: data?.key, data: { name: name.value, handle: handle.value, description: description?.value, social: links, contactEmail: email?.value } });
                if (newData?.data) {
                    context?.setData({ ...context?.data, data: { ...context?.data?.data, ...newData?.data } });
                    context.loading && context.setLoading(false);
                    // setAllDisabled(true);
                    setState({ ...state, data: { isRunnable: false }, run: false });
                    toast.success('Your have successfully updated your profile.')
                } else {
                    throw new Error(newData?.errors[0]?.message || 'Something went wrong, Please try again later.');
                }
            } catch (e) {
                toast.error(e.message)
                setState({ data: { ...state, isRunnable: true }, run: false });
                // setAllDisabled(false);
                context.loading && context.setLoading(false);
            } finally {
                // allDisabled && setAllDisabled(false);
                context.loading && context.setLoading(false);
            }
        }
    }, [state?.run]);

    useEffect(() => {
        if (state?.cancle) {
            setTimeout(() => {
                setState({ ...state, data: { isRunnable: false }, cancle: false });
                setDataFromData();
                toast.info('Your changes have been discarded. Any unsaved changes have been reverted.');
            }, 1000);
        }
    }, [state?.cancle]);

    const validateName = (value) => {
        const regex = /^[^<>]*$/;
        return regex.test(value);
    };

    const handleChangeName = (e) => {
        const value = e.target.value;
        const isValid = validateName(value);
        setName({ value, error: !isValid, errorText: !isValid && 'Name cannot contain angle brackets < >' });
    };

    const handleChangeHandle = (e) => {
        let value = e.target.value;
        let regex = /^[a-zA-Z0-9_]*$/;
        let isValid = regex.test(value);
        if (window && window.location && window.location.origin) {
            setHandle({ value, error: !isValid, errorText: !isValid && 'Handle can only contain letters, numbers, and underscores', url: `${window.location.origin}/@${e.target?.value}` });
        } else
            setHandle({ value, error: !isValid, errorText: !isValid && 'Handle can only contain letters, numbers, and underscores', url: `${process.env.APP_URL}/@${e.target?.value}` });
    };

    const handleChangeDescription = (e) => {
        let value = e.target.value;
        let isValid = validateName(value);
        setDescription({ value, error: !isValid, errorText: !isValid && 'Description cannot contain angle brackets < >' });
    };

    const handleChangeEmail = (e) => {
        let value = e.target.value;
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let isValid = regex.test(value);
        setEmail({ value, error: !isValid, errorText: !isValid && 'Invalid email address' });
    };

    useMemo(() => {
        if (authorId != data?.key) {
            !context?.loading && context?.setLoading(true);
            context?.data?.data?.key && setState({ ...state, data: { isRunnable: false } });
        } else {
            context?.loading && context.setLoading(false);
        }
    }, [context?.loading, data?.key, authorId]);

    return (
        <div className="mt-10 max-w-[900px]">
            <div className="flex flex-col space-y-8 mb-5">
                <div className="flex flex-col space-y-3">
                    <InputHeader label={'Name'} desc={'Your Author name is the name that will be displayed on your profile. It should be easy to remember and relevant to your content. You can change it twice within a month.'} tip={'Name cannot contain angle brackets < >'} />
                    <TextField disabled={allDisabled} size="small" required error={name?.error} helperText={name?.error && name?.errorText} counter inputProps={{ maxLength: 50 }} className="" label="Name" value={name.value} onChange={(e) => handleChangeName(e)} />
                </div>
                <div className="flex flex-col space-y-3">
                    <InputHeader label={'Handle'} desc={'Your handle is a unique identifier for your profile. It will be used in your profile URL and can be changed only once within a month.'} tip={'Handle can only contain letters, numbers, and underscores'} />
                    <TextField disabled={allDisabled} required error={handle?.error} helperText={(handle?.error && handle?.errorText) || handle?.url} counter InputProps={{ startAdornment: <InputAdornment position="start"><div className="ml-1 -mr-4 font-semibold text-gray-600 dark:text-gray-400 stymie">@</div></InputAdornment> }} inputProps={{ maxLength: 30, }} size="small" className="" label="Handle" value={handle?.value} onChange={(e) => handleChangeHandle(e)} />
                </div>
                <div className="flex flex-col space-y-3">
                    <InputHeader label={'Bio'} desc={'Tell viewers about yourself and your content. You can include information about your channel, your interests, and the type of content you create.'} tip={'Bio cannot contain angle brackets < >'} />
                    <TextField disabled={allDisabled} required error={description?.error} helperText={description?.error && description?.errorText} size="large" multiline counter minRows={4} inputProps={{ maxLength: 1000 }} className="" value={description.value || ''} onChange={(e) => handleChangeDescription(e)} />
                </div>
                <div className="flex flex-col space-y-3">
                    <InputHeader label={'Links'} desc={'Add links to your social media profiles, websites, or any other. You can add up to 5 links.'} />
                    <ChannelLinkDragEdit set={{ links, setLinks }} state={{ state, setState }} disabled={allDisabled} />
                </div>
                <div className="flex flex-col space-y-3">
                    <InputHeader label={'Contact Email'} desc={'Add an email address where viewers & readers can contact you for business inquiries or collaborations.'} />
                    <TextField disabled={allDisabled} error={email?.error} helperText={email?.error && email?.errorText} size="small" className="" label="Email" value={email.value || ''} onChange={(e) => handleChangeEmail(e)} />
                </div>
            </div>
        </div>
    );
};

export const InputHeader = ({ label, desc, tip }) => {
    return (
        <div className="flex flex-col mb-1">
            <h2 className="text-base stymie mb-0.5 font-semibold">{label}</h2>
            {desc && <p className="text-[13px] text-slate-600 dark:text-slate-400">
                {desc} {tip && <Tooltip sx={{ ml: 1 }} enterDelay={0} title={<p className='p-1 text-[12px] max-w-[200px]'>{tip}</p>}>
                    <span className='ml-1'><BsPatchQuestion /></span>
                </Tooltip>}</p>
            }
        </div >
    );
};


const ChannelEditLayout = ({ children }) => {
    const [state, setState] = useState({ data: null, run: false, cancle: false });
    const q = useSearchParams().get('t');
    const router = useRouter();
    let ref = useRef(null);
    const context = useContext(StudioContext);

    useEffect(() => {
        context?.setData({ ...context?.data, page: 'edit' });
    }, []);

    const handlePublish = () => {
        context?.setLoading(true);
        setState({ ...state, run: true });
    }

    const handleCancle = () => {
        setState({ ...state, cancle: true });
    };

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

    return (
        <>
            <ChannelEditContext.Provider value={{ state, setState }}>
                <div className="relative w-full pt-4">
                    <div className="flex overflow-x-auto flex-wrap justify-between px-4 items-center py-2 rounded-xl bg-lightHead dark:bg-darkHead sm:space-x-1">
                        <div className="flex items-center justify-between w-full mb-1 mt-1 sm:w-auto sm:justify-start space-x-2 md:space-x-3 lg:space-x-5">
                            {
                                [{ name: 'Sections', value: 'sections' }, { name: 'Branding', value: 'branding' }, { name: 'Basic Info', value: 'info' }].map((item, index) => {
                                    return (
                                        <Button disabled={context?.loading} key={index} onClick={() => router.push(`/${process.env.STUDIO_URL_PREFIX}/edit?t=${item.value}`)} variant="contained" sx={{ px: { xs: 3, sm: 1.4, md: 2.3, lg: 3 } }} className={`font-semibold truncate !text-nowrap cheltenham ${q === item.value ? '!bg-accentLight dark:!bg-accentDark !text-white dark:!text-secondaryDark' : '!bg-light dark:!bg-dark !text-slate-900 dark:!text-slate-100'}`} color="primary" size="small" >
                                            {item.name}
                                        </Button>
                                    );
                                })
                            }
                        </div>
                        <div ref={ref} className="flex justify-between mb-1 mt-1 sm:justify-end w-full sm:w-auto transition-all duration-500 items-center space-x-2 md:space-x-3">
                            <Button disabled={state?.data?.isRunnable ? context?.loading : (state?.data?.aCancle ? context?.loading : true)} onClick={handleCancle} variant="text" sx={{ px: { xs: 3, sm: 1.3, lg: 3 } }} className="font-bold -tracking-tighter cheltenham !bg-light dark:!bg-dark" color="primary" size="small" > Cancel </Button>
                            <Button disabled={state?.data?.isRunnable ? context?.loading : true} onClick={() => handlePublish()} variant="outlined" sx={{ px: { xs: 4, sm: 2, lg: 4 } }} className="font-bold -tracking-tighter cheltenham !bg-light dark:!bg-dark" color="button" size="small" > Publish </Button>
                        </div>
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </ChannelEditContext.Provider>
        </>
    )
}
const ChannelLinkDragEdit = ({ set, state, disabled }) => {
    const [items, setItems] = useState(set.links);
    const titleRef = useRef(null);
    useEffect(() => {
        let s = items?.map((item, index) => {
            let { error, T, U, ...rest } = item;
            return { ...rest };
        });
        if (JSON.stringify(s) !== JSON.stringify(set.links)) {
            setItems(set.links);
        }
    }, [set.links]);
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updatedItems = [...items];
        const [reorderedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, reorderedItem);
        setItems(updatedItems);
    };
    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        if (field === 'name') {
            if (value.trim() === '') {
                updatedItems[index].error = 'T';
                updatedItems[index].T = 'Title is required';
            } else {
                updatedItems[index].error = 'N';
                updatedItems[index].T = '';
            }
        } else if (field === 'url') {
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            if (!urlRegex.test(value)) {
                updatedItems[index].error = 'U';
                updatedItems[index].U = 'Invalid URL';
            } else {
                updatedItems[index].error = 'N';
                updatedItems[index].U = '';
            }
        }
        setItems(updatedItems);
    };
    useEffect(() => {
        setTimeout(() => {
            if (JSON.stringify(set.links) === JSON.stringify(items)) {
                state.setState({ ...state, data: { isRunnable: false } });
            } else {
                if (items?.map(item => item.error).includes('T') || items?.map(item => item.error).includes('U') || items?.map(item => item.name.trim()).includes('') || items?.map(item => item.url.trim()).includes('')) state.setState({ ...state, data: { isRunnable: false } });
                else {
                    let s = items?.map((item, index) => {
                        let { error, T, U, ...rest } = item;
                        return { ...rest };
                    });
                    if (JSON.stringify(s) !== JSON.stringify(set.links)) {
                        state.setState({ ...state, data: { isRunnable: true } });
                        set.setLinks(s);
                    }
                }
            }
        }, 200);
    }, [items]);
    const handleDelete = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };
    const handleAddLink = () => {
        setItems([...items, { id: items.length + 1, name: '', url: '', error: 'T', T: 'Title is required', U: '' }]);
        setTimeout(() => {
            if (titleRef.current) {
                titleRef.current.focus();
            }
        }, 100);
    };
    return (
        <div className="py-2">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <Grid2 container spacing={2} {...provided.droppableProps} className="transition-all duration-500" ref={provided.innerRef}>
                            {items?.map((item, index) => (
                                <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                                    {(provided, snapshot) => (
                                        <Grid2 item xs={12} key={item.id} >
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`px-1 rounded-md ${snapshot.isDragging ? 'bg-gray-100/10 dark:bg-darkHead/10' : ''}`}
                                            >
                                                <Grid2 container spacing={2} className={`group/d`} >
                                                    <Grid2 item xs={1}>
                                                        <div className="mt-1.5" {...provided.dragHandleProps}>
                                                            <IconButton color="primary" className="!cursor-grab" aria-label="drag">
                                                                <RiDraggable className="w-4 h-4" />
                                                            </IconButton>
                                                        </div>
                                                    </Grid2>
                                                    <Grid2 item xs={3.5}>
                                                        <TextField
                                                            label="Title"
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            error={item.error === 'T'}
                                                            required
                                                            helperText={item.error === 'T' ? item.T : ' '}
                                                            value={item?.name}
                                                            inputRef={titleRef}
                                                            disabled={disabled}
                                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                        />
                                                    </Grid2>
                                                    <Grid2 item xs={6.5}>
                                                        <TextField
                                                            label="URL"
                                                            variant="outlined"
                                                            fullWidth
                                                            error={item.error === 'U'}
                                                            size="small"
                                                            required
                                                            disabled={disabled}
                                                            helperText={item.error === 'U' ? item.U : ' '}
                                                            value={item.url}
                                                            onChange={(e) => handleChange(index, 'url', e.target.value)}
                                                        />
                                                    </Grid2>
                                                    <Grid2 item xs={1}>
                                                        <IconButton className="transition-all duration-500 !hidden group-hover/d:!flex mt-1.5 hover:!flex" color="error" aria-label="delete" onClick={() => handleDelete(index)}>
                                                            <MdOutlineDeleteOutline className="w-4 h-4" />
                                                        </IconButton>
                                                    </Grid2>
                                                </Grid2>
                                            </div>
                                        </Grid2>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid2>
                    )}
                </Droppable>
            </DragDropContext>
            <Button variant="outlined" className="mt-2 transition-all group/add_link !h-8 duration-300 text-[0px] hover:text-sm" color="button" startIcon={<IoIosAdd className="-mr-2 group-hover/add_link:mr-0" />} onClick={handleAddLink}>
                Add Link
            </Button>
        </div>
    );
};

export const SetDynmicAuthor = ({ key }) => {
    const router = useRouter();
    useEffect(() => {
        SetAuthorStudioCookie(key).then((res) => {
            if (res)
                router.push(`/${process.env.STUDIO_URL_PREFIX}/edit?t=info`);
            else {
                router.push(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
            }
        }).catch((e) => {
            router.push(`/${process.env.STUDIO_URL_PREFIX}/dashboard`);
        });
    }, []);

    return (
        <>

        </>
    )
}

export { ChannelEditLayoutFunc, ChannelBrandFunc, AuthorInfoUpdate, ChannelEditLayout };