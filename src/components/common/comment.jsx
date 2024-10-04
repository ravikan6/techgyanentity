"use comment";
import { useSession } from "next-auth/react";
import { AnonymousAction, MoreMenuButton } from ".";
import { Avatar, Backdrop, Grid2, List, ListItem, Skeleton } from "@mui/material";
import { CommentOutlined, Delete, Edit, Report, SendOutlined } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { CommentContext, CommentMetaContext, StudioContext } from "@/lib/context";
import { CreatorWrapper } from "../creator/utils";
import { Button, CircularProgress, IconButton, Tooltip, Menu } from "../rui";
import { formatDate } from "@/lib/utils";
import { FaHandsClapping } from "react-icons/fa6";
import { PiHandsClappingLight } from "react-icons/pi";
import { BsReply } from "react-icons/bs";
import { useLazyQuery } from "@apollo/client";
import { BackBtn } from "../Buttons";
import { MenuListItem } from "./client";
import { TextField } from "@/components/styled";
import { BiCommentEdit } from "react-icons/bi";
import { FaReplyd } from "react-icons/fa";


const WriteField = () => {
    const { creator } = useContext(StudioContext);
    const { data: session } = useSession();
    const { form, state, content, onSend } = useContext(CommentContext);

    const handleCommentChange = (e) => {
        form.set((prev) => ({ ...prev, text: e.target.value }))
    };

    const userData = (creator?.key === content?.authorKey) ? {
        ...creator
    } : {
        ...session.user
    }

    return (
        <AnonymousAction isAnonymous={!session.user} text={'To participate in the discussion and leave a comment, please ensure that you are logged into your account. Logging in helps us maintain a safe and engaging community environment.'} action={() => { }} >
            <div className={`flex justify-between gap-3 items-center px-3 py-1 w-full`}>
                <Avatar src={userData?.image?.url} sx={{ width: 24, height: 24, borderRadius: 1000 }} alt={userData?.name} >{userData?.name?.slice(0, 1)}</Avatar>
                <TextField
                    required
                    multiline
                    variant="outlined"
                    size="small"
                    maxRows={1}
                    fullWidth
                    placeholder="Write a comment..."
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: '8px !important',
                        },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px !important',
                            py: '3.5px !important',
                            fontSize: '0.75rem',
                            lineHeight: '1rem'
                        },
                    }}
                    value={form.data.text}
                    onChange={handleCommentChange}
                    slotProps={{
                        input: {
                            endAdornment: (form.data.text?.trim()?.length > 0) ? <>
                                {state.sending ?
                                    <CircularProgress size={20} /> :
                                    <IconButton size="small" onClick={() => onSend()}>
                                        {form.data.action === 'CREATE' ? <SendOutlined fontSize="small" /> : null}
                                        {form.data.action === 'REPLY' ? <FaReplyd fontSize="small" /> : null}
                                        {form.data.action === 'UPDATE' ? <BiCommentEdit fontSize="small" /> : null}
                                    </IconButton>}
                            </> : null,
                        },
                    }}
                ></TextField>
            </div>
        </AnonymousAction >
    );
};

const ActionButton = () => {
    const { creator } = useContext(StudioContext);
    const { data: session } = useSession();
    const { form, content } = useContext(CommentContext);

    const userData = (creator?.key === content?.authorKey) ? {
        ...creator
    } : {
        ...session.user
    }

    return (
        <div className="flex gap-3 items-center">
            <Avatar src={userData?.image?.url} sx={{ width: 24, height: 24, borderRadius: 1000 }} alt={userData?.name} >{userData?.name?.slice(0, 1)}</Avatar>
            <div className="bg-black/10 cursor-pointer dark:bg-white/10 rounded-full h-8 flex items-center px-2.5 py-1 text-sm text-black/60 dark:text-white/60 w-full" onClick={() => form.set({
                show: true,
                text: '',
                action: 'CREATE',
                parentId: null,
            })}>
                Share your thoughts...
            </div>
        </div>
    )

}

const Container = ({ }) => {
    const [rView, setrView] = useState({ show: false, parentId: null })
    const { form, comment } = useContext(CommentContext);

    return (
        <>
            <CommentMetaContext.Provider value={{
                reply: { show: rView.show, parentId: rView.parentId, set: setrView }
            }}>
                <div className={`w-full`}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold franklin">Comments ({comment?.count})</h3>
                    </div>
                    <ActionButton />
                    <div className={`${rView.show ? 'opacity-10' : 'opacity-100'}`}>
                        <CommentsContainer />
                    </div>
                    {(rView.show && rView.parentId) ? <div className="absolute top-0 left-0 bottom-0 h-full w-full bg-light dark:bg-dark">
                        <ReplyContainer />
                    </div> : null}
                </div>
            </CommentMetaContext.Provider>
            {
                form.data.show ? <>
                    <div className="sm:absolute fixed top-0 bottom-0 left-0 w-full h-full">
                        <Backdrop open={form.data.show} onClick={() => {
                            form.set({ ...form.data, show: false })
                        }} sx={{ zIndex: 1, position: 'absolute' }}></Backdrop>
                        <div className="sm:absolute fixed bottom-0 left-0 z-50 w-full h-20 py-1 flex flex-col items-start justify-center bg-lightHead dark:bg-darkHead">
                            {
                                form.data?.action === 'UPDATE' ? <p className="text-xs ml-2 py-0.5">
                                    update: <strong>@{form?.data?.meta?.update?.username}</strong>
                                </p> : null
                            }
                            <WriteField />
                        </div>
                    </div>
                </> : null
            }
        </>
    )
}

const CommentsContainer = () => {
    const { form, state, content, comment } = useContext(CommentContext);

    return (
        <>
            {
                comment.data ?
                    <List>
                        {
                            comment.data.map((item, index) => {
                                return (
                                    <View key={index} item={item} />
                                )
                            })
                        }
                    </List>
                    : null
            }
            {
                state.loading ? <CommentSkeletons count={3} /> : comment.data.length === 0 ?
                    <div className="p-4 h-20 flex justify-center items-center">
                        No Comments found.
                    </div> : null
            }
        </>
    )
}

const ReplyContainer = () => {
    const [replies, setReplies] = useState([]);
    const { form, state, content, comment, re } = useContext(CommentContext);
    const { reply } = useContext(CommentMetaContext);

    const [getReplies, { called, data, loading, error }] = useLazyQuery(re.query);

    useEffect(() => {
        if (content?.key && reply.parentId && !called) {
            getReplies({
                variables: {
                    key: content.key,
                    parent_Id: reply.parentId,
                }
            })
        }
        re.resolver(data, setReplies);
    }, [reply, data, called, content?.key])

    useEffect(() => {
        if (re?.reply && re?.reply?.action && re?.reply?.data) {
            let comment = re?.reply?.data;
            if (re.reply.action === 'UPDATE') {
                let newReplies = replies.map((item) => (item.node.id === comment.id) ? { ...item, node: { ...item.node, ...comment } } : item);
                setReplies(newReplies);
            } else {
                setReplies((prev) => [{ cursor: null, node: res.data, ...prev }])
            }
            re.setReply({
                id: null,
                data: null,
            })
        }
    }, [re?.reply])

    return (
        <>
            <div className="h-14 flex items-center bg-lightHead dark:bg-darkHead gap-3 mb-2 rounded px-2">
                <BackBtn onClick={() => reply?.set({ show: false, parentId: null })} />
                <h3 className="text-base"> Replies </h3>
            </div>
            {
                replies ?
                    <List sx={{
                        px: 1
                    }}>
                        {
                            replies.map((item, index) => {
                                return (
                                    <View key={index} item={item} />
                                )
                            })
                        }
                    </List>
                    : null
            }
            <div className="px-2">
                {
                    (loading || !called) ? <CommentSkeletons count={5} /> : replies.length === 0 ?
                        <div className="p-4 h-20 flex justify-center items-center">
                            No Replies found.
                        </div> : null
                }
            </div>
        </>
    )
}

const View = ({ item }) => {
    let comment = item.node;
    return (
        <>
            <ListItem sx={{
                px: 0,
            }}>
                <Grid2 container direction='column' width="100%">
                    <Grid2 container flexDirection='row' wrap="nowrap" justifyContent='space-between' alignItems='center'>
                        <Grid2 container flexDirection='row' justifyContent='flex-start' alignItems='center' gap={2.3}>
                            {
                                comment?.author ?
                                    <CreatorWrapper keyId={comment?.author?.key}>
                                        <Grid2 container flexDirection='row' gap={1} alignItems='center'>
                                            <Avatar src={comment?.author?.image?.url} sx={{ width: '24px', height: '24px' }} />
                                            <h4 className={`text-sm font-bold dark:text-darkButton text-accentLight`}>{`@${comment.author?.handle}`}</h4>
                                        </Grid2>
                                    </CreatorWrapper> :
                                    <>
                                        <Grid2 container flexDirection='row' gap={1} alignItems='center'>
                                            <Avatar src={comment?.user?.image?.url} sx={{ width: '24px', height: '24px' }} />
                                            <h4 className={`text-sm font-bold dark:text-slate-100 text-gray-900`}>{`@${comment?.user?.username}`}</h4>
                                        </Grid2>
                                    </>
                            }
                            <Tooltip title={<>{new Date(comment?.createdAt).toUTCString()}</>} placement="top" arrow>
                                <time dateTime={comment?.createdAt} className="text-xs font-semibold dark:text-slate-200 text-gray-800">{formatDate(comment?.createdAt)}</time>
                            </Tooltip>
                            {comment?.updatedAt ? (new Date(comment?.createdAt).getTime() !== new Date(comment?.updatedAt).getTime()) ? (
                                <Tooltip title={<>{new Date(comment?.updatedAt).toUTCString()}</>} placement="top" arrow>
                                    <span className="text-xs font-semibold dark:text-slate-200 text-gray-800 cheltenham">( edited )</span>
                                </Tooltip>) : null : null
                            }
                        </Grid2>
                        <Grid2 justifyContent='flex-end'>
                            <MetaMoreMenuView comment={comment} />
                        </Grid2>
                    </Grid2>
                    <Grid2 container direction='column' gap={1} marginLeft={'35px'}>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{comment?.content}</p>
                        <Grid2 container direction='row' gap={2.5}>
                            <MetaView comment={comment} />
                        </Grid2>
                    </Grid2>
                </Grid2>
            </ListItem>
        </>
    )
}

const MetaView = ({ comment }) => {
    const [loading, setLoading] = useState(false);
    const { reply } = useContext(CommentMetaContext);
    const { form, onVote } = useContext(CommentContext);
    const [votes, setVotes] = useState({ me: comment?.myVote, count: comment?.votes })

    const voteAction = async () => {
        if (loading) return null;
        setLoading(true)
        try {
            let res = await onVote(comment?.id);
            setVotes({
                me: res?.me,
                count: res?.count,
            })
        } catch {

        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AnonymousAction >
                <Button
                    disabled={loading}
                    sx={[{ px: 2, height: '28px' }, votes?.count == 0 && { width: '28px', minWidth: '28px', px: 0 }]}
                    onClick={voteAction}
                    size='small'
                    variant='outlined'
                    color='secondary'
                    startIcon={votes?.me ? <FaHandsClapping className="w-3.5 h-3.5" /> : <PiHandsClappingLight className={`w-3.5 h-3.5 ${votes?.count == 0 ? 'ml-2.5' : null} `} />}
                    endIcon={votes?.count == 0 ? null : <span className='!text-xs'>{(votes?.count === null || votes?.count === undefined) ? '--' : votes?.count}</span>}
                />
            </AnonymousAction>
            {comment?.replyCount ? <AnonymousAction >
                <Button
                    sx={[{ px: 2, height: '28px' }]}
                    onClick={() => { reply?.set({ show: true, parentId: comment?.id }) }}
                    size='small'
                    variant='outlined'
                    color='secondary'
                    startIcon={<CommentOutlined className="w-3.5 h-3.5" />}
                    endIcon={<span className='!text-xs'>{comment?.replyCount}</span>}
                />
            </AnonymousAction>
                : null
            }
            <AnonymousAction >
                <Button sx={{ px: 1.5, height: '28px' }} startIcon={<BsReply className="w-4 h-4 -mr-1" />} size='small' variant='outlined' endIcon={<><span className='!text-xs -ml-1'>Reply</span></>} color='secondary' onClick={
                    () => {
                        reply?.set({ show: true, parentId: comment?.id })
                        form.set(
                            {
                                text: '',
                                parentId: comment.id,
                                show: true,
                                action: 'REPLY'
                            }
                        )
                    }
                } />
            </AnonymousAction>
        </>
    )
}

const MetaMoreMenuView = ({ comment }) => {
    const [open, setOpen] = useState(false);
    const [actionLoading, setActiionLoading] = useState(false);

    const { form } = useContext(CommentContext);

    const onEdit = () => {
        if (form.data?.show) return null;
        setOpen(false);
        form.set({
            text: comment?.content,
            show: true,
            action: 'UPDATE',
            commentId: comment?.id,
            meta: {
                update: {
                    username: comment?.author ? comment?.author?.handle : comment?.user?.username,
                }
            }
        })
    }

    const _items = [
        { name: "Edit", icon: Edit, onClick: onEdit },
        { name: "Delete", icon: Delete },
        { name: "Report", icon: Report }
    ]

    return (
        <>
            {actionLoading ?
                <CircularProgress size={16} />
                : <MoreMenuButton options={{
                    button: {
                        onClick: (e) => setOpen(e.currentTarget),
                        variant: 'text',
                    }
                }} />}
            <Menu
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={open}
            >
                {
                    _items.map((e, i) => <MenuListItem
                        item={{ name: e.name, icon: e.icon }}
                        options={{
                            onClick: e?.onClick,
                            helpText: e?.helpText
                        }}
                    />)
                }
            </Menu>
        </>
    )
}

const CommentSkeletons = ({ count }) => {

    return (
        <div className="flex flex-col gap-6">
            {
                new Array(count).fill().map((_, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <Skeleton variant="circular" width={24} height={24} />
                        <div className="flex flex-col grow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Skeleton variant="text" width={100} />
                                    <Skeleton variant="text" width={70} />
                                </div>
                            </div>
                            <div id="comment_body">
                                <Skeleton variant="text" width={'100%'} />
                                {
                                    (((index + 1) % 2) === 0) ? (
                                        <>
                                            <Skeleton variant="text" width={'100%'} />
                                            <Skeleton variant="text" width={'40%'} />
                                        </>
                                    ) : (
                                        <Skeleton variant="text" width={'100%'} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}


export { Container };