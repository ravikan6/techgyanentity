"use client";
import { useLazyQuery } from "@apollo/client";
import { Avatar, Skeleton, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, IconButton, SwipeableDrawer, Tooltip } from "../rui";
import { EmailRounded } from "@mui/icons-material";
import { CreatorFollowButton, CreatorWrapper } from "../creator/utils";
import Link from "next/link";
import { LuUser } from "react-icons/lu";
import { formatDate, formatDateToString } from "@/lib/utils";
import { CommentContext, StudioContext } from "@/lib/context";
import { CommentContainer } from "../common";
import { GET_STORY_CLIENT_INFO, GET_STORY_COMMENTS } from "@/lib/types/story";
import { storyCommentAction, updateStoryComment, updateStoryCommentVote } from "@/lib/actions/setters/story";
import { StoryBookmarkView, StoryClapView, StoryCommentButtonView, StoryMetaMoreMenuView, StoryMoreMenuView, StoryShareView } from ".";
import { ClapReadonlyView, CommentReadonlyView } from "./actions";

const MetaContext = createContext();

const ImageView = ({ image, classes, height, width, className, style }) => {
    return <Image
        draggable={false}
        src={image?.url}
        alt={image?.alt}
        width={width || 720}
        height={height || 405}
        sizes="100vw"
        loading='lazy'
        className={`rounded-2xl aspect-video h-auto ${classes} ${className}`}
        style={style}
    />
}

const SidebarView = ({ storyKey }) => {
    let width = useMediaQuery('(min-width:1024px)');
    const [open, setOpen] = useState(false);
    const [story, setStory] = useState();

    const [getStory, { data, error, called, loading }] = useLazyQuery(GET_STORY_CLIENT_INFO)

    useEffect(() => {
        if (width && !called && !loading) {
            getStory({
                variables: {
                    key: storyKey,
                }
            })
        }
        if (data && data.Stories?.edges[0]?.node) {
            setStory(data.Stories?.edges[0]?.node)
        }
    }, [width, data])

    return (
        <MetaContext.Provider value={{ open, setOpen, story, setStory }}>
            <div className={`overflow-hidden mr-1 lg:block relative w-[400px]`}>
                <div className={`fixed h-[calc(100%-66px)] mr-1 max-w-[410px] overflow-hidden z-[998]  rounded-xl border dark:border-slate-600 border-gray-300 w-full mt-[64px] top-0 bottom-0`}>
                    {(width && story) ? <section id="rb_sidebar_comp" className="relative h-full overflow-hidden">
                        <SidebarInnerView storyKey={storyKey} />
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
        </MetaContext.Provider>
    );
}

const TopbarView = ({ storyKey }) => {
    let width = useMediaQuery('(max-width:1024px)');
    const [open, setOpen] = useState(false);
    const [story, setStory] = useState();

    const [getStory, { data, error, called, loading }] = useLazyQuery(GET_STORY_CLIENT_INFO)

    useEffect(() => {
        if (width && !called && !loading) {
            getStory({
                variables: {
                    key: storyKey,
                }
            })
        }
        if (data && data.Stories?.edges[0]?.node) {
            setStory(data.Stories?.edges[0]?.node)
        }
    }, [width, data])

    return (
        <MetaContext.Provider value={{ open, setOpen, story, setStory }}>
            {
                (width && story) ?
                    <>
                        <MetaBoxView classes={{ h1: "text-xl sm:text-2xl md:text-3xl" }} />
                        <MetaAuthorView />
                        <MetaActionView options={{ commentButton: true }} />
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
                            }} anchor="bottom" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                            <MetaDescBoxView />
                        </SwipeableDrawer>
                    </>
                    :
                    <div>
                        <div className="flex items-center w-full">
                            <div className="mr-2">
                                <Skeleton variant="circular" width={40} height={40} />
                            </div>
                            <div>
                                <Skeleton variant="text" width={100} height={24} />
                            </div>
                            <div className="ml-auto">
                                <Skeleton variant="text" width={100} height={40} />
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center mt-3 gap-3'>
                                {new Array(3).fill(0).map((_, index) => (
                                    <Skeleton key={index} variant="circular" width={32} height={32} />
                                ))}
                            </div>

                            <div className='flex items-center mt-3 gap-3'>
                                {new Array(2).fill(0).map((_, index) => (
                                    <Skeleton key={index} variant="circular" width={32} height={32} />
                                ))}
                            </div>
                        </div>
                    </div>
            }
        </MetaContext.Provider>
    )
}


const SidebarInnerView = () => {
    const { open, setOpen, story } = useContext(MetaContext);

    return (
        <>
            <div className="h-full p-4 overflow-x-hidden">
                <MetaBoxView classes={{ h1: 'text-xl' }} />
                <div className="mb-2">
                    <MetaAuthorView />
                </div>
                <div className="mb-4">
                    <MetaActionView options={{ commentButton: false }} />
                </div>
                <CommentView />
            </div>
            <SwipeableDrawer disableSwipeToOpen
                height="100%"
                sx={{ height: '100%' }}
                transitionDuration={1}
                ModalProps={{
                    style: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 },
                    disablePortal: true,
                }} anchor="bottom" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
                <MetaDescBoxView />
            </SwipeableDrawer>
        </>
    );
};


const MetaBoxView = ({ classes }) => {

    const { setOpen, story } = useContext(MetaContext);

    return (
        <>
            <div onClick={() => setOpen(true)} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer duration-500 mb-4 rounded-xl py-1 px-2">
                <h1 className={`karnak mb-1.5 font-bold ${classes?.h1}`}>{story.title}</h1>
                <div className="flex space-x-1 items-center justify-between font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                    <div>999 views</div>
                    <div>
                        {'2 min'} read
                    </div>
                    <MetaDateView date={story?.publishedAt} />
                </div>
                <h4 className="text-sm line-clamp-2 text-ellipsis font-medium dark:text-gray-300 text-gray-700">{story?.description?.slice(0, 150)}</h4>
            </div>
        </>
    )
}

const MetaAuthorView = () => {
    const { story } = useContext(MetaContext);

    return (
        <div className="flex justify-between hover:bg-black/10 dark:hover:bg-white/10 py-1 px-1 rounded-md space-x-2 items-center mb-5 border-y-slate-500">
            <div className="flex items-center py-1">
                <CreatorWrapper keyId={story?.author?.key} >
                    <div className="flex items-center cursor-pointer gap-3">
                        <Link href={`/@${story?.author?.handle}`}>
                            <Avatar src={story?.author?.image?.url} alt="__" sx={{ width: 40, height: 40, borderRadius: 1000 }} />
                        </Link>
                        <div className="flex flex-col justify-around">
                            <Link href={`/@${story?.author?.handle}`}>
                                <p className="text-sm cheltenham-small mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                    {story?.author?.name}
                                </p>
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                {0} Followers
                            </p>
                        </div>
                    </div>
                </CreatorWrapper>
            </div>
            <div className="flex items-center space-x-4">
                <IconButton className="bg-light dark:bg-dark" size="small" color="accent" >
                    <EmailRounded className="w-4 h-4" />
                </IconButton>
                <CreatorFollowButton isFollowed={story?.author?.isFollowed} creatorKey={story?.author?.key} />
            </div>
        </div>
    )
}

const MetaDescBoxView = () => {

    const { story } = useContext(MetaContext);

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-bold ">
                    About
                </h2>
            </div>
            <div className="py-2 overflow-x-hidde pb-14">
                <div className="">
                    <h1 className="text-xl mb-3 font-bold cheltenham">{story?.title}</h1>
                    <div className="flex space-x-1 items-center justify-around font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                        <div className={`flex flex-col items-center justify-center`}>
                            <span className="mb-0.5 cheltenham">999</span>
                            <span>views</span>
                        </div>
                        <Tooltip title="average read time" placement="top" arrow>
                            <div className={`flex flex-col items-center justify-center`}>
                                <span className="mb-0.5 cheltenham">{'2 min'}</span>
                                <span>read</span>
                            </div>
                        </Tooltip>
                        <MetaDateView date={story?.publishedAt} expanded />
                    </div>
                </div>
                {story?.description && <div className="my-4">
                    <h4 className="text-sm mx-1 bg-lightHead dark:bg-darkHead p-3 rounded-md font-medium dark:text-gray-300 text-gray-700">{story.description}</h4>
                </div>}
                <div className="flex justify-between items-center mb-5 border-y-slate-500">
                    <div className="flex items-center py-1">
                        <div className="flex-shrink-0">
                            <Avatar src={story?.author?.image?.url} sx={{ width: 50, height: 50, borderRadius: 1000 }} alt={story?.author?.name} >{story?.author?.name.slice(0, 1)}</Avatar>
                        </div>
                        <div className="flex flex-col justify-around ml-2">
                            <p className="text-base karnak mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                {story?.author?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                2k followers
                            </p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-scroll w-full mt-2">
                    <div className="flex items-center py-3 space-x-4 w-fit flex-row flex-nowrap justify-start">
                        <CreatorFollowButton isFollowed={false} />
                        <Button variant="outlined" sx={{ px: 2 }} color="button" startIcon={<LuUser className="w-4 h-4 mr-1" />} size="small" >About</Button>
                        <Button variant="outlined" sx={{ px: 2 }} color="button" startIcon={<EmailRounded className="w-4 h-4 mr-1" />} size="small" >Contact</Button>
                        {
                            story?.author?.social && story?.author?.social?.map((social, index) => (
                                <Button key={index} variant="outlined" sx={{ px: 2 }} color="button" startIcon={<LuUser className="w-4 h-4 mr-1" />} size="small" >{social?.title}</Button>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

const MetaDateView = ({ date, expanded }) => {
    return (
        <>
            <Tooltip title={<>{new Date(date).toLocaleString()}</>} placement="top" arrow>
                <div className={`flex flex-col items-center justify-center`}>
                    {expanded && <span className="mb-0.5 cheltenham">{new Date(date).getFullYear()}</span>}
                    <time dateTime={date}>{formatDate(date)}</time>
                </div>
            </Tooltip>
        </>
    );
}

const MetaActionView = ({ options }) => {
    const { story } = useContext(MetaContext);

    return (
        <>
            <div className="flex items-center gap-5 overflow-x-auto flex-nowrap">
                <StoryClapView value={{
                    count: story?.clapsCount,
                    meClaped: story?.clappedByMe,
                    storyKey: story?.key
                }} />
                {options?.commentButton ? <MetaCommentButtonView count={story?.commentsCount} /> : null}
                <StoryBookmarkView value={{
                    is: story?.savedByMe,
                    storyKey: story?.key
                }} />
                <StoryShareView href={{
                    path: `/@${story?.author?.handle}/${story?.slug}`,
                }} />
                <StoryMoreMenuView />
            </div>
        </>
    );
}

const MetaCommentButtonView = ({ count }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <StoryCommentButtonView count={count} options={{
                onClick: () => setOpen(true),
            }} />
            <SwipeableDrawer
                container={document?.body}
                ModalProps={{
                    keepMounted: false,
                }}
                anchor="bottom"
                addPd={false}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}>
                <section className="relative p-3 bg-light dark:bg-dark">
                    <CommentView />
                </section>
            </SwipeableDrawer>
        </>
    )
}

const _MetaView = ({ story }) => {
    return (
        <>
            <div className="flex text-sm flex-row items-center justify-between cheltenham text-black/65 dark:text-white/65 w-full">
                <div className="flex flex-row items-center justify-start gap-1">
                    <Link href={`/@${story?.author?.handle}`}>
                        <h3 className="">{story?.author?.name}</h3>
                    </Link>
                    <strong>·</strong>
                    <Tooltip title={formatDateToString(story?.publishedAt).long}>
                        <p>{formatDateToString(story?.publishedAt).short}</p>
                    </Tooltip>
                </div>
                <div className="flex flex-row items-center justify-end gap-2.5">
                    {story?.clapsCount ? <> <ClapReadonlyView claps={{
                        count: story?.clapsCount,
                        me: story?.clappedByMe
                    }} /> </> : null}
                    {story?.commentsCount ? <> <CommentReadonlyView count={story?.commentsCount} /> </> : null}
                    <StoryMetaMoreMenuView />
                </div>
            </div>
        </>
    )
}

const CommentView = () => {
    const [comments, setComments] = useState([]);
    const [form, setForm] = useState({
        text: '',
        show: false,
        action: 'CREATE', // "UPDATE", "REPLY"
        parentId: null
    });
    const [sending, setSending] = useState(false);
    const [reply, setReply] = useState({
        data: null,
        action: 'NEW'
    })
    const { story } = useContext(MetaContext);
    const { creator } = useContext(StudioContext);
    const [getComments, { data, loading, error, called }] = useLazyQuery(GET_STORY_COMMENTS);
    const observer = useRef();
    const lastItemRef = useRef(null);

    useEffect(() => {
        if (story.key && !called) {
            getComments({
                variables: {
                    key: story.key,
                    parent_Id: null,
                }
            });
        }
        if (data && data.StoryComments.edges) {
            setComments(
                [...comments, ...data.StoryComments.edges]
            );
        }
    }, [story, called, data])

    useEffect(() => {
        if (loading || !data?.StoryComments?.pageInfo?.hasNextPage) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && data?.StoryComments?.pageInfo?.hasNextPage) {
                getComments({
                    variables: {
                        key: story.key,
                        parent_Id: null,
                        after: data?.StoryComments?.pageInfo?.endCursor
                    }
                });
            }
        });

        if (lastItemRef.current) observer.current.observe(lastItemRef.current);
    }, [loading]);

    const onSend = async () => {
        if (!form.text || !form.show || !form.action || !story.key) return null;
        if (form.action === 'REPLY' && !form.parentId) return null;
        if (form.action === 'UPDATE' && !form?.commentId) return null;
        let authorKey = creator?.key === story?.author?.key ? creator?.key : null;
        try {
            setSending(true)
            if (form.action === 'UPDATE') {
                let res = await updateStoryComment(form.commentId, form.text);

                if (res.success) {
                    let comment = res.data;
                    if (form.parentId) {
                        setReply({
                            data: comment,
                            action: 'UPDATE'
                        })
                    } else {
                        let newComments = comments.map((item) => (item.node.id === comment.id) ? { ...item, node: { ...item.node, ...comment } } : item);
                        setComments(newComments)
                    }
                    setForm({
                        text: '',
                        show: false,
                        action: 'CREATE',
                        parentId: null,
                    })
                }

            } else {
                let res = await storyCommentAction(story.key, form.text, form.action, form.parentId, authorKey)

                if (res.success) {
                    if (form.action === 'REPLY') {
                        setReply({
                            data: res.data,
                            action: 'NEW'
                        })
                    } else {
                        setComments((prev) => [{ cursor: null, node: res.data }, ...prev])
                    }
                    setForm({
                        text: '',
                        show: false,
                        action: 'CREATE',
                        parentId: null,
                    })
                }
            }
        } catch (e) {
            console.log(e) // #remove
        } finally {
            setSending(false)
        }

    }

    const onVote = async (id) => {
        if (id === null || id === undefined) return null;

        try {
            let res = await updateStoryCommentVote(id);
            if (res.success) {
                return {
                    me: res.data?.myVote,
                    count: res.data?.votes
                };
            }
            return null;
        } catch (e) {
            console.log(e) // #remove
        }
    }

    return (
        <CommentContext.Provider value={{
            form: {
                data: form,
                set: setForm,
            },
            state: {
                loading: loading === undefined ? true : loading,
                sending: sending,
                setSending: setSending,
                lastItemRef: lastItemRef,
                hasMore: data?.StoryComments?.pageInfo?.hasNextPage,
            },
            content: {
                key: story?.key,
                authorKey: story?.author?.key,
            },
            comment: {
                data: comments,
                set: setComments,
                count: story?.commentsCount,
            },
            onSend: onSend,
            re: {
                query: GET_STORY_COMMENTS,
                resolver: (data) => {
                    if (data && data?.StoryComments?.edges) {
                        return data.StoryComments.edges
                    } else return [];
                },
                reply: reply,
                setReply: setReply,
            },
            onVote: onVote,
        }}>
            <CommentContainer />
        </CommentContext.Provider>
    )

}


export { ImageView, SidebarView, TopbarView, CommentView, _MetaView };