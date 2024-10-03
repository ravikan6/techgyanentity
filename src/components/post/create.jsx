"use client";
import { StudioContext } from "@/lib/context";
import { Avatar, Box, Chip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@/components/rui";
import { toast } from "react-toastify";
import { CloseRounded, ImageRounded, Poll, TextFields } from "@mui/icons-material";
import { useRouter } from "next-nprogress-bar";

import { capitlize } from "@/lib/utils";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { LuImagePlus } from "react-icons/lu";
import { useDropzone } from 'react-dropzone'
import { IoIosImages } from "react-icons/io";
import { InputHeader } from "../studio/author/_edit-funcs";
import { createPost } from "@/lib/actions/setters/post";

const Create = () => {
    const [type, setType] = useState('TEXT')
    const [content, setContent] = useState({ title: '' })
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const { data, setLoading: setContextLoading, loading: contextLoading } = useContext(StudioContext);

    const _types = [
        { t: 'TEXT', i: <TextFields fontSize="small" /> },
        { t: 'IMAGE', i: <ImageRounded fontSize="small" /> },
        { t: 'POLL', i: <Poll fontSize="small" /> }
    ]

    useEffect(() => {
        if (contextLoading) setContextLoading(false)
    }, [])

    const router = useRouter();

    useEffect(() => {
        if (content?.title) {
            switch (type) {
                case "TEXT": {
                    if (content?.title.trim().length > 0) {
                        setDisabled(false)
                    } else {
                        setDisabled(true)
                    }
                    break;
                } case "IMAGE": {
                    if (content?.title.trim().length > 0 && content?.images.length > 0) {
                        setDisabled(false)
                    } else {
                        setDisabled(true)
                    }
                    break;
                } case "POLL": {
                    if (content?.title.trim().length > 0 && content?.options.length > 1) {
                        let a = content?.options.filter((v) => v.trim().length > 0)
                        if (a.length > 1) {
                            setDisabled(false)
                        } else {
                            setDisabled(true)
                        }
                    } else {
                        setDisabled(true)
                    }
                    break;
                } default: {
                    setDisabled(true)
                }
            }
        } else {
            setDisabled(true)
        }
    }, [content, type])

    const structSetter = (type) => {
        switch (type) {
            case "IMAGE": {
                setContent((c) => ({ title: c.title, images: [] }))
                break;
            } case "POLL": {
                setContent((c) => ({ title: c.title, options: ['', ''] }))
                break;
                // More ...
            } default: {
                setContent((c) => ({ title: c?.title }))
            }
        }
        setType(type)
    }

    const onSubmit = async () => {
        if (content?.title && type) {
            try {
                setLoading(true)
                setContextLoading(true)
                let dt = { content: content, type, authorKey: data?.data?.key }
                let res = await createPost(dt);
                if (res.success) {
                    toast.success('Post created successfully')
                    setContent({ title: '' })
                    structSetter('TEXT')
                    router.push(`/view?type=post&id=${res.data?.key}`)
                } else {
                    if (res.errors) res.errors.map((e) => toast.error(e?.message));
                    else throw new Error('Something went wrong.')
                }
            } catch (e) {
                toast.error('An error occured')
            } finally {
                setLoading(false)
                setContextLoading(false)
            }
        }
    }

    return (
        <>
            <Box className={`p-2 rounded-2xl border dark:border-white/30 border-black/30 focus-within:dark:border-white focus-within:border-black`}>
                <div className="flex gap-4 items-center">
                    <Avatar draggable={false} className={`!w-8 !h-8 text-base font-semibold rounded-full`} alt={data?.data?.name} src={data?.data?.image} />
                    <h3 className={`text-lg karnak font-semibold`}>{data?.data?.name}</h3>
                </div>
                <div className="my-2">
                    <_Editor type={type} options={{
                        content: {
                            data: content,
                            set: setContent
                        },
                        onCancle: () => structSetter("TEXT"),
                        disabled: loading,
                    }} />
                </div>
                <div className="flex justify-end items-center gap-4">
                    <Button size="small" disabled={loading} variant="text" color="primary" onClick={() => { structSetter("TEXT") }}>Cancle</Button>
                    <Button size="small" disabled={loading || disabled} variant="contained" color="inherit" className={''} onClick={() => onSubmit()}>Post</Button>
                </div>
            </Box>
            {(type.toLowerCase() === 'text') && !loading ? <div className="flex gap-2 mt-4 flex-wrap">
                {_types.map(({ t, i: iconComp }, l) => (
                    <Chip key={l} variant={type === t ? "filled" : "outlined"} color={type === t ? "accent" : "primary"} icon={<span className="mr-3">{iconComp}</span>} label={capitlize(t)} onClick={() => { structSetter(t) }} sx={{ px: 1.2 }} />
                ))}
            </div> : null}
        </>
    )
}

const _Editor = ({ type, options }) => {
    switch (type) {
        case 'TEXT':
            return <_TextEditor options={options} />
        case 'IMAGE':
            return <_ImageEditor options={options} />
        case 'POLL':
            return <_PollEditor options={options} />
        default:
            return <_TextEditor options={options} />
    }
}

const _TextEditor = ({ options }) => {

    const onChange = (e) => {
        options?.content?.set((dt) => ({ ...dt, title: e.target.value }))
    }

    return (
        <>
            <_TextField onChange={onChange} value={options?.content?.data?.title} counter={true} />
        </>
    )
}

const _ImageEditor = ({ options }) => {

    const onChange = (e) => {
        options?.content?.set((dt) => ({ ...dt, title: e.target.value }))
    }

    return (
        <div>
            <_TextField onChange={onChange} value={options?.content?.data?.title} counter={true} />
            <_ImagesUploader setter={options?.content?.set} getter={options?.content?.data} />
        </div>
    )
}

const _PollEditor = ({ options }) => {
    const x = options?.content?.data?.options;

    const onChange = (e) => {
        options?.content?.set((dt) => ({ ...dt, title: e.target.value }))
    }

    return (
        <div>
            <_TextField onChange={onChange} value={options?.content?.data?.title} counter={true} />
            <div className="flex flex-col gap-3 mt-2.5">
                {options?.content?.data?.options?.map((v, i) => {
                    const onChange = (e) => {
                        x[i] = e.target.value;
                        options?.content?.set((dt) => ({ ...dt, options: x }))
                    }
                    const onRemove = () => {
                        x.splice(i, 1);
                        options?.content?.set((dt) => ({ ...dt, options: x }))
                        if (x.length < 2) {
                            options?.onCancle()
                        }
                    }
                    return (
                        <div className="flex items-center gap-3 w-full">
                            <IconButton disabled={options?.disabled} size="small" onClick={() => onRemove()}>
                                <CloseRounded fontSize="small" />
                            </IconButton>
                            <div className="rounded-full overflow-hidden bg-lightHead/70 dark:bg-darkHead/70 px-2 w-full md:w-3/4 flex items-center h-10" key={i}>
                                <TextField
                                    size="small"
                                    disabled={options?.disabled}
                                    placeholder="Add Option..."
                                    value={v}
                                    onChange={(e) => onChange(e)}
                                    sx={{ '& .MuiInputBase-root': { '& .MuiInputBase-input': { padding: '0px 10px !important' }, padding: 0 }, margin: '0px !important' }}
                                    fullWidth
                                    variant="standard"
                                    counter={true}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    inputProps={{ maxLength: 65, disableUnderline: true }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
            {(x?.length <= 4) ? <div className="flex mt-4">
                <Button size="small" variant="outlined" sx={{ px: 2 }} color="button" onClick={() => { options?.content?.set((dt) => ({ ...dt, options: [...dt.options, ''] })) }}>Add Option</Button>
            </div> : null}
        </div>
    )
}

const _TextField = ({ value, onChange, length, counter, placeholder, fieldProps }) => {
    return (
        <TextField
            size="small"
            placeholder={placeholder || "What's on your mind?"}
            value={value}
            onChange={(e) => onChange(e)}
            sx={{ '& .MuiInputBase-root': { '& .MuiInputBase-input': { padding: '0px 10px !important' } } }}
            fullWidth
            variant="standard"
            margin="dense"
            counter={counter}
            multiline
            InputProps={{
                disableUnderline: true,
            }}
            inputProps={{ maxLength: length || 500, disableUnderline: true }}
            {...fieldProps}
        />)
}

const _ImagesUploader = ({ setter, getter }) => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(0);
    const [meta, setMeta] = useState([]);
    const [isCover, setIsCover] = useState(true);
    const [error, setError] = useState([]);

    const onDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setError(fileRejections);
            return;
        }
        if (files.length + acceptedFiles.length > 5) {
            return;
        }
        setFiles([...files, ...acceptedFiles]);
        setMeta([...meta, ...Array(acceptedFiles.length).fill({ caption: "", location: "" })]);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            "image/jpeg": [".jpg", ".jpeg", ".jpe"],
            "image/png": [".png", ".apng"],
            "image/gif": [".gif", ".webp"]
        }, multiple: true, maxFiles: 5 - files.length,
    });

    const handleCaption = (value) => {
        const newMeta = [...meta];
        newMeta[selectedFile] = { ...newMeta[selectedFile], caption: value };
        setMeta(newMeta);
    }

    // Will be used in future
    // const handleLocation = (value) => {
    //     const newMeta = [...meta];
    //     newMeta[selectedFile] = { ...newMeta[selectedFile], location: value };
    //     setMeta(newMeta);
    // }

    const onRemove = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setMeta(meta.filter((_, i) => i !== index));
        setSelectedFile(0);
    }

    useEffect(() => {
        if (files.length > 0 && files.length <= 5 && error.length === 0) {
            let data = [];
            files.forEach((file, index) => {
                let f = new FormData();
                f.append("data", file);
                data.push({
                    file: f,
                    caption: meta[index]?.caption,
                    // location: meta[index]?.location, // location is not used (Will be used in future)
                });
            });
            setter((prev) => {
                return {
                    ...prev,
                    images: data,
                }
            });
        }
    }, [files, meta, error]);

    return (
        <div className="bg-lightHead dark:bg-darkHead p-2 rounded-md">
            {
                files.length === 0 ? (
                    <section className="w-full p-4">
                        <div
                            {...getRootProps()}
                            className={`${isDragActive ? "border-accent dark:border-accentDark" : "border-accent/40 dark:border-accentDark/40"
                                } relative flex flex-col w-full border border-dashed rounded-md min-h-72 items-center justify-center`}
                        >
                            <div className="flex justify-center gap-3 items-center flex-col text-black/85 dark:text-white/85">
                                <IoIosImages className="w-16 h-16" />
                                <p className="text-sm">Drag and drop your images here</p>
                                <p className="text-xs">or</p>
                                <Button
                                    variant="text"
                                    size="small"
                                >
                                    Browse files to upload
                                </Button>
                            </div>
                            <label
                                htmlFor="file"
                                className="hidden"
                            >
                                Click to upload or drag and drop
                            </label>
                            <input
                                id="file"
                                multiple
                                {...getInputProps()}
                                className="hidden"
                            />
                            <div className="absolute bottom-2 w-full flex flex-col justify-center items-center text-gray-600 dark:text-zinc-400 text-xs">
                                <p>You can upload up to 5 images.</p>
                                <p className="text-center">Images must be in JPG, PNG, or GIF format, under 5MB, and have an aspect ratio between 1:1 and 4:5.</p>
                            </div>
                        </div>
                    </section>
                )
                    :
                    <div className="flex">
                        <div className="min-w-24 max-w-24 flex flex-col items-center space-y-3 -ml-2">
                            {files.map((file, index) => (
                                <div key={index} className={`relative rounded-md overflow-hidden border-2 ${selectedFile === index ? 'border-button' : 'border-transparent'}`}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        className="w-16 h-16 object-cover"
                                        onClick={() => {
                                            setSelectedFile(index);
                                        }}
                                    />
                                </div>
                            ))}
                            {
                                files.length < 5 && (
                                    <div {...getRootProps()} className="w-16 h-16 rounded-md flex justify-center items-center bg-light dark:bg-dark">
                                        <label
                                            htmlFor="file"
                                            className="hidden"
                                        >
                                            Add more
                                        </label>
                                        <input
                                            id="file"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            {...getInputProps()}
                                        />
                                        <IconButton sx={{
                                            width: "2.5rem",
                                            height: "2.5rem"
                                        }}>
                                            <LuImagePlus />
                                        </IconButton>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex flex-col lg:flex-row space-y-2 space-x-3 justify-center lg:justify-around items-center bg-light dark:bg-dark flex-1 rounded-md p-2">
                            <div className="flex flex-col space-y-2">
                                <div>
                                    <InputHeader label={"Caption"} desc={"Write a caption"} tip={"Add a caption"} />
                                    <TextField value={meta[selectedFile]?.caption} required={false} onChange={(e) => handleCaption(e.target.value)} size='small' />
                                </div>
                                {/* <div>
                                    <InputHeader label={"Location"} required={false} desc={"Tell your followers where you are or where you took the photo"} tip={"Add a location"} />
                                    <TextField size='small' value={meta[selectedFile]?.location} onChange={(e) => handleLocation(e.target.value)} />
                                </div> */}
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="relative w-52 h-52 rounded-md overflow-hidden bg-lightHead dark:bg-darkHead">
                                    <img src={URL.createObjectURL(files[selectedFile || 0])} alt="" className="w-52 h-52 rounded-md" style={{
                                        objectFit: isCover ? "cover" : "contain"
                                    }} />
                                    <div className="absolute top-1.5 z-10 right-1.5 dark:bg-black bg-white bg-opacity-40 backdrop-blur text-white p-0.5 rounded-md">
                                        <IconButton onClick={() => {
                                            setIsCover(!isCover);
                                        }
                                        }>
                                            {isCover ? <Fullscreen /> :
                                                <FullscreenExit />}
                                        </IconButton>
                                    </div>
                                </div>

                                <div className="flex justify-around">
                                    <Button
                                        onClick={() => {
                                            onRemove(selectedFile);
                                        }}
                                        variant="text"
                                        size="small"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
            }
            {
                error.length > 0 && (
                    <div className="text-red-500 text-xs mt-2">
                        {
                            error.map((e, i) => (
                                <p key={i}>{e.errors[0].message}</p>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}


export { Create }