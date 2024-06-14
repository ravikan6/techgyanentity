"use client";
import CreateAuthor from "../author/create";
import { TextField, Button } from "../rui";

export const CreatePost = () => {
    return (
        <>
            <div className="w-full max-w-3xl mx-auto px-10 flex flex-col ">
                <div className="mb-10">
                    <TextField fullWidth={true} variant="standard" label="Title" />
                </div>
                <div>
                    <TextField row={5} maxRow={10} label="Content" multiline fullWidth />
                </div>

                <div className="mt-10">
                    <Button className="btn">Create Post</Button>
                </div>
            </div>

            <div className="mt-32">
                <CreateAuthor />
            </div>
        </>
    );
};