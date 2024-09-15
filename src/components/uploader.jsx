"use client";
import { useState } from "react";
import { Button, IconButton, TextField } from "./rui";
import { CgFileAdd } from "react-icons/cg";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { InputHeader } from "./studio/author/_edit-funcs";

const MicroPostImageUploader = ({ setter, getter }) => {
    const [files, setFiles] = useState([]);
    const [fileEnter, setFileEnter] = useState(false);
    const [selectedFile, setSelectedFile] = useState(0);
    const [caption, setCaption] = useState("");
    const [isCover, setIsCover] = useState(true);

    console.log(files);

    return (
        <div className="bg-lightHead dark:bg-darkHead p-2 rounded-md">
            {
                files.length === 0 ? (
                    <div className="">
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setFileEnter(true);
                            }}
                            onDragLeave={(e) => {
                                setFileEnter(false);
                            }}
                            onDragEnd={(e) => {
                                e.preventDefault();
                                setFileEnter(false);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                setFileEnter(false);
                                setFiles([...e.dataTransfer.files]);
                            }}
                            className={`${fileEnter ? "border-4" : "border-2"
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
                                type="file"
                                className="hidden"
                                multiple
                                onChange={(e) => {
                                    setFiles([...e.target.files]);
                                }}
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
                                            multiple
                                            onChange={(e) => {
                                                setFiles([...files, ...e.target.files]);
                                            }}
                                        />
                                        <IconButton onClick={() => {
                                            document.getElementById("file").click();
                                        }} sx={{
                                            width: "2.5rem",
                                            height: "2.5rem"
                                        }}>
                                            <CgFileAdd />
                                        </IconButton>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex flex-col lg:flex-row space-y-2 space-x-3 justify-center lg:justify-around items-center bg-light dark:bg-dark flex-1 rounded-md p-2">
                            <div className="flex flex-col space-y-2">
                                <div>
                                    <InputHeader label={"Caption"} desc={"Write a caption"} tip={"Add a caption"} />
                                    <TextField value={caption} required={false} onChange={(e) => setCaption(e.target.value)} size='small' />
                                </div>
                                <div>
                                    <InputHeader label={"Location"} required={false} desc={"Tell your followers where you are or where you took the photo"} tip={"Add a location"} />
                                    <TextField size='small' />
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
                                            setFiles(files.filter((_, index) => index !== selectedFile));
                                            setSelectedFile(0);
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