"use client";
import { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "./rui";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { InputHeader } from "./studio/author/_edit-funcs";
import { LuImagePlus } from "react-icons/lu";
import { useDropzone } from 'react-dropzone'

const MicroPostImageUploader = ({ setter, getter }) => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(0);
    const [meta, setMeta] = useState([]);
    const [isCover, setIsCover] = useState(true);
    const [error, setError] = useState("");

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 5) {
            return;
        }
        setFiles([...acceptedFiles]);
        setMeta([...meta, ...Array(acceptedFiles.length).fill({ caption: "", location: "" })]);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: true, maxFiles: 5 });

    const handleCaption = (value) => {
        const newMeta = [...meta];
        newMeta[selectedFile] = { ...newMeta[selectedFile], caption: value };
        setMeta(newMeta);
    }

    const handleLocation = (value) => {
        const newMeta = [...meta];
        newMeta[selectedFile] = { ...newMeta[selectedFile], location: value };
        setMeta(newMeta);
    }

    const onRemove = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setMeta(meta.filter((_, i) => i !== index));
        setSelectedFile(0);
    }

    useEffect(() => {
        if (files.length > 0 && files.length <= 5 && !error) {
            let data = [];
            files.forEach((file, index) => {
                let f = new FormData();
                f.append("data", file);
                data.push({
                    file: f,
                    caption: meta[index]?.caption,
                    location: meta[index]?.location,
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
                    <div className="">
                        <div
                            {...getRootProps()}
                            className={`${isDragActive ? "border-4" : "border-2"
                                } mx-auto flex flex-col w-full max-w-xs h-72 items-center justify-center`}
                        >
                            <label
                                htmlFor="file"
                                className="h-full flex flex-col justify-center text-center"
                            >
                                Click to upload or drag and drop
                            </label>
                            <input
                                id="file"
                                {...getInputProps()}
                                className="hidden"
                                accept="image/*"
                                multiple
                            />
                        </div>
                    </div>
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
                                    <div className="w-16 h-16 rounded-md flex justify-center items-center bg-light dark:bg-dark">
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
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                onDrop([...files, ...e.target.files]);
                                            }}
                                        />
                                        <IconButton onClick={() => {
                                            document.getElementById("file").click();
                                        }} sx={{
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
                                <div>
                                    <InputHeader label={"Location"} required={false} desc={"Tell your followers where you are or where you took the photo"} tip={"Add a location"} />
                                    <TextField size='small' value={meta[selectedFile]?.location} onChange={(e) => handleLocation(e.target.value)} />
                                </div>
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
        </div>
    );
}

export { MicroPostImageUploader };