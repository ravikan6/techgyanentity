"use client";
import { StudioContext } from "@/lib/context";
import { Avatar, Box, Chip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button, TextField } from "../rui";
import { createMicroPost } from "@/lib/actions/create";
import { toast } from "react-toastify";
import { ImageRounded, LinkRounded, Paragliding, Poll, TextFields } from "@mui/icons-material";

const MicroPostCreate = () => {
    const [type, setType] = useState('TEXT')
    const [content, setContent] = useState({ title: '' })
    const [loading, setLoading] = useState(false)

    const { data, setLoading: contextLoading } = useContext(StudioContext);

    const types = [{ t: 'TEXT', i: <TextFields fontSize="small" /> }, { t: 'IMAGE', i: <ImageRounded fontSize="small" /> }, { t: 'POLL', i: <Poll fontSize="small" /> }, { t: 'LINK', i: <LinkRounded fontSize="small" /> }, { t: 'ARTICLE', i: <Paragliding fontSize="small" /> }]

    useEffect(() => {
        contextLoading(false)
    }, [])

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
                <div className="flex justify-end items-center gap-4">
                    <Button size="small" disabled={loading} variant="outlined" color="primary" onClick={() => { setContent({ title: '' }), setType('TEXT') }}>Cancle</Button>
                    <Button size="small" disabled={loading} variant="contained" color="button" className={`${loading ? null : 'dark:!text-black'}`} onClick={() => onSubmit()}>Post</Button>
                </div>
            </Box>
            {(type.toLowerCase() === 'text') ? <div className="flex gap-2 mt-4">
                {types.map(({ t, i: iconComp }, l) => (
                    <Chip key={l} variant={type === t ? "filled" : "outlined"} color={type === t ? "accent" : "primary"} icon={<span className="mr-3">{iconComp}</span>} label={t.slice(0, 1).concat(t.slice(1).toLowerCase())} onClick={() => setType(t)} sx={{ px: 1.2 }} />
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
            <TextField
                size="small"
                placeholder="What's on your mind?"
                value={getter?.title}
                onChange={(e) => setter((dt) => ({ ...dt, title: e.target.value }))}
                sx={{ '& .MuiInputBase-root': { '& .MuiInputBase-input': { padding: '0px 10px !important' } } }}
                fullWidth
                variant="standard"
                margin="dense"
                counter={true}
                multiline
                InputProps={{
                    disableUnderline: true,
                    maxLength: 500
                }}
            />
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