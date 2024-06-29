"use client";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext, useMemo } from "react";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions } from "./postActions";
import { Avatar, ListItemIcon, MenuList, Skeleton, styled, useMediaQuery } from "@mui/material";
import { Button, IconButton, Menu, MenuItem, TextField, Tooltip, SwipeableDrawer } from "../rui";
import { EmailRounded } from "@mui/icons-material";
import { CloseBtn } from "../Buttons";
import { LuUser } from "react-icons/lu";
import useQuery from "@/hooks/useMediaQuery";
import { createPortal } from 'react-dom';
import { FollowButton } from "../author/utils";
import { articleCommentAction, articleCommentClapAction, articleCommentDeleteAction, articleCommentRepliesListAction, articleCommentsListAction } from "@/lib/actions/author";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { PiDotsThreeOutlineVertical, PiHandsClappingLight } from "react-icons/pi";
import { BsReply } from "react-icons/bs";
import { MdChevronRight, MdOutlineDeleteOutline, MdOutlineEdit, MdOutlineReport } from "react-icons/md";
import { FaHandsClapping } from "react-icons/fa6";
import confirm from "@/lib/confirm";

export const ArticleImage = ({ image, classes }) => {
    return <CldImage
        src={image?.url}
        alt={image.alt}
        width={720}
        height={480}
        sizes="100vw"
        loading='lazy'
        enhance
        sanitize
        className={`rounded-2xl w-full h-auto ${classes}`}
    />
}

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette?.accent?.main,
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const SidebarContext = createContext();

export const ArticleSidebar = ({ article }) => {
    let width = useMediaQuery('(min-width:1024px)');
    const [open, setOpen] = useState(false);
    const publishedAt = getDate(article?.createdAt);
    const updatedAt = getDate(article?.updatedAt);

    // const css = `min-[1017px]:max-w-[313px] min-[1055px]:max-w-[363px] min-[1101px]:max-w-[393px] min-[1195px]:max-w-[410px] min-[1256px]:max-w-[425px] min-[1300px]:max-w-[410px]`;

    return (
        <>
            <SidebarContext.Provider value={{ open, setOpen }}>
                <div className={`overflow-hidden mr-1 z-[999] lg:block h-screen relative w-[400px]`}>
                    <div className={`fixed h-[calc(100%-66px)] mr-1 max-w-[410px] overflow-hidden z-[998]  rounded-xl border dark:border-slate-600 border-gray-300 w-full mt-[64px] top-0 bottom-0`}>
                        {width && <section id="rb_sidebar_comp" className="relative h-[calc(100%-1px)] overflow-hidden">
                            <SidebarContent article={article} />
                        </section>}
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
            <div className="h-[calc(100%-0px)] p-4 overflow-x-hidden">
                <ArticleTop article={article} onClick={handleDescription} />
                <div className="mb-2">
                    <div className="mb-4">
                        <ArticleAuthor article={article} />
                        <PostActions id={article.id} commentCount={article?._count?.comments} isExpanded />
                    </div>
                </div>
                <ArticleComments articleId={article.id} />
            </div>
            <Description article={article} publishedAt={publishedAt} updatedAt={updatedAt} open={open} setOpen={setOpen} />
        </>
    );
};

const Description = ({ article, open, setOpen }) => {

    return (
        <>
            <SwipeableDrawer disableSwipeToOpen={false}
                swipeAreaWidth={40}
                height="100%"
                sx={{ height: '100%' }}
                ModalProps={{
                    style: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 },
                    disablePortal: true,
                }} anchor="bottom" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                <div className="visible relative">
                    <Puller />
                    <DescriptionContent article={article} onClose={() => setOpen(false)} />
                </div>
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
                <CloseBtn onClick={onClose} />
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
                <div className="my-4">
                    <h4 className="text-sm mx-1 bg-lightHead dark:bg-darkHead p-3 rounded-md font-medium dark:text-gray-300 text-gray-700">{article.description}</h4>
                </div>
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

export const PostDate = (props) => {
    const publishedAt = props.publishedAt;
    const updatedAt = props.updatedAt;

    return (
        <>
            <div className="group relative transition-all duration-500">
                <time dateTime={props.date}>{formatDate(props?.date)}</time>
                <div className="hidden opacity-0 transition-all duration-500 group-hover:opacity-100 p-5 group-hover:block absolute -right-4 top-8 border rounded-xl shadow-dark/20 z-[2] dark:border-darkHead dark:shadow-light/20 shadow-md border-t-2 dark:bg-dark border-t-accentLight dark:border-t-accentDark bg-light">
                    <table className="table-auto">
                        <thead className="text-slate-800 dark:text-gray-200">
                            <tr>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Published At</th>
                                <th className="px-4 py-2">Updated At</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-gray-300">
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">Date</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.date}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.date}</td>
                            </tr>
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">time</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.time}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.time}</td>
                            </tr>
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">ISO</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.ISO}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.ISO}</td>
                            </tr>
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">Day</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.dayOfWeek}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.dayOfWeek}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-sm text-center text-gray-500 mt-2">
                        {publishedAt.diff}
                    </div>
                </div>
            </div>

        </>
    );
}


const PostDatePublished = ({ date, expanded }) => {

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

export const PostWrapper = ({ children, article }) => {
    let width = useMediaQuery('(min-width:945px)');
    const mediaWidth = useQuery('(min-width:945px)');
    const [drawable, setDrawable] = useState(false);

    const container = undefined;

    return (
        <>
            <section className={`flex xl:flex-row space-x-14 justify-center md:px-0 mx-auto ${mediaWidth == 'undefined' && 'hidden'}`}>
                <div className={`max-w-xl w-full py-6`}>
                    <div className='mb-2'>
                        {article?.image && (
                            <figure
                                key={article?.url}
                                className="block mb-10 text-center break-inside-avoid-column"
                            >
                                <ArticleImage image={article.image} />
                                {/* <figcaption className="z-10 mt-4 text-sm italic text-gray-600">
                                    {article?.caption}
                                </figcaption> */}
                            </figure>
                        )}
                    </div>
                    {!width && (
                        <>
                            <div className="mt-5 mb-10">
                                <ArticleTop article={article} onClick={() => setDrawable(!drawable)} hSize="text-2xl mb-4" />
                                <ArticleAuthor article={article} />
                                <div className="mt-4">
                                    <PostActions modern id={article.id} commentCount={article?._count?.comments} />
                                </div>
                            </div>
                            <SwipeableDrawer container={container} minFlingVelocity={500} disableSwipeToOpen={false}
                                swipeAreaWidth={40}
                                ModalProps={{
                                    keepMounted: true,
                                }} anchor="bottom" open={drawable} onClose={() => setDrawable(false)} onOpen={() => setDrawable(true)}>
                                <DescriptionContent article={article} onClose={() => setDrawable(false)} />
                            </SwipeableDrawer>
                        </>
                    )}
                    {children}
                </div>
                {width && (
                    <ArticleSidebar article={article} />
                )}
            </section>
        </>
    );
}

const ArticleAuthor = ({ article }) => {
    return (
        <>
            <div className="flex justify-between hover:bg-black/10 dark:hover:bg-white/10 py-1 px-1 rounded-md space-x-2 items-center mb-5 border-y-slate-500">
                <div className="flex items-center py-1">
                    <div className="flex-shrink-0">
                        <Avatar src={article?.author?.image?.url} sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={article?.author?.name} >{article?.author?.name.slice(0, 1)}</Avatar>
                    </div>
                    <div className="flex flex-col justify-around ml-3">
                        <p className="text-sm karnak mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                            {article?.author?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                            2k followers
                        </p>
                    </div>
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
                <h4 className="text-sm font-medium dark:text-gray-300 text-gray-700">{article.description?.slice(0, 100) + ((article.description?.length > 50) && '...')}<span className="font-bold">more</span></h4>
            </div>
        </>
    )

}

export const ArticleTopMeta = ({ article }) => {
    const [sContainer, setSContainer] = useState(null);
    const [metaContent, setMetaContent] = useState(null);
    const [drawable, setDrawable] = useState(false);

    let width = useMediaQuery('(min-width:1024px)');
    let belowWidth = useMediaQuery('(max-width:1024px)');

    useEffect(() => {
        if (width) {
            let s_container = document.getElementById('article_sidebar');
            if (s_container) {
                while (s_container.firstChild) {
                    s_container.firstChild.remove();
                }
                setSContainer(s_container);
            }
        } else setSContainer(null);
        if (belowWidth) {
            let meta_container = document.getElementById('article_topMeta');
            if (meta_container) {
                while (meta_container.firstChild) {
                    meta_container.firstChild.remove();
                }
                setMetaContent(meta_container);
            }
        } else setMetaContent(null);
    }, [width, belowWidth]);

    return (
        <>
            <div className="">
                {sContainer &&
                    createPortal(<><ArticleSidebar article={article} /></>, sContainer)
                }
                <div className="pb-4 lg:hidden pt-4">
                    <ArticleTop article={article} onClick={() => setDrawable(!drawable)} hSize="text-xl sm:text-2xl md:text-3xl" />
                    {metaContent &&
                        createPortal(<div>
                            <ArticleAuthor article={article} />
                            <PostActions modern id={article.id} commentCount={article?._count?.comments} className="px-1" />
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
                                <div className="visible">
                                    <Puller />
                                    <DescriptionContent article={article} onClose={() => setDrawable(false)} />
                                </div>
                            </SwipeableDrawer>
                        </div>, metaContent)
                    }
                </div>
            </div>
        </>
    )
}

export const ArticleComments = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useMemo(() => {
        setLoading(true);
        articleCommentsListAction(articleId).then(res => {
            if (res?.status === 200) {
                setComments(res?.data);
                setLoading(false);
            }
        });
    }, [articleId]);

    console.log(comments, '_______________________commentS_from___YY')

    const handleAddReply = async (commentId, reply) => {
        const res = await articleCommentAction({ postId: articleId, body: reply, parentId: commentId })
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
        const res = await articleCommentAction({ postId: articleId, body: comment })
        if (res?.status === 200) {
            if (res.status === 200) {
                let newRes = await articleCommentsListAction(articleId)
                if (newRes?.status === 200) {
                    setComments((comments) => [...newRes?.data, ...comments]);
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
                <CommentForm onAddComment={handleAddComment} />
                {loading ? (
                    <BetaLoader />
                ) : (
                    comments?.map((comment, index) => {
                        const avatar = comment?.user?.image?.url && getCldImageUrl({ src: comment?.user?.image?.url, width: 40, height: 40, crop: 'fill', gravity: 'face' });
                        return (
                            <div key={index} className="mb-2">
                                <CommentView avatar={avatar} comment={comment} toReplay={comment?.id} articleId={articleId} handleAddReply={handleAddReply} commentState={{ comments, setComments }} />
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
};

const CommentView = ({ avatar, comment, handleAddReply, toReplay, commentState }) => {
    const { data: session } = useSession();
    const [showForm, setShowForm] = useState(false);
    const commentId = comment?.id;

    const handleUpdateComment = async (comment) => {
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
        const res = await articleCommentDeleteAction({ id: commentId }, 'delete');
        if (res?.status === 200) {
            let newComments = commentState?.comments?.filter(comment => comment.id !== commentId);
            commentState?.setComments(newComments);
        }
    }

    return (
        !showForm ? (
            <div className="flex items-start space-x-4 ">
                <Link href='#' className="flex space-x-4">
                    <Avatar src={avatar} sx={{ width: 24, height: 24, borderRadius: 1000 }} alt={comment?.user?.name} >{comment?.user?.name.slice(0, 1)}</Avatar>
                </Link>
                <div className="flex flex-col grow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href='#'>
                                <h4 className="text-sm font-bold dark:text-slate-100 text-gray-900">{comment?.user?.name}</h4>
                            </Link>
                            <Link href={"#"}>
                                <Tooltip title={<>{new Date(comment?.createdAt).toUTCString()}</>} placement="top" arrow>
                                    <time dateTime={comment?.createdAt} className="text-xs font-semibold dark:text-slate-200 text-gray-800">{formatDate(comment?.createdAt)}</time>
                                </Tooltip>
                            </Link>
                            {
                                new Date(comment?.createdAt).getTime() !== new Date(comment?.updatedAt).getTime() && (
                                    <Tooltip title={<>{new Date(comment?.updatedAt).toUTCString()}</>} placement="top" arrow>
                                        <span className="text-xs font-semibold dark:text-slate-200 text-gray-800 cheltenham">( edited )</span>
                                    </Tooltip>
                                )
                            }
                        </div>
                        <CommentMenu id={comment?.id} onEdit={() => setShowForm(true)} onDelete={handleDeleteComment} isOwn={session?.user?.id === comment?.user?.id} />
                    </div>
                    <div id="comment_body">
                        <p className="text-sm text-gray-500 dark:text-gray-300">{comment?.content}</p>
                    </div>
                    <div id="comment_button_control">
                        <CommentBottomControl claps={comment?.claps} clapsCount={comment?._count?.claps} commentId={comment.id} toReplay={toReplay} onAddReply={handleAddReply} count={comment?._count?.replies || 0} />
                    </div>
                    {(comment?._count?.replies && (comment?._count?.replies > 0)) ? (
                        <div className="mt-1">
                            <BottomControlReplies commentId={comment.id} toReplay={toReplay} onAddReply={handleAddReply} count={comment?._count?.replies || 0} commentState={commentState} />
                        </div>
                    ) : null}
                </div>
            </div>) : (
            <CommentFormField currentUser={session?.user} showButtons={true} setShowButtons={setShowForm} commentText={comment?.content} onSubmit={handleUpdateComment} />
        )
    )
}

const CommentMenu = ({ id, isOwn, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        try {
            if (await confirm('Are you sure you want to delete this comment?')) {
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
                {isLoading ? <BetaLoader /> :
                    <IconButton size='small' sx={{ width: '24px', height: '24px', p: 0 }} onClick={handleClick}>
                        <PiDotsThreeOutlineVertical className="w-4 h-4" />
                    </IconButton>
                }
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
                    sx={{ zIndex: '999', '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '128px' } }} >
                    {
                        isOwn ? (
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

const CommentForm = ({ onAddComment }) => {
    const { data: session } = useSession();
    const [showButtons, setShowButtons] = useState(false);
    const currentUser = session?.user;

    return (
        <div className="mt-4 mb-4">
            <CommentFormField
                currentUser={currentUser}
                showButtons={showButtons}
                setShowButtons={setShowButtons}
                isMc
                onSubmit={onAddComment}
            />
        </div>
    );
};

const CommentFormField = ({ currentUser, showButtons, setShowButtons, isMc, onSubmit, toReply, commentText }) => {
    const [comment, setComment] = useState(commentText || '');
    const [isPosting, setIsPosting] = useState(false);

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


    return (
        <div className="">
            <div className={`flex justify-between space-x-4 mb-3 ${!showButtons && 'items-center'}`}>
                <Avatar src={currentUser?.image} sx={{ width: (showButtons && isMc) ? 30 : 24, height: (showButtons && isMc) ? 30 : 24, borderRadius: 1000 }} alt={currentUser?.name} >{currentUser?.name.slice(0, 1)}</Avatar>
                <TextField
                    required
                    onClick={() => { setShowButtons(true) }}
                    multiline
                    variant="standard"
                    size="small"
                    fullWidth
                    autoFocus={showButtons}
                    placeholder="Say something..."
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
        </div>
    )
}

const CommentBottomControl = ({ commentId, onAddReply, toReplay, claps, clapsCount }) => {
    const { data: session } = useSession();
    const currentUser = session?.user;
    const [showForm, setShowForm] = useState(false);
    const [isClapped, setIsClapped] = useState({ is: false, commentId: null, id: null });
    const [isLoading, setIsLoading] = useState(false);
    const [ClapsCount, setClapsCount] = useState(clapsCount);

    useEffect(() => {
        setTimeout(() => {
            let clapped = claps?.find(clap => clap?.user?.id === currentUser?.id);
            if (clapped) {
                setIsClapped({ is: true, commentId: commentId, id: clapped?.id });
            }
            setClapsCount(clapsCount);
        }, 1000);
    }, [claps, clapsCount]);

    const handleClap = async () => {
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
                <Button disabled={isLoading} sx={{ px: 1.5, height: '28px' }} onClick={handleClap} size='small' variant='outlined' color='secondary' startIcon={isClapped?.is ? <FaHandsClapping className="w-4 h-4 dark:fill-accentDark fill-accentLight" /> : <PiHandsClappingLight className="w-4 h-4" />} endIcon={<><span className='!text-xs'>{(ClapsCount === null || ClapsCount === undefined) ? '--' : ClapsCount}</span></>} />
                <Button onClick={() => setShowForm(true)} sx={{ px: 1.5, height: '28px' }} startIcon={<BsReply className="w-4 h-4 -mr-1" />} size='small' variant='outlined' endIcon={<><span className='!text-xs -ml-1'>Reply</span></>} color='secondary' />
            </div>
            {showForm && <div className="mt-1">
                <CommentFormField currentUser={currentUser} showButtons={true} setShowButtons={setShowForm} onSubmit={onAddReply} toReply={toReplay} />
            </div>}
        </div>
    );
};

const BottomControlReplies = ({ commentId, toReplay, count, onAddReply, commentState }) => {
    const [showReplies, setShowReplies] = useState(false);

    return (
        <>
            <Button onClick={() => { setShowReplies(!showReplies) }} sx={{ px: 2, height: '32px' }} startIcon={<MdChevronRight className={`w-6 h-6 transition-all duration-300 ${showReplies ? '-rotate-90' : 'rotate-90'}`} />} size='small' variant='text' endIcon={<><span className='!text-sm -ml-1'>{count} Replies</span></>} color='button' />

            {showReplies && <div className="mt-2">
                <RepliesView commentId={commentId} toReplay={toReplay} handleAddReply={onAddReply} count={count} commentState={commentState} />
            </div>
            }
        </>
    )
}

const RepliesView = ({ commentId, toReplay, handleAddReply, count, commentState }) => {
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
                let avatar = reply?.user?.image?.url && getCldImageUrl({ src: reply?.user?.image?.url, width: 24, height: 24, crop: 'fill', gravity: 'face' });
                return (
                    <div key={index} className="mb-2">
                        <CommentView avatar={avatar} comment={reply} toReplay={toReplay} handleAddReply={handleAddReply} commentState={{ comments: replies, setComments: setReplies }} />
                    </div>
                );
            }) : <div className="text-sm text-gray-500 dark:text-gray-300">No replies found</div>) :
                <BetaLoader />
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


export const VariantpPersistentClient = () => {
    const context = useContext(DrawerContext);

    useEffect(() => {
        if (context.variant !== 'persistent')
            context.setVariant('persistent'); context.setOpen(false);
    }, [context.variant]);

    useEffect(() => {
        const styleTag = document.getElementById('r_tt');
        if (styleTag) {
            styleTag.remove();
        }
    }, []);
    return null;
}
