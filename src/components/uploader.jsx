"use client";
import { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "./rui";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { InputHeader } from "./studio/author/_edit-funcs";
import { LuImagePlus } from "react-icons/lu";
import { useDropzone } from 'react-dropzone'
import { IoIosImages } from "react-icons/io";

const MicroPostImageUploader = ({ setter, getter }) => {
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

export { MicroPostImageUploader };