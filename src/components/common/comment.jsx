"use comment";
import { useSession } from "next-auth/react";
import { AnonymousAction, MoreMenuButton } from ".";
import { Avatar, Backdrop, Grid2, List, ListItem, Skeleton } from "@mui/material";
import { CommentOutlined, Delete, Edit, Report, SendOutlined } from "@mui/icons-material";
import { useContext, useEffect, useRef, useState } from "react";
import { CommentContext, CommentMetaContext, StudioContext } from "@/lib/context";
import { CreatorWrapper } from "../creator/utils";
import { Button, CircularProgress, IconButton, Tooltip } from "../rui";
import { formatDate } from "@/lib/utils";
import { FaHandsClapping } from "react-icons/fa6";
import { PiHandsClappingLight } from "react-icons/pi";
import { BsReply } from "react-icons/bs";
import { useLazyQuery } from "@apollo/client";
import { BackBtn } from "../Buttons";
import { MenuListItem } from "./client";
import { Menu, TextField } from "@/components/styled";
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
        ...session?.user
    }

    return (
        <AnonymousAction isAnonymous={!session?.user} text={'To participate in the discussion and leave a comment, please ensure that you are logged into your account. Logging in helps us maintain a safe and engaging community environment.'} action={() => { }} >
            <div className={`flex justify-between gap-3 items-start px-3 py-1 w-full`}>
                <Avatar src={userData?.image?.url} sx={{ width: 24, height: 24, borderRadius: 1000 }} alt={userData?.name} >{userData?.name?.slice(0, 1)}</Avatar>
                <TextField
                    required
                    multiline
                    variant="outlined"
                    size="small"
                    maxRows={3}
                    fullWidth
                    autoFocus
                    placeholder="Write a comment..."
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: '8px !important',
                        },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px !important',
                            py: '3.5px !important',
                            fontSize: '0.85rem',
                            lineHeight: '1.12rem'
                        },
                    }}
                    value={form.data.text}
                    onChange={handleCommentChange}
                ></TextField>
                <div className="self-end">
                    {state.sending ?
                        <CircularProgress size={20} /> :
                        <IconButton disabled={form.data.text?.trim()?.length < 1} size="small" onClick={() => onSend()}>
                            <SendOutlined fontSize="small" />
                        </IconButton>}
                </div>
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
        ...session?.user
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
    const [rView, setrView] = useState({ show: false, parentId: null, data: {} })
    const { form, comment } = useContext(CommentContext);
    const lastItemRef = useRef(null);

    return (
        <>
            <CommentMetaContext.Provider value={{
                reply: { show: rView.show, parentId: rView.parentId, comment: rView?.data, set: setrView, lastItemRef: lastItemRef }
            }}>
                <div className={`w-full`}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold franklin">Comments ({comment?.count})</h3>
                    </div>
                    <ActionButton />
                    <div className={`${rView.show ? 'opacity-10' : 'opacity-100'}`}>
                        <CommentsContainer />
                    </div>
                    {(rView.show && rView.parentId) ? <div className="absolute top-0 left-0 bottom-0 h-full w-full bg-light dark:bg-dark overflow-y-auto">
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
                        <div className="sm:absolute fixed bottom-0 left-0 z-50 w-full min-h-14 py-1 flex flex-col items-start justify-center bg-lightHead dark:bg-darkHead">
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
            <span ref={state?.lastItemRef}></span>
        </>
    )
}

const ReplyContainer = () => {
    const [replies, setReplies] = useState({ data: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } });
    const { form, state, content, comment, re } = useContext(CommentContext);
    const { reply } = useContext(CommentMetaContext);

    const [getReplies, { called, data, loading, error, previousData }] = useLazyQuery(re.query);

    useEffect(() => {
        if (content?.key && reply.parentId && !called) {
            getReplies({
                variables: {
                    key: content.key,
                    parent_Id: reply.parentId,
                    orderBy: 'createdAt'
                }
            })
        }
    }, [reply, data, called, content?.key])

    useEffect(() => {
        if (called && !loading && data) {
            let reData = re.resolver(data, setReplies);
            if (reData) {
                if (previousData) {
                    setReplies((prev) => ({ ...prev, data: [...prev.data, ...reData?.data], pageInfo: reData?.pageInfo }))
                } else {
                    setReplies(reData)
                }
            }
        }
    }, [data, loading, called])

    const onNextFetch = () => {
        if (replies?.pageInfo?.hasNextPage) {
            getReplies({
                variables: {
                    key: content.key,
                    parent_Id: reply.parentId,
                    orderBy: 'createdAt',
                    offset: replies?.data?.length,
                }
            });
        }
    }

    useEffect(() => {
        if (re?.reply && re?.reply?.action && re?.reply?.data) {
            let comment = re?.reply?.data;
            if (re.reply.action === 'UPDATE') {
                let newReplies = replies.data.map((item) => (item.node.id === comment.id) ? { ...item, node: { ...item.node, ...comment } } : item);
                setReplies((prev) => ({ ...prev, data: newReplies }))
            } else {
                setReplies((prev) => ({ ...prev, data: [...prev.data, { node: re?.reply?.data }] }))
            }
        };
    }, [re?.reply])

    return (
        <>
            <div className="h-14 flex items-center bg-lightHead dark:bg-darkHead gap-3 mb-2 rounded px-2">
                <BackBtn onClick={() => reply?.set({ show: false, parentId: null, data: {} })} />
                <h3 className="text-base"> Replies </h3>
            </div>
            <div className="bg-lightHead/30 dark:bg-darkHead/30 px-2">
                <View item={{ node: reply?.comment }} />
            </div>
            <div className="ml-5">
                {
                    replies ?
                        <List sx={{
                            px: 1
                        }}>
                            {
                                replies?.data?.map((item, index) => {
                                    return (
                                        <View key={index} item={item} />
                                    )
                                })
                            }
                        </List>
                        : null
                }
            </div>
            <div className="px-2">
                {
                    (loading) ? <CommentSkeletons count={5} /> : replies?.data?.length === 0 ?
                        <div className="p-4 h-20 flex justify-center items-center">
                            No Replies found.
                        </div> : replies?.data?.length > 0 && replies?.pageInfo?.hasNextPage ? <div className="p-4 flex justify-center items-center">
                            <Button onClick={onNextFetch} variant="outlined" color="secondary" size="small">Load More</Button>
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
                    onClick={() => { reply?.set({ show: true, parentId: comment?.id, data: comment }) }}
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
                        reply?.set({ show: true, parentId: reply?.parentId ? reply?.parentId : comment?.id, data: reply?.comment?.id ? reply?.comment : comment })
                        form.set(
                            {
                                text: '',
                                parentId: reply?.parentId ? reply?.parentId : comment?.id,
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
    const { data: session } = useSession();
    const { form } = useContext(CommentContext);
    const { reply } = useContext(CommentMetaContext);
    const { creator } = useContext(StudioContext);

    const onEdit = () => {
        if (form.data?.show) return null;
        setOpen(false);
        form.set({
            text: comment?.content,
            show: true,
            action: 'UPDATE',
            commentId: comment?.id,
            parentId: reply?.parentId ? reply?.parentId : null,
            meta: {
                update: {
                    username: comment?.author ? comment?.author?.handle : comment?.user?.username,
                    comment: comment
                }
            }
        })
    }

    const _aItems = [
        { name: "Edit", icon: Edit, onClick: onEdit },
        { name: "Delete", icon: Delete },
    ]

    const _items = [
        ...(comment?.author ? comment?.author?.key === creator?.key ? _aItems : [] : comment?.user?.key === session?.user?.key ? _aItems : []),
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