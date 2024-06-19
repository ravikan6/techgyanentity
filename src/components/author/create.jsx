"use client";
import { createAuthor } from "@/lib/actions/user";
import { TextField, Button } from "../rui";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateAuthor = () => {
    const [bio, setBio] = useState("");

    const createAuthorx = async () => {
        let st = await createAuthor({ bio: bio });
        console.log(st);
        if (st.errors) {
            return toast.error("An error occurred");
        }
        if (st.status === 500) {
            return toast.error("An error occurred");
        }
        toast.success("Author created successfully");
    }

    return (
        <>
            <h1>Create Author</h1>
            <div className="w-full max-w-3xl mx-auto px-10 flex flex-col ">
                <div>
                    <TextField onChange={(e)=> setBio(e.target.value)} fullWidth={true} variant="standard" label="Bio" />
                </div>

                <div className="mt-10">
                    <Button onClick={createAuthorx} className="btn">Create Author</Button>
                </div>
            </div>
        </>
    );
}

export default CreateAuthor;