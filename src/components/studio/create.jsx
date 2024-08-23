"use client";
import { StudioContext } from "@/lib/context";
import { Avatar, Box, Chip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button, IconButton, TextField } from "../rui";
import { createMicroPost } from "@/lib/actions/create";
import { toast } from "react-toastify";
import { CloseRounded, ImageRounded, LinkRounded, Paragliding, Poll, TextFields } from "@mui/icons-material";

const MicroPostCreate = () => {
    const [type, setType] = useState('TEXT')
    const [content, setContent] = useState({ title: '' })
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const { data, setLoading: contextLoading } = useContext(StudioContext);

    const types = [{ t: 'TEXT', i: <TextFields fontSize="small" /> }, { t: 'IMAGE', i: <ImageRounded fontSize="small" /> }, { t: 'POLL', i: <Poll fontSize="small" /> }, { t: 'LINK', i: <LinkRounded fontSize="small" /> }, { t: 'ARTICLE', i: <Paragliding fontSize="small" /> }]

    useEffect(() => {
        contextLoading(false)
    }, [])

    useEffect(() => {
        if (content?.title) {
            switch (type) {
                case "TEXT": {
                    if (content?.title.length > 0) {
                        setDisabled(false)
                    } else {
                        setDisabled(true)
                    }
                    break;
                } case "IMAGE": {
                    break;
                } case "POLL": {
                    if (content?.title.length > 0 && content?.options.length > 1) {
                        let a = content?.options.filter((v) => v.length > 0)
                        if (a.length > 1) {
                            setDisabled(false)
                        } else {
                            setDisabled(true)
                        }
                    } else {
                        setDisabled(true)
                    }
                    break;
                } case "LINK": {
                    if (content?.title.length > 0) {
                        setDisabled(false)
                    } else {
                        setDisabled(true)
                    }
                    break;
                } case "ARTICLE": {
                    if (content?.title.length > 0) {
                        setDisabled(false)
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
                break;
            } case "POLL": {
                setContent((c) => ({ title: content.title, options: ['', ''] }))
                break;
            } default: {
                setContent((c) => ({ title: c.title }))
            }
        }
        setType(type)
    }

    const onSubmit = async () => {
        if (content?.title && type) {
            try {
                setLoading(true)
                let dt = { content: content, type, authorId: data?.data?.id }
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
                    <MicroPostEditor type={type} setter={setContent} getter={content} onCancle={() => structSetter("TEXT")} disabled={loading} />
                </div>
                <div className="flex justify-end items-center gap-4">
                    <Button size="small" disabled={loading} variant="text" color="primary" onClick={() => { structSetter("TEXT") }}>Cancle</Button>
                    <Button size="small" disabled={loading || disabled} variant="contained" color="button" className={`${(loading || disabled) ? null : 'dark:!text-black'}`} onClick={() => onSubmit()}>Post</Button>
                </div>
            </Box>
            {(type.toLowerCase() === 'text') ? <div className="flex gap-2 mt-4">
                {types.map(({ t, i: iconComp }, l) => (
                    <Chip key={l} variant={type === t ? "filled" : "outlined"} color={type === t ? "accent" : "primary"} icon={<span className="mr-3">{iconComp}</span>} label={t.slice(0, 1).concat(t.slice(1).toLowerCase())} onClick={() => { structSetter(t) }} sx={{ px: 1.2 }} />
                ))}
            </div> : null}
        </>
    )
}

const MicroPostEditor = ({ type, setter, getter, onCancle, disabled }) => {
    switch (type) {
        case 'TEXT':
            return <MicroPostText setter={setter} getter={getter} />
        case 'IMAGE':
            return <MicroPostImage setter={setter} getter={getter} />
        case 'POLL':
            return <MicroPostPoll setter={setter} getter={getter} onCancle={onCancle} disabled={disabled} />
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
            <MicroPostTextField onChange={(e) => setter((dt) => ({ ...dt, title: e.target.value }))} getter={getter?.title} counter={true} />
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

const MicroPostPoll = ({ setter, getter, onCancle, disabled }) => {
    const a = getter?.options;

    return (
        <div>
            <MicroPostTextField onChange={(e) => setter((dt) => ({ ...dt, title: e.target.value }))} getter={getter?.title} placeholder="Poll Question" />
            <div className="flex flex-col gap-3 mt-2.5">
                {getter.options?.map((v, i) => {
                    const onChange = (e) => {
                        a[i] = e.target.value;
                        setter((dt) => ({ ...dt, options: a }))
                    }
                    const onRemove = () => {
                        a.splice(i, 1);
                        setter((dt) => ({ ...dt, options: a }))
                        if (a.length < 2) {
                            onCancle()
                        }
                    }
                    return (
                        <div className="flex items-center gap-3 w-full">
                            <IconButton disabled={disabled} size="small" onClick={() => { onRemove() }}>
                                <CloseRounded fontSize="small" />
                            </IconButton>
                            <div className="rounded-full overflow-hidden bg-lightHead/70 dark:bg-darkHead/70 px-2 w-3/4 flex items-center h-10" key={i}>
                                <TextField
                                    size="small"
                                    disabled={disabled}
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
            {(a?.length <= 4) ? <div className="flex mt-4">
                <Button size="small" variant="outlined" sx={{ px: 2 }} color="button" onClick={() => { setter((dt) => ({ ...dt, options: [...dt.options, ''] })) }}>Add Option</Button>
            </div> : null}
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

const MicroPostTextField = ({ value, onChange, length, counter, placeholder, fieldProps }) => {
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

export { MicroPostCreate }