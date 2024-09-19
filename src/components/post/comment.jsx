"use client";
import { imageUrl } from "@/lib/helpers";
import { useContext, useEffect, useState, createContext, useMemo } from "react";
import { formatDate } from "@/lib/utils";
import { UnAuthorizedActionWrapper } from "./postActions";
import { Avatar, ListItemIcon, Skeleton } from "@mui/material";
import { Button, IconButton, Menu, MenuItem, TextField, Tooltip } from "../rui";
import { MoreVert } from "@mui/icons-material";
import { articleCommentAction, articleCommentClapAction, articleCommentDeleteAction, articleCommentRepliesListAction, articleCommentsListAction } from "@/lib/actions/author";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { PiHandsClappingLight } from "react-icons/pi";
import { BsReply } from "react-icons/bs";
import { MdChevronRight, MdOutlineDeleteOutline, MdOutlineEdit, MdOutlineReport } from "react-icons/md";
import { FaHandsClapping } from "react-icons/fa6";
import confirm from "@/lib/confirm";
import { StudioContext } from "@/lib/context";
import { useRouter } from "next/navigation";


const CommentContext = createContext();


export const CommentsView = ({ articleId, article, contentAuthor }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const { data } = useContext(StudioContext);

    useMemo(() => {
        setLoading(true);
        articleCommentsListAction(articleId).then(res => {
            if (res?.status === 200) {
                setComments(res?.data);
                setLoading(false);
            }
        });
    }, [articleId]);

    const handleAddReply = async (commentId, reply) => {
        if (!session?.user || !reply || (reply === '')) return;
        let aId = (data?.data?.id === article?.author?.id) ? data?.data?.id : null
        const res = await articleCommentAction({ postId: articleId, body: reply, parentId: commentId, ...(aId && { authorId: aId }) })
        if (res?.status === 200) {
            let newComments = comments.map(comment => {
                if (comment.id === commentId) {
                    comment = res?.data?.parent;
                    return comment;
                }
                return comment;
            });
            setComments(newComments);
        }
    };

    const handleAddComment = async (comment) => {
        if (!session?.user || !comment || (comment === '')) return;
        let aId = (data?.data?.id === article?.author?.id) ? data?.data?.id : null
        const res = await articleCommentAction({ postId: articleId, body: comment, ...(aId && { authorId: aId }) })
        if (res?.status === 200) {
            if (res.status === 200) {
                let newRes = await articleCommentsListAction(articleId)
                if (newRes?.status === 200) {
                    setComments(newRes?.data);
                }
            }
        }
    };

    const handleUpdateComment = async (comment, commentId) => {
        if (!session?.user || !comment || (comment === '')) return;
        const res = await articleCommentAction({ id: commentId, body: comment });
        if (res?.status === 200) {
            setComments((comments) => {
                return comments.map((c) => {
                    if (c.id === commentId) {
                        return { ...c, ...res?.data };
                    }
                    return c;
                });
            });
        }
    }

    const handleDeleteComment = async (id) => {
        if (!session?.user) return;
        const res = await articleCommentDeleteAction({ id: id }, 'delete');
        if (res?.status === 200) {
            let newComments = comments?.filter(comment => comment.id !== commentId);
            setComments(newComments);
        }
    }

    const onAddComment = async (comment, isReply = false, parentId = null, toUpdate = false, commentId = null) => {
        if (toUpdate) {
            handleUpdateComment(comment, commentId);
        } else {
            if (isReply) {
                handleAddComment(comment);
            } else {
                handleAddReply(parentId, comment);
            }
        }
    }

    const contextData = {
        contentAuthor: contentAuthor || article?.author,
        onAddComment: onAddComment,
        user: session?.user,
        onClap: articleCommentClapAction,
        handleUpdate: handleUpdateComment,
        handleDelete: handleDeleteComment,
        commentState: { comments, setComments },
        getReplies: articleCommentRepliesListAction
    }

    return (
        <>
            <section aria-labelledby="comments">
                <CommentContext.Provider value={contextData} >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold mb-2">Comments</h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-300">{comments?.length}</span>
                        </div>
                    </div>
                    <CommentForm />
                    {loading ? (
                        <CommentsLoader count={3} />
                    ) : (comments.length > 0) ? (
                        comments?.map((comment, index) => {
                            return (
                                <div key={index} className="mb-2">
                                    <CommentView comment={comment} parentId={comment?.id} />
                                </div>
                            );
                        })
                    ) :
                        <div className="text-sm text-center text-gray-500 dark:text-gray-300 my-4">No Comments Found</div>
                    }
                </CommentContext.Provider>
            </section>
        </>
    );
};

const CommentView = ({ comment, parentId }) => {
    const { user, handleUpdate, handleDelete, commentState } = useContext(CommentContext);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    const commentId = comment?.id;

    let options = { width: 40, height: 40, crop: 'fill', gravity: 'face' }
    let author = comment?.author ? comment?.author : comment?.user;
    const avatar = imageUrl(author?.image?.url, author?.image?.provider || 'cloudinary', options);
    const username = comment?.author ? author?.handle : comment?.user?.username;

    return (
        !showForm ? (
            <div className="flex items-start space-x-4 ">
                <Avatar onClick={comment?.author ? () => router.push(`/@${username}`) : null} src={avatar} sx={{ width: 24, height: 24, borderRadius: 1000 }} alt={`@${username}`} >{username.slice(0, 1)}</Avatar>
                <div className="flex flex-col grow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h4 onClick={comment?.author ? () => router.push(`/@${username}`) : null} className={`text-sm font-bold ${comment?.author ? 'dark:text-accentDark text-accentLight' : 'dark:text-slate-100 text-gray-900'}`}>{`@${username}`}</h4>
                            {/* <Link href={"#"}> */}
                            <Tooltip title={<>{new Date(comment?.createdAt).toUTCString()}</>} placement="top" arrow>
                                <time dateTime={comment?.createdAt} className="text-xs font-semibold dark:text-slate-200 text-gray-800">{formatDate(comment?.createdAt)}</time>
                            </Tooltip>
                            {/* </Link> */}
                            {
                                new Date(comment?.createdAt).getTime() !== new Date(comment?.updatedAt).getTime() && (
                                    <Tooltip title={<>{new Date(comment?.updatedAt).toUTCString()}</>} placement="top" arrow>
                                        <span className="text-xs font-semibold dark:text-slate-200 text-gray-800 cheltenham">( edited )</span>
                                    </Tooltip>
                                )
                            }
                        </div>
                        {user ? <CommentMenu id={comment?.id} commentAuthor={comment?.author?.id} isOwn={comment?.user?.id === user?.id} onEdit={() => setShowForm(true)} /> : null}
                    </div>
                    <div id="comment_body">
                        <p className="text-sm text-gray-500 dark:text-gray-300">{comment?.content}</p>
                    </div>
                    <div id="comment_button_control">
                        <CommentBottomControl claps={comment?.claps} clapsCount={comment?._count?.claps} commentId={comment.id} parentId={parentId} />
                    </div>
                    {(comment?._count?.replies && (comment?._count?.replies > 0)) ? (
                        <div className="mt-1">
                            <BottomControlReplies commentId={comment.id} parentId={parentId} count={comment?._count?.replies || 0} />
                        </div>
                    ) : null}
                </div>
            </div>) : (
            <CommentFormField showButtons={true} setShowButtons={setShowForm} commentText={comment?.content} toUpdate={true} commentId={commentId} />
        )
    )
}

const CommentMenu = ({ id, commentAuthor, isOwn, onEdit }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data } = useContext(StudioContext);
    const { onDelete, onUpdate, contentAuthor } = useContext(CommentContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        try {
            if (await confirm('Are you sure you want to delete this comment?', { okLabel: 'Yes', cancelLabel: 'No' })) {
                setIsLoading(true);
                try {
                    await onDelete(id);
                    toast.success('Comment deleted successfully');
                } catch (error) {
                    console.error(error);
                    toast.error('Failed to delete comment');
                } finally {
                    setIsLoading(false);
                    setAnchorEl(null);
                }
            } else null;
        } catch { }
    }

    return (
        <>
            <div className={` w-8`}>
                <span onClick={handleClick}>
                    {isLoading ? <BetaLoader /> :
                        <IconButton size='small' sx={{ width: '24px', height: '24px', p: 0 }} >
                            <MoreVert className="w-4 h-4" />
                        </IconButton>
                    }
                </span>
            </div>
            {open && (
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'comment-menu',
                    }}
                    sx={{ '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '128px' } }} >
                    {
                        (commentAuthor ? (commentAuthor === data?.data?.id) && isOwn : isOwn) ? (
                            [
                                <MenuItem key="___1" onClick={onEdit}>
                                    <ListItemIcon >
                                        <MdOutlineEdit className='w-5 h-5' />
                                    </ListItemIcon>
                                    Edit
                                </MenuItem>,
                                <MenuItem key="___2" onClick={handleDelete}>
                                    <ListItemIcon >
                                        <MdOutlineDeleteOutline className='w-5 h-5' />
                                    </ListItemIcon>
                                    Delete
                                </MenuItem>
                            ]
                        ) : (
                            <MenuItem>
                                <ListItemIcon >
                                    <MdOutlineReport className='w-5 h-5' />
                                </ListItemIcon>
                                Report
                            </MenuItem>
                        )
                    }
                </Menu>
            )}
        </>
    )
}

const CommentForm = () => {
    const [showButtons, setShowButtons] = useState(false);

    return (
        <div className="mt-4 mb-4">
            <CommentFormField
                showButtons={showButtons}
                setShowButtons={setShowButtons}
                isMc
            />
        </div>
    );
};

const CommentFormField = ({ showButtons, setShowButtons, isMc, parentId, commentText, toUpdate, commentId }) => {
    const [comment, setComment] = useState(commentText || '');
    const [isPosting, setIsPosting] = useState(false);
    const { data } = useContext(StudioContext);
    const { contentAuthor, onAddComment, user } = useContext(CommentContext);

    const handleCancle = () => {
        setShowButtons(false);
        setComment('');
    };

    const handleCommentSubmit = async () => {
        setIsPosting(true);
        try {
            onAddComment(comment, !!!parentId, parentId, toUpdate, commentId);
            setShowButtons(false);
            setComment('');
        }
        catch (error) {
            console.error(error);
            toast.error('Failed to add comment');
        }
        finally {
            setIsPosting(false);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const currentUser = (data?.data?.id === contentAuthor?.id) ? {
        id: data?.data?.id,
        username: data?.data?.handle,
        image: data?.data?.image,
    } : {
        id: user?.id,
        username: user?.username,
        image: user?.image
    }

    return (user ? <div className="">
        <div className={`flex justify-between space-x-4 mb-3 ${!showButtons && 'items-center'}`}>
            <Avatar src={currentUser?.image} sx={{ width: (showButtons && isMc) ? 30 : 24, height: (showButtons && isMc) ? 30 : 24, borderRadius: 1000 }} alt={currentUser?.username} >{currentUser?.username?.slice(0, 1)}</Avatar>
            <TextField
                required
                onClick={() => { setShowButtons(true) }}
                multiline
                variant="standard"
                size="small"
                fullWidth
                autoFocus={showButtons}
                placeholder="Add a comment"
                sx={[
                    !showButtons && { height: '30px', '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '0.8', height: '30px', padding: '0px' } },
                    !isMc && { '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '1', height: '30px', padding: '0px' } }
                ]}
                value={comment}
                onChange={handleCommentChange}
                className="text-sm"
            ></TextField>
        </div>
        {showButtons && <div className="flex items-center justify-end space-x-4">
            {isPosting && <BetaLoader />}
            <Button disabled={isPosting} size="small" onClick={handleCancle} variant="outlined" color="primary">
                Cancle
            </Button>
            <Button size="small" className={!(comment?.length === 0 || isPosting) ? "text-white dark:text-black" : ''} disabled={comment?.length === 0 || isPosting} onClick={handleCommentSubmit} variant="contained" color="button">
                {toReply ? 'Reply' : commentText ? 'Update' : 'Comment'}
            </Button>
        </div>}
    </div> : <UnAuthorizedActionWrapper description={'To participate in the discussion and leave a comment, please ensure that you are logged into your account. Logging in helps us maintain a safe and engaging community environment.'} link={'#'} >
        <div className={`flex justify-between space-x-4 mb-3 ${!showButtons && 'items-center'}`}>
            <Avatar sx={{ width: (showButtons && isMc) ? 30 : 24, height: (showButtons && isMc) ? 30 : 24, borderRadius: 1000 }} alt={'User Image'} />
            <TextField
                required
                multiline
                variant="standard"
                size="small"
                fullWidth
                readOnly
                placeholder="Add a comment"
                sx={[
                    !showButtons && { height: '30px', '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '0.8', height: '30px', padding: '0px' } },
                    !isMc && { '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '1', height: '30px', padding: '0px' } }
                ]}
                value={''}
                className="text-sm"
            ></TextField>
        </div>
    </UnAuthorizedActionWrapper>);
}

const CommentBottomControl = ({ commentId, parentId, claps, clapsCount }) => {
    const { contentAuthor, onClap, user } = useContext(CommentContext);
    const [showForm, setShowForm] = useState(false);
    const [isClapped, setIsClapped] = useState({ is: false, commentId: null, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const [ClapsCount, setClapsCount] = useState(clapsCount);

    useEffect(() => {
        setTimeout(() => {
            if (user) {
                let clapped = claps?.find(clap => clap?.user?.id === user?.id);
                if (clapped) {
                    setIsClapped({ is: true, commentId: commentId, id: clapped?.id });
                }
            }
            setClapsCount(clapsCount);
        }, 1000);
    }, [claps, clapsCount]);

    const handleClap = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            if (isClapped.is && isClapped.id) {
                let res = await onClap({ id: isClapped.id }, 'delete');
                if (res?.status === 200) {
                    setIsClapped({ is: false, commentId: null, id: null });
                    setClapsCount(ClapsCount - 1);
                }
            } else {
                let res = await onClap({ id: commentId }, 'create');
                if (res?.status === 200) {
                    let clapped = res?.data;
                    if (clapped) {
                        setIsClapped({ is: true, commentId: commentId, id: clapped?.id });
                        setClapsCount(ClapsCount + 1);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to clap');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-2">
            <div className="flex items-center justify-start space-x-4 mt-1">
                {user ?
                    <>
                        <Button disabled={isLoading} sx={{ px: 1.5, height: '28px' }} onClick={handleClap} size='small' variant='outlined' color='secondary' startIcon={isClapped?.is ? <FaHandsClapping className="w-4 h-4 dark:fill-darkButton fill-accentLight" /> : <PiHandsClappingLight className={`w-4 h-4 ${(ClapsCount === 0) ? 'ml-2.5' : ''}`} />} endIcon={(ClapsCount === 0) ? null : <span className='!text-xs'>{(ClapsCount === null || ClapsCount === undefined) ? '--' : ClapsCount}</span>} />
                        <Button onClick={() => setShowForm(true)} sx={{ px: 1.5, height: '28px' }} startIcon={<BsReply className="w-4 h-4 -mr-1" />} size='small' variant='outlined' endIcon={<><span className='!text-xs -ml-1'>Reply</span></>} color='secondary' />
                    </>
                    :
                    <>
                        <UnAuthorizedActionWrapper description={'You need to be logged in to clap the comment'} >
                            <Button sx={{ px: 1.5, height: '28px' }} size='small' variant='outlined' color='secondary' startIcon={<PiHandsClappingLight className={`w-4 h-4 ${(ClapsCount === 0) ? 'ml-2.5' : ''}`} />} endIcon={(ClapsCount === 0) ? null : <span className='!text-xs'>{(ClapsCount === null || ClapsCount === undefined) ? '--' : ClapsCount}</span>} />
                        </UnAuthorizedActionWrapper>
                        <UnAuthorizedActionWrapper description={'You need to be logged in to reply the comment'} >
                            <Button sx={{ px: 1.5, height: '28px' }} startIcon={<BsReply className="w-4 h-4 -mr-1" />} size='small' variant='outlined' endIcon={<><span className='!text-xs -ml-1'>Reply</span></>} color='secondary' />
                        </UnAuthorizedActionWrapper>
                    </>
                }
            </div>
            {showForm && <div className="mt-1">
                <CommentFormField showButtons={true} setShowButtons={setShowForm} parentId={parentId} />
            </div>}
        </div>
    );
};

const BottomControlReplies = ({ commentId, parentId, count }) => {
    const [showReplies, setShowReplies] = useState(false);

    return (
        <>
            <Button onClick={() => { setShowReplies(!showReplies) }} sx={{ px: 2, height: '32px' }} startIcon={<MdChevronRight className={`w-6 h-6 transition-all duration-300 ${showReplies ? '-rotate-90' : 'rotate-90'}`} />} size='small' variant='text' endIcon={<><span className='!text-sm -ml-1'>{count} Replies</span></>} color='button' />

            {showReplies && <div className="mt-2">
                <RepliesView commentId={commentId} parentId={parentId} count={count} />
            </div>
            }
        </>
    )
}

const RepliesView = ({ commentId, parentId, count }) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getReplies, commentState } = useContext(CommentContext);

    useMemo(async () => {
        try {
            setLoading(true);
            let res = await getReplies(commentId);
            if (res?.status === 200) {
                setReplies(res?.data);
                let newComments = commentState?.comments?.map(comment => {
                    return comment.id === commentId ? comment.replyData = res?.data : comment;
                })
                commentState?.setComments(newComments);
            }
        }
        finally {
            setLoading(false);
        };
    }, [commentId, count]);

    return (
        <>
            {!loading ? (replies ? replies.map((reply, index) => {
                return (
                    <div key={index} className="mb-2">
                        <CommentView comment={reply} parentId={parentId} />
                    </div>
                );
            }) : <div className="text-sm text-gray-500 dark:text-gray-300">No replies found</div>) :
                <CommentsLoader count={(count >= 10) ? 10 : count} />
            }
        </>
    )
}

const BetaLoader = () => {
    return (
        <div className="flex items-center justify-center">
            <span className="animate-spin flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-darkHead dark:bg-lightHead opacity-75"></span>
                <span className="relative animate-bounce to-lightHead from-pink-300 dark:to-darkHead dark:from-blue-200 inline-flex rounded-full h-5 w-5 bg-gradient-radial"></span>
            </span>
        </div>
    )
}

const CommentsLoader = ({ count }) => {

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
