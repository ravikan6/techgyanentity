"use client";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext, useMemo, useRef, Suspense } from "react";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions, UnAuthorizedActionWrapper } from "./postActions";
import { Avatar, ListItemIcon, MenuList, Skeleton, styled, useMediaQuery } from "@mui/material";
import { Button, IconButton, Menu, MenuItem, TextField, Tooltip, SwipeableDrawer } from "../rui";
import { EmailRounded, MoreVert } from "@mui/icons-material";
import { LuUser } from "react-icons/lu";
import { createPortal } from 'react-dom';
import { AuthorTipWrapper, FollowButton } from "../author/utils";
import { articleCommentAction, articleCommentClapAction, articleCommentDeleteAction, articleCommentRepliesListAction, articleCommentsListAction } from "@/lib/actions/author";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { PiHandsClappingLight } from "react-icons/pi";
import { BsReply } from "react-icons/bs";
import { MdChevronRight, MdOutlineDeleteOutline, MdOutlineEdit, MdOutlineReport } from "react-icons/md";
import { FaHandsClapping } from "react-icons/fa6";
import confirm from "@/lib/confirm";
import { StudioContext } from "@/lib/context";
import { imgUrl } from "@/lib/helpers";
import { AuthorAvatar } from "../author/_client";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

export const ArticleImage = ({ image, classes, height, width, className, style }) => {
    return <CldImage
        draggable={false}
        src={imgUrl(image?.url)}
        alt={image?.alt}
        width={width || 720}
        height={height || 405}
        aspectRatio="16:9"
        sizes="100vw"
        loading='lazy'
        enhance
        crop={'fill'}
        sanitize
        className={`rounded-2xl aspect-video h-auto ${classes} ${className}`}
        style={style}
    />
}

export const Puller = styled('div')(({ theme }) => ({
    width: 40,
    height: 5,
    backgroundColor: theme.palette?.accent?.main,
    borderRadius: 3,
    position: 'absolute',
    top: 4,
    left: 'calc(50% - 20px)',

}));

const SidebarContext = createContext();

export const ArticleSidebar = ({ article }) => {
    let width = useMediaQuery('(min-width:1024px)');
    const [open, setOpen] = useState(false);

    return (
        <>
            <SidebarContext.Provider value={{ open, setOpen }}>
                <div className={`overflow-hidden mr-1 lg:block relative w-[400px]`}>
                    <div className={`fixed h-[calc(100%-66px)] mr-1 max-w-[410px] overflow-hidden z-[998]  rounded-xl border dark:border-slate-600 border-gray-300 w-full mt-[64px] top-0 bottom-0`}>
                        {width ? <section id="rb_sidebar_comp" className="relative h-full overflow-hidden">
                            <SidebarContent article={article} />
                        </section> :
                            <div className="flex flex-col w-full p-2">
                                <Skeleton className="mb-4" variant="rounded" height={200} />
                                <Skeleton variant="text" height={40} />
                                <Skeleton variant="text" height={40} width={'80%'} />
                                <Skeleton variant="text" height={40} width={'30%'} />
                            </div>
                        }
                    </div>
                </div>

            </SidebarContext.Provider>
        </>
    );
}


const SidebarContent = ({ article }) => {
    const publishedAt = getDate(article?.createdAt);
    const updatedAt = getDate(article?.updatedAt);
    const { open, setOpen } = useContext(SidebarContext);

    const handleDescription = () => {
        setOpen(true);
    }
    return (
        <>
            <div className="h-full p-4 overflow-x-hidden">
                <ArticleTop article={article} onClick={handleDescription} />
                <div className="mb-2">
                    <div className="mb-4">
                        <ArticleAuthor article={article} />
                        <PostActions id={article.id} commentCount={article?._count?.comments} isExpanded article={article} />
                    </div>
                </div>
                <ArticleComments articleId={article.id} article={article} />
            </div>
            <Description article={article} publishedAt={publishedAt} updatedAt={updatedAt} open={open} setOpen={setOpen} />
        </>
    );
};

const Description = ({ article, open, setOpen }) => {

    return (
        <>
            <SwipeableDrawer disableSwipeToOpen
                height="100%"
                sx={{ height: '100%' }}
                transitionDuration={1}
                ModalProps={{
                    style: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 },
                    disablePortal: true,
                }} anchor="bottom" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                <DescriptionContent article={article} onClose={() => setOpen(false)} />
            </SwipeableDrawer>
        </>
    );
}

const DescriptionContent = ({ article, onClose }) => {
    return (
        <>
            <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-bold ">
                    About
                </h2>
            </div>
            <div className="py-2 overflow-x-hidde pb-14">
                <div className="">
                    <h1 className="text-xl mb-3 font-bold">{article.title}</h1>
                    <div className="flex space-x-1 items-center justify-around font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                        <div className={`flex flex-col items-center justify-center`}>
                            <span className="mb-0.5 cheltenham">233</span>
                            <span>views</span>
                        </div>
                        <Tooltip title="average read time" placement="top" arrow>
                            <div className={`flex flex-col items-center justify-center`}>
                                <span className="mb-0.5 cheltenham">{'2 min'}</span>
                                <span>read</span>
                            </div>
                        </Tooltip>
                        <PostDatePublished date={article?.createdAt} expanded />
                    </div>
                </div>
                {article?.description && <div className="my-4">
                    <h4 className="text-sm mx-1 bg-lightHead dark:bg-darkHead p-3 rounded-md font-medium dark:text-gray-300 text-gray-700">{article.description}</h4>
                </div>}
                <div className="flex justify-between items-center mb-5 border-y-slate-500">
                    <div className="flex items-center py-1">
                        <div className="flex-shrink-0">
                            <Avatar src={article?.author?.image?.url} sx={{ width: 50, height: 50, borderRadius: 1000 }} alt={article?.author?.name} >{article?.author?.name.slice(0, 1)}</Avatar>
                        </div>
                        <div className="flex flex-col justify-around ml-2">
                            <p className="text-base karnak mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                {article?.author?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                2k followers
                            </p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-scroll w-full mt-2">
                    <div className="flex items-center py-3 space-x-4 w-fit flex-row flex-nowrap justify-start">
                        <FollowButton authorId={article?.author?.id} />
                        <Button variant="outlined" sx={{ px: 2 }} color="button" startIcon={<LuUser className="w-4 h-4 mr-1" />} size="small" >About</Button>
                        <Button variant="outlined" sx={{ px: 2 }} color="button" startIcon={<EmailRounded className="w-4 h-4 mr-1" />} size="small" >Contact</Button>
                        {
                            article?.author?.social && article?.author?.social?.map((social, index) => (
                                <Button key={index} variant="outlined" sx={{ px: 2 }} color="button" startIcon={<LuUser className="w-4 h-4 mr-1" />} size="small" >{social?.title}</Button>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export const PostDatePublished = ({ date, expanded }) => {

    return (
        <>
            <Tooltip title={<>{new Date(date).toLocaleString()}</>} placement="top" arrow>
                <div className={`flex flex-col items-center justify-center`}>
                    {expanded && <span className="mb-0.5 cheltenham">{new Date(date).getFullYear()}</span>}
                    <time dateTime={date}>{formatDate(date)}</time>
                </div>
            </Tooltip>
        </>
    )
}

const ArticleAuthor = ({ article }) => {
    return (
        <>
            <div className="flex justify-between hover:bg-black/10 dark:hover:bg-white/10 py-1 px-1 rounded-md space-x-2 items-center mb-5 border-y-slate-500">
                <div className="flex items-center py-1">
                    <Link href={`/@${article?.author?.handle}`} className="">
                        <div className="flex items-center cursor-pointer gap-3">
                            <AuthorTipWrapper shortId={article?.author?.shortId} >
                                <AuthorAvatar data={{ url: article?.author?.image?.url }} sx={{ width: 40, height: 40, borderRadius: 1000 }} />
                            </AuthorTipWrapper>
                            <div className="flex flex-col justify-around">
                                <AuthorTipWrapper shortId={article?.author?.shortId} >
                                    <p className="text-sm cheltenham-small mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                        {article?.author?.name}
                                    </p>
                                </AuthorTipWrapper>
                                <p className="text-xs text-gray-500 dark:text-gray-300">
                                    {article?.author?._count?.followers} Followers
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <IconButton className="bg-light dark:bg-dark" size="small" color="accent" >
                        <EmailRounded className="w-4 h-4" />
                    </IconButton>
                    <FollowButton authorId={article?.author?.id} />
                </div>
            </div>
        </>
    )
}

export const ArticleTop = ({ article, onClick = () => { }, hSize = 'text-xl' }) => {

    return (
        <>
            <div onClick={onClick} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer duration-500 mb-4 rounded-xl py-1 px-2">
                <h1 className={`karnak mb-1.5 font-bold ${hSize}`}>{article.title}</h1>
                <div className="flex space-x-1 items-center justify-between font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                    <div>233 views</div>
                    <div>
                        {'2 min'} read
                    </div>
                    <PostDatePublished date={article?.createdAt} />
                </div>
                <h4 className="text-sm line-clamp-2 text-ellipsis font-medium dark:text-gray-300 text-gray-700">{article?.description?.slice(0, 150)}</h4>
            </div>
        </>
    )

}

export const ArticleTopMeta = ({ article }) => {
    const [metaContent, setMetaContent] = useState(null);
    const [drawable, setDrawable] = useState(false);

    let belowWidth = useMediaQuery('(max-width:1024px)');

    useEffect(() => {
        if (belowWidth) {
            let meta_container = document.getElementById('article_topMeta');
            if (meta_container) {
                while (meta_container.firstChild) {
                    meta_container.firstChild.remove();

                }
                setMetaContent(meta_container);
            }
        } else setMetaContent(null);
    }, [belowWidth]);

    return (
        <>
            <div className="">
                <div className="pb-4 lg:hidden pt-4">
                    <ArticleTop article={article} onClick={() => setDrawable(!drawable)} hSize="text-xl sm:text-2xl md:text-3xl" />
                    {metaContent &&
                        createPortal(<div>
                            <ArticleAuthor article={article} />
                            <PostActions modern id={article.id} commentCount={article?._count?.comments} className="px-1" article={article} />
                            <SwipeableDrawer minFlingVelocity={500} disableSwipeToOpen={false}
                                swipeAreaWidth={40}
                                sx={{ height: '100%' }}
                                container={document.body}
                                slotProps={{
                                    root: {
                                        style: {
                                            height: '100%',
                                            borderRadius: '20px 20px 0 0'
                                        }
                                    }
                                }}
                                ModalProps={{
                                    keepMounted: true,
                                }} anchor="bottom" open={drawable} onClose={() => setDrawable(false)} onOpen={() => setDrawable(true)}>
                                <DescriptionContent article={article} onClose={() => setDrawable(false)} />
                            </SwipeableDrawer>
                        </div>, metaContent)
                    }
                </div>
            </div>
        </>
    )
}

export const ArticleComments = ({ articleId, article }) => {
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
        const res = await articleCommentAction({ postId: articleId, body: reply, parentId: commentId, ...aId && { authorId: aId } })
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
        const res = await articleCommentAction({ postId: articleId, body: comment, ...aId && { authorId: aId } })
        if (res?.status === 200) {
            if (res.status === 200) {
                let newRes = await articleCommentsListAction(articleId)
                if (newRes?.status === 200) {
                    setComments(newRes?.data);
                }
            }
        }
    };

    return (
        <>
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-300">{comments?.length}</span>
                    </div>
                </div>
                <CommentForm onAddComment={handleAddComment} article={article} />
                {loading ? (
                    <CommentsLoader count={3} />
                ) : (
                    comments?.map((comment, index) => {
                        return (
                            <div key={index} className="mb-2">
                                <CommentView comment={comment} toReplay={comment?.id} articleId={articleId} handleAddReply={handleAddReply} commentState={{ comments, setComments }} article={article} />
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
};

const CommentView = ({ comment, handleAddReply, toReplay, commentState, article }) => {
    const { data: session } = useSession();
    const [showForm, setShowForm] = useState(false);
    const commentId = comment?.id;

    const router = useRouter();

    const handleUpdateComment = async (comment) => {
        if (!session?.user || !comment || (comment === '')) return;
        const res = await articleCommentAction({ id: commentId, body: comment });
        if (res?.status === 200) {
            commentState?.setComments((comments) => {
                return comments.map((c) => {
                    if (c.id === commentId) {
                        return { ...c, ...res?.data };
                    }
                    return c;
                });
            });
        }
    }

    const handleDeleteComment = async () => {
        if (!session?.user) return;
        const res = await articleCommentDeleteAction({ id: commentId }, 'delete');
        if (res?.status === 200) {
            let newComments = commentState?.comments?.filter(comment => comment.id !== commentId);
            commentState?.setComments(newComments);
        }
    }

    let options = { width: 40, height: 40, crop: 'fill', gravity: 'face' }
    const avatar = comment?.author ? (comment?.author?.image?.url && getCldImageUrl({ src: comment?.author?.image?.url, ...options })) : (comment?.user?.image?.url && getCldImageUrl({ src: comment?.user?.image?.url, ...options }));
    const username = comment?.author ? comment?.author?.handle : comment?.user?.username;

    return (
        !showForm ? (
            <div className="flex items-start space-x-4 ">
                <span onClick={comment?.author ? router.push(`/@${username}`) : null}>
                    <Avatar src={avatar} sx={{ width: 24, height: 24, borderRadius: 1000 }} alt={`@${username}`} >{username.slice(0, 1)}</Avatar>
                </span>
                <div className="flex flex-col grow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h4 onClick={comment?.author ? router.push(`/@${username}`) : null} className={`text-sm font-bold ${comment?.author ? 'dark:text-accentDark text-accentLight' : 'dark:text-slate-100 text-gray-900'}`}>{`@${username}`}</h4>
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
                        {session?.user ? <CommentMenu id={comment?.id} onEdit={() => setShowForm(true)} onDelete={handleDeleteComment} isOwn={session?.user?.id === comment?.user?.id} authorId={comment?.author?.id} /> : null}
                    </div>
                    <div id="comment_body">
                        <p className="text-sm text-gray-500 dark:text-gray-300">{comment?.content}</p>
                    </div>
                    <div id="comment_button_control">
                        <CommentBottomControl claps={comment?.claps} clapsCount={comment?._count?.claps} commentId={comment.id} toReplay={toReplay} onAddReply={handleAddReply} count={comment?._count?.replies || 0} article={article} />
                    </div>
                    {(comment?._count?.replies && (comment?._count?.replies > 0)) ? (
                        <div className="mt-1">
                            <BottomControlReplies commentId={comment.id} toReplay={toReplay} onAddReply={handleAddReply} count={comment?._count?.replies || 0} commentState={commentState} article={article} />
                        </div>
                    ) : null}
                </div>
            </div>) : (
            <CommentFormField article={article} showButtons={true} setShowButtons={setShowForm} commentText={comment?.content} onSubmit={handleUpdateComment} />
        )
    )
}

const CommentMenu = ({ id, isOwn, onEdit, onDelete, authorId }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data } = useContext(StudioContext);

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
                    await onDelete();
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
                        (authorId ? (authorId === data?.data?.id) && isOwn : isOwn) ? (
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

const CommentForm = ({ onAddComment, article }) => {
    const [showButtons, setShowButtons] = useState(false);

    return (
        <div className="mt-4 mb-4">
            <CommentFormField
                showButtons={showButtons}
                setShowButtons={setShowButtons}
                isMc
                onSubmit={onAddComment}
                article={article}
            />
        </div>
    );
};

const CommentFormField = ({ article, showButtons, setShowButtons, isMc, onSubmit, toReply, commentText }) => {
    const [comment, setComment] = useState(commentText || '');
    const [isPosting, setIsPosting] = useState(false);
    const { data: session } = useSession();
    const { data } = useContext(StudioContext);

    const handleCancle = () => {
        setShowButtons(false);
        setComment('');
    };

    const handleCommentSubmit = async () => {
        setIsPosting(true);
        try {
            if (toReply) {
                await onSubmit(toReply, comment);
            } else {
                await onSubmit(comment);
            }
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

    const currentUser = (data?.data?.id === article?.author?.id) ? {
        id: data?.data?.id,
        username: data?.data?.handle,
        image: data?.data?.image,
    } : {
        id: session?.user?.id,
        username: session?.user?.username,
        image: session?.user?.image
    }

    return (
        session?.user ? <div className="">
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
                    sx={{
                        ...!showButtons && { height: '30px', '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '0.8', height: '30px', padding: '0px' } },
                        ...!isMc && { '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '1', height: '30px', padding: '0px' } }
                    }}
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
        </div> :
            <UnAuthorizedActionWrapper description={'To participate in the discussion and leave a comment, please ensure that you are logged into your account. Logging in helps us maintain a safe and engaging community environment.'} link={'#'} >
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
                        sx={{
                            ...!showButtons && { height: '30px', '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '0.8', height: '30px', padding: '0px' } },
                            ...!isMc && { '& .MuiInputBase-input': { fontSize: '0.8rem', lineHeight: '1', height: '30px', padding: '0px' } }
                        }}
                        value={''}
                        className="text-sm"
                    ></TextField>
                </div>
            </UnAuthorizedActionWrapper>
    )
}

const CommentBottomControl = ({ commentId, onAddReply, toReplay, claps, clapsCount, article }) => {
    const { data: session } = useSession();
    const currentUser = session?.user;
    const [showForm, setShowForm] = useState(false);
    const [isClapped, setIsClapped] = useState({ is: false, commentId: null, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const [ClapsCount, setClapsCount] = useState(clapsCount);

    useEffect(() => {
        setTimeout(() => {
            if (currentUser) {
                let clapped = claps?.find(clap => clap?.user?.id === currentUser?.id);
                if (clapped) {
                    setIsClapped({ is: true, commentId: commentId, id: clapped?.id });
                }
            }
            setClapsCount(clapsCount);
        }, 1000);
    }, [claps, clapsCount]);

    const handleClap = async () => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            if (isClapped.is && isClapped.id) {
                let res = await articleCommentClapAction({ id: isClapped.id }, 'delete');
                if (res?.status === 200) {
                    setIsClapped({ is: false, commentId: null, id: null });
                    setClapsCount(ClapsCount - 1);
                }
            } else {
                let res = await articleCommentClapAction({ commentId: commentId }, 'create');
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
                {currentUser ?
                    <>
                        <Button disabled={isLoading} sx={{ px: 1.5, height: '28px' }} onClick={handleClap} size='small' variant='outlined' color='secondary' startIcon={isClapped?.is ? <FaHandsClapping className="w-4 h-4 dark:fill-darkButton fill-accentLight" /> : <PiHandsClappingLight className={`w-4 h-4 ${(ClapsCount === 0) ? 'ml-2.5' : ''}`} />} endIcon={(ClapsCount === 0) ? null : <span className='!text-xs'>{(ClapsCount === null || ClapsCount === undefined) ? '--' : ClapsCount}</span>} />
                        <Button onClick={() => setShowForm(true)} sx={{ px: 1.5, height: '28px' }} startIcon={<BsReply className="w-4 h-4 -mr-1" />} size='small' variant='outlined' endIcon={<><span className='!text-xs -ml-1'>Reply</span></>} color='secondary' />
                    </>
                    :
                    <>
                        <UnAuthorizedActionWrapper description={'You need to be logged in to clap the comment'} >
                            <Button sx={{ px: 1.5, height: '28px' }} size='small' variant='outlined' color='secondary' startIcon={<PiHandsClappingLight className={`w-4 h-4 ${(ClapsCount === 0) ? 'ml-2.5' : ''}`} />} endIcon={(ClapsCount === 0) ? <span className='!text-xs'>{(ClapsCount === null || ClapsCount === undefined) ? '--' : ClapsCount}</span> : null} />
                        </UnAuthorizedActionWrapper>
                        <UnAuthorizedActionWrapper description={'You need to be logged in to reply the comment'} >
                            <Button sx={{ px: 1.5, height: '28px' }} startIcon={<BsReply className="w-4 h-4 -mr-1" />} size='small' variant='outlined' endIcon={<><span className='!text-xs -ml-1'>Reply</span></>} color='secondary' />
                        </UnAuthorizedActionWrapper>
                    </>
                }
            </div>
            {showForm && <div className="mt-1">
                <CommentFormField article={article} showButtons={true} setShowButtons={setShowForm} onSubmit={onAddReply} toReply={toReplay} />
            </div>}
        </div>
    );
};

const BottomControlReplies = ({ commentId, toReplay, count, onAddReply, commentState, article }) => {
    const [showReplies, setShowReplies] = useState(false);

    return (
        <>
            <Button onClick={() => { setShowReplies(!showReplies) }} sx={{ px: 2, height: '32px' }} startIcon={<MdChevronRight className={`w-6 h-6 transition-all duration-300 ${showReplies ? '-rotate-90' : 'rotate-90'}`} />} size='small' variant='text' endIcon={<><span className='!text-sm -ml-1'>{count} Replies</span></>} color='button' />

            {showReplies && <div className="mt-2">
                <RepliesView commentId={commentId} toReplay={toReplay} handleAddReply={onAddReply} count={count} commentState={commentState} article={article} />
            </div>
            }
        </>
    )
}

const RepliesView = ({ commentId, toReplay, handleAddReply, count, article }) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);

    useMemo(() => {
        setLoading(true);
        articleCommentRepliesListAction(commentId).then(res => {
            if (res?.status === 200) {
                setReplies(res?.data);
            }
        }).finally(() => {
            setLoading(false);
        });
    }, [commentId, count]);

    return (
        <>
            {!loading ? (replies ? replies.map((reply, index) => {
                return (
                    <div key={index} className="mb-2">
                        <CommentView article={article} comment={reply} toReplay={toReplay} handleAddReply={handleAddReply} commentState={{ comments: replies, setComments: setReplies }} />
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


export const VariantpPersistentClient = () => {
    const context = useContext(DrawerContext);

    useEffect(() => {
        if (context.variant !== 'persistent') {
            context.setVariant('persistent')
            context.setOpen(false)
        };
    }, []);
    // ^^ context.variant
    useEffect(() => {
        const styleTag = document.getElementById('r_tt');
        if (styleTag && context.variant === 'persistent') {
            styleTag.remove();
        }
    }, [context.variant]);
    return null;
}
