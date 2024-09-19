"use client";
import { CldImage } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext } from "react";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions } from "./postActions";
import { Avatar, Skeleton, styled, useMediaQuery } from "@mui/material";
import { Button, IconButton, Tooltip, SwipeableDrawer } from "../rui";
import { EmailRounded } from "@mui/icons-material";
import { LuUser } from "react-icons/lu";
import { createPortal } from 'react-dom';
import { AuthorTipWrapper, FollowButton } from "../author/utils";
import { articleCommentAction, articleCommentClapAction, articleCommentDeleteAction, articleCommentRepliesListAction, articleCommentsListAction, getArtcileComments, getArticleCommentReplies } from "@/lib/actions/author";
import Link from "next/link";
import { imgUrl } from "@/lib/helpers";
import { AuthorAvatar } from "../author/_client";
import { CommentsView } from "./comment";

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
                <ArticleCommentsView article={article} />
            </div>
            <Description article={article} publishedAt={publishedAt} updatedAt={updatedAt} open={open} setOpen={setOpen} />
        </>
    );
};

export const ArticleCommentsView = ({ article }) => {

    async function getComments(options = {}) {
        try {
            let res = await getArtcileComments(article.id, options);
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function commentAction(obj = {}) {
        try {
            let res = await articleCommentAction({ postId: article.id, ...obj });
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function getCommentReplies(id, options = {}) {
        try {
            let res = await getArticleCommentReplies(id, options);
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function deleteComment(id) {
        try {
            let res = await articleCommentDeleteAction({ id });
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function clapAction(data, action) {
        try {
            let res = await articleCommentClapAction(data, action);
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }

    return (
        <div className="mt-4">
            <CommentsView contentAuthor={article?.author} count={article?._count?.comments} getComments={getComments} commentAction={commentAction} getCommentReplies={getCommentReplies} deleteComment={deleteComment} clapAction={clapAction} />
        </div>
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
                    <AuthorTipWrapper shortId={article?.author?.shortId} >
                        <div className="flex items-center cursor-pointer gap-3">
                            <Link href={`/@${article?.author?.handle}`}>
                                <AuthorAvatar data={{ url: article?.author?.image?.url }} sx={{ width: 40, height: 40, borderRadius: 1000 }} />
                            </Link>
                            <div className="flex flex-col justify-around">
                                <Link href={`/@${article?.author?.handle}`}>
                                    <p className="text-sm cheltenham-small mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                        {article?.author?.name}
                                    </p>
                                </Link>
                                <p className="text-xs text-gray-500 dark:text-gray-300">
                                    {article?.author?._count?.followers} Followers
                                </p>
                            </div>
                        </div>
                    </AuthorTipWrapper>
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

export const VariantpPersistentClient = () => {
    const context = useContext(DrawerContext);

    useEffect(() => {
        if (context.variant !== 'persistent') {
            context.setVariant('persistent')
            context.setOpen(false)
        };
    }, []);
    useEffect(() => {
        const styleTag = document.getElementById('r_tt');
        if (styleTag && context.variant === 'persistent') {
            styleTag.remove();
        }
    }, [context.variant]);
    return null;
}
