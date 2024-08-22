"use client";
import { StudioContext } from "@/lib/context";
import { Avatar, Box, Chip } from "@mui/material";
import { useContext, useState } from "react";
import { Button } from "../rui";
import { createMicroPost } from "@/lib/actions/create";
import { toast } from "react-toastify";

const MicroPostCreate = () => {
    const [type, setType] = useState('TEXT')
    const [content, setContent] = useState({ title: '' })
    const [loading, setLoading] = useState(false)

    const { data } = useContext(StudioContext);

    const types = ['TEXT', 'IMAGE', 'POLL', 'LINK', 'ARTICLE']

    const onSubmit = async () => {
        if (content?.title && type) {
            try {
                setLoading(true)
                let dt = { title: content.title, type, authorId: data?.data?.id }
                let res = await createMicroPost(dt);

                if (res && res.data, res.status === 200) {
                    toast.info('Post Published')
                } else {
                    res.errors.map((e) => toast.error(e?.message))
                }
            } catch { } finally {
                setLoading(false)
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
                    <MicroPostEditor type={type} setter={setContent} getter={content} />
                </div>
                <div className="flex justify-end items-center">
                    <Button disabled={loading} variant="outlined" color="primary" onClick={() => { setContent({ title: '' }), setType('TEXT') }}>Cancle</Button>
                    <Button disabled={loading} variant="contained" color="accent" onClick={() => onSubmit()}>Post</Button>
                </div>
            </Box>
            {(type.toLowerCase() === 'text') ? <div className="flex gap-2 mt-4">
                {types.map((t, i) => (
                    <Chip key={i} variant={type === t ? "filled" : "outlined"} color={type === t ? "accent" : "primary"} onClick={() => setType(t)}>{t}</Chip>
                ))}
            </div> : null}
        </>
    )
}

const MicroPostEditor = ({ type, setter, getter }) => {
    switch (type) {
        case 'TEXT':
            return <MicroPostText setter={setter} getter={getter} />
        case 'IMAGE':
            return <MicroPostImage setter={setter} getter={getter} />
        case 'POLL':
            return <MicroPostPoll setter={setter} getter={getter} />
        case 'LINK':
            return <MicroPostLink setter={setter} getter={getter} />
        case 'ARTICLE':
            return <MicroPostArticle setter={setter} getter={getter} />
        default:
            return <MicroPostText setter={setter} getter={getter} />
    }
}

const MicroPostText = ({ setter, getter }) => {
    return (
        <div>
            <input type="text" value={getter?.title} onChange={(e) => setter((dt) => ({ ...dt, title: e.target.value }))} />
        </div>
    )
}

const MicroPostImage = ({ setter, getter }) => {
    return (
        <div>
            <input type="file" onChange={(e) => setter({ title: e.target.value })} />
        </div>
    )
}

const MicroPostPoll = ({ setter, getter }) => {
    return (
        <div>
            <input type="text" onChange={(e) => setter({ title: e.target.value })} />
        </div>
    )
}

const MicroPostLink = ({ setter, getter }) => {
    return (
        <div>
            <input type="text" onChange={(e) => setter({ title: e.target.value })} />
        </div>
    )
}

const MicroPostArticle = ({ setter, getter }) => {
    return (
        <div>
            <input type="text" onChange={(e) => setter({ title: e.target.value })} />
        </div>
    )
}

export { MicroPostCreate }