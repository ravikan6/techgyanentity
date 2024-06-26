"use client";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext, } from "react";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions } from "./postActions";
import { Avatar, Skeleton, SwipeableDrawer, styled, useMediaQuery } from "@mui/material";
import { Button, IconButton, TextField, Tooltip } from "../rui";
import { EmailRounded } from "@mui/icons-material";
import { CloseBtn } from "../Buttons";
import { LuUser } from "react-icons/lu";
import useQuery from "@/hooks/useMediaQuery";
import { createPortal } from 'react-dom';
import { FollowButton } from "../author/utils";
import { articleCommentAction, articleCommentsListAction } from "@/lib/actions/author";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

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
    const [component, setComponent] = useState(<SidebarContent article={article} />);
    // const css = `min-[1017px]:max-w-[313px] min-[1055px]:max-w-[363px] min-[1101px]:max-w-[393px] min-[1195px]:max-w-[410px] min-[1256px]:max-w-[425px] min-[1300px]:max-w-[410px]`;

    return (
        <>
            <SidebarContext.Provider value={{ setComponent }}>
                <div className={`overflow-hidden mr-1 z-[999] lg:block h-screen relative w-[400px]`}>
                    <div className={`fixed h-[calc(100%-68px)] mr-1 max-w-[410px] overflow-hidden z-[998]  rounded-xl border dark:border-slate-600 border-gray-300 w-full mt-[64px] top-0 bottom-0`}>
                        <section className="relative h-[calc(100%-1px)] overflow-hidden">
                            {component}
                        </section>
                    </div>
                </div>
            </SidebarContext.Provider>
        </>
    );
}

const SidebarContent = ({ article }) => {
    const publishedAt = getDate(article?.createdAt);
    const updatedAt = getDate(article?.updatedAt);

    const { setComponent } = useContext(SidebarContext);

    const handleDescription = () => {
        setComponent(<Description article={article} publishedAt={publishedAt} updatedAt={updatedAt} />);
    }

    return (
        <>
            <div className="h-[calc(100%-0px)] p-4 overflow-x-hidden">
                <ArticleTop article={article} onClick={handleDescription} />
                <div className="min-h-44 mb-2">
                    <div className="mb-2">
                        <ArticleAuthor article={article} />
                        <PostActions id={article.id} />
                    </div>
                </div>
                <ArticleComments articleId={article.id} />
            </div>
        </>
    );
};

const Description = ({ article, publishedAt, updatedAt }) => {
    const { setComponent } = useContext(SidebarContext);

    const onClose = () => {
        setComponent(<SidebarContent article={article} />);
    }
    return (
        <DescriptionContent article={article} onClose={onClose} />
    );
}

const DescriptionContent = ({ article, onClose }) => {
    return (
        <>
            <div className="px-4 shadow-sm absolute flex items-center justify-between top-0 left-0 w-full h-14">
                <h2 className="text-lg font-bold ">
                    About
                </h2>
                <CloseBtn onClick={onClose} />
            </div>
            <div className="h-[calc(100%-55px)] px-4 py-2 overflow-x-hidden mt-14 pb-14">
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
                <div className="flex items-center mt-2 space-x-4 overflow-x-scroll w-full flex-row flex-nowrap justify-start">
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
                                    <PostActions modern id={article.id} />
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
                        createPortal(<>
                            <ArticleAuthor article={article} />
                            <PostActions modern id={article.id} className="px-1" />
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
                        </>, metaContent)
                    }
                </div>
            </div>
        </>
    )
}

export const ArticleComments = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        articleCommentsListAction(articleId).then(res => {
            if (res?.status === 200) {
                setComments(res?.data);
                toast.success(`Comments loaded successfully ${res?.data?.length} comments found`);
                setLoading(false);
            }
        });
    }, [articleId]);

    const handleAddComment = (comment) => {
        articleCommentAction({ postId: articleId, body: comment }).then(res => {
            toast.success(`'Comment added successfully' ${res?.data} \n\n ${res?.errors} comment added`);
            if (res.status === 200) {
                setComments([res.data, ...comments]);
            }
        });
    };

    const handleAddReply = (commentId, reply) => {
        articleCommentAction({ postId: articleId, body: reply, parentId: commentId }).then(res => {
            toast.success(`'Reply added successfully' ${res?.data} \n\n ${res?.errors} reply added`);
            if (res.status === 200) {
                setComments([res.data, ...comments]);
            }
        });
    };

    return (
        <>
            <div className="mt-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <div className="flex items-center space-x-2">
                        <span>sort</span>
                    </div>
                </div>
                <CommentForm onAddComment={handleAddComment} />
                {loading ? (
                    <Skeleton variant="rounded" height={100} />
                ) : (
                    comments?.map((comment, index) => {
                        const replies = comment?.replies;
                        const avatar = comment?.user?.image?.url && getCldImageUrl({ src: comment?.user?.image?.url, width: 40, height: 40, crop: 'fill', gravity: 'face' });
                        return (
                            <>
                                <div key={index} className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Avatar src={avatar} sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={comment?.user?.name} >{comment?.user?.name.slice(0, 1)}</Avatar>
                                        <div>
                                            <p className="text-sm font-semibold dark:text-slate-100 text-gray-900">{comment?.user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-300">{comment?.content}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <PostDatePublished date={comment?.createdAt} />
                                    </div>
                                </div>
                                {
                                    replies && replies.length > 0 && (
                                        <div className="ml-8">
                                            {replies.map((reply, replyIndex) => {
                                                const avatar = reply?.user?.image?.url && getCldImageUrl({ src: reply?.user?.image?.url, width: 40, height: 40, crop: 'fill', gravity: 'face' });
                                                return (<div key={replyIndex} className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar src={avatar} sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={reply?.user?.name} >{reply?.user?.name.slice(0, 1)}</Avatar>
                                                        <div>
                                                            <p className="text-sm font-semibold dark:text-slate-100 text-gray-900">{reply?.user?.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-300">{reply?.content}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <PostDatePublished date={reply?.createdAt} />
                                                    </div>
                                                </div>)
                                            })}
                                        </div>
                                    )
                                }
                                <div className="ml-8">
                                    <CommentReplyForm commentId={comment.id} onAddReply={handleAddReply} />
                                </div>
                            </>
                        );
                    })
                )}
            </div>
        </>
    );
};

const CommentForm = ({ onAddComment }) => {
    const { data: session } = useSession();
    const [comment, setComment] = useState('');
    const [showButtons, setShowButtons] = useState(false);
    const currentUser = session?.user;

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = () => {

        onAddComment(comment);
        setComment('');
    };

    const handleCancle = () => {
        setShowButtons(false);
        setComment('');
    }

    return (
        <div className="mt-4 mb-4">
            {/* <h3 className="text-lg font-semibold mb-2">Add Comment</h3> */}
            <div className="">
                <div className="flex justify-between space-x-4 mb-3">
                    <Avatar src={currentUser?.image} sx={{ width: showButtons ? 40 : 30, height: showButtons ? 40 : 30, borderRadius: 1000 }} alt={currentUser?.name} >{currentUser?.name.slice(0, 1)}</Avatar>
                    <TextField
                        required
                        onClick={() => { setShowButtons(true) }}
                        multiline
                        variant="standard"
                        size="small"
                        fullWidth
                        placeholder="Write your comment..."
                        value={comment}
                        onChange={handleCommentChange}
                        className="text-sm"
                    ></TextField>
                </div>
                {showButtons && <div className="flex items-center justify-end space-x-4">
                    <Button size="small" onClick={handleCancle} variant="outlined" color="primary">
                        Cancle
                    </Button>
                    <Button size="small" disabled={comment?.length === 0} onClick={handleCommentSubmit} variant="contained" color="primary">
                        Comment
                    </Button>
                </div>}
            </div>
        </div>
    );
};

const CommentReplyForm = ({ commentId, onAddReply }) => {
    const { data: session } = useSession();
    const currentUser = session?.user;
    const [reply, setReply] = useState('');
    const [showButtons, setShowButtons] = useState(false);

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleReplySubmit = () => {
        // Add reply submit logic here
        onAddReply(commentId, reply);
        setReply('');
    };

    const handleCancle = () => {
        setShowButtons(false);
        setReply('');
    }

    return (
        <div className="mt-2">

            {showButtons ? <div className="">
                <div className="flex justify-between space-x-4 mb-3">
                    <Avatar src={currentUser?.image} sx={{ width: 30, height: 30, borderRadius: 1000 }} alt={currentUser?.name} >{currentUser?.name.slice(0, 1)}</Avatar>
                    <TextField
                        required
                        onClick={() => { setShowButtons(true) }}
                        multiline
                        variant="standard"
                        size="small"
                        fullWidth
                        placeholder="Write your comment..."
                        value={reply}
                        onChange={handleReplySubmit}
                        className="text-sm"
                    ></TextField>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <Button size="small" onClick={handleCancle} variant="outlined" color="primary">
                        Cancle
                    </Button>
                    <Button size="small" disabled={reply?.length === 0} onClick={handleReplySubmit} variant="contained" color="primary">
                        Comment
                    </Button>
                </div>
            </div> :
                <div className="flex items-center justify-end space-x-4">
                    <Button size="small" onClick={() => setShowButtons(true)} variant="outlined" color="primary">
                        Reply
                    </Button>
                </div>}
        </div>
    );
};


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
