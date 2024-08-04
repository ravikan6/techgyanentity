"use client";
import { getUserBookmarks, getUserClappedPost } from "@/lib/actions/user";
import { useEffect, useRef, useState } from "react";
import { PostListView2, PostListView_TIA } from "../post/_struct";
import { Skeleton, useMediaQuery } from "@mui/material";
import { Button, Dialog, IconButton, SwipeableDrawer } from "../rui";
import { toast } from "react-toastify";
import { PiShareFat } from "react-icons/pi";
import { FacebookOutlined, LinkOutlined, Telegram, WarningAmber, WhatshotOutlined } from "@mui/icons-material";
import { BsTwitterX } from "react-icons/bs";


export const TestToastify = () => {
    return (
        <div className="flex items-center gap-7">
            <Button variant="outlined" onClick={() => toast.info('This is toast with info')} >
                Toast Info
            </Button>
            <Button variant="outlined" onClick={() => toast.error('This is toast with Error')} >
                Toast Error
            </Button>
            <Button variant="outlined" onClick={() => toast.warn('This is toast with Warn', { icon: WarningAmber })} >
                Toast Warn
            </Button>
            <Button variant="outlined" onClick={() => toast.success('This is toast with Success', { autoClose: false })} >
                Toast Success
            </Button>
        </div>
    )
}


const UserBookmarks = ({ data, initialPosts }) => {
    const [posts, setPosts] = useState({ data: [...initialPosts], meta: { hasMore: initialPosts?.length >= 5 } });
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    useEffect(() => {
        if (cursor) fetcher(cursor);
    }, [cursor]);

    const fetcher = async (cursor) => {
        setLoading(true);
        const response = await getUserBookmarks({ userId: data?.id, cursor: cursor, skip: cursor && 1 });
        if (response.status === 200) {
            setPosts((prev) => ({
                data: [...prev.data, ...response.data?.bookmarks],
                meta: { ...prev.meta, hasMore: response?.data?.bookmarks?.length >= 5 }
            }));
            setCursor(null)
        } else {
            toast.error('Failed to fetch posts');
        }
        setLoading(false);
    }

    const lastItemRef = useRef(null);

    useEffect(() => {
        if (loading || !posts.meta.hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && posts.meta.hasMore) {
                setCursor(posts.data.at(-1)?.shortId);
            }
        });

        if (lastItemRef.current) observer.current.observe(lastItemRef.current);
    }, [loading]);

    return (
        <div className="mx-auto sm:px-4">
            <PostListView2 data={{ list: posts?.data, loading: loading, ref: lastItemRef, hasMore: posts.meta?.hasMore }} hidden={{ bookmark: true }} />
        </div >
    )
}

const UserClappedPost = ({ data, initialPosts }) => {
    const [posts, setPosts] = useState({ data: [...initialPosts], meta: { hasMore: initialPosts?.length >= 5 } });
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    useEffect(() => {
        if (cursor) fetcher(cursor);
    }, [cursor]);

    const fetcher = async (cursor) => {
        setLoading(true);
        const response = await getUserClappedPost({ userId: data?.id, cursor: cursor, skip: cursor && 1 });
        if (response.status === 200) {
            let dt = await response?.data?.map((post) => post?.post);
            setPosts((prev) => ({
                data: [...prev.data, ...dt],
                meta: { ...prev.meta, hasMore: dt?.length >= 5 }
            }));
            setCursor(null)
        } else {
            toast.error('Failed to fetch posts');
        }
        setLoading(false);
    }

    const lastItemRef = useRef(null);

    useEffect(() => {
        if (loading || !posts.meta.hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && posts.meta.hasMore) {
                setCursor(posts.data.at(-1)?.shortId);
            }
        });

        if (lastItemRef.current) observer.current.observe(lastItemRef.current);
    }, [loading]);

    return (
        <div className="mx-auto flex flex-col lg:flex-row gap-5 justify-between sm:px-4 max-w-5xl">
            <PostListView2 data={{ list: posts?.data, loading: loading, ref: lastItemRef, hasMore: posts.meta?.hasMore }} />
            <SidebarView />
        </div>
    )
}

const SidebarView = () => {
    return (
        <>
            <div className="w-full">
                <h2 className="text-xl karnak">
                    Recommanded
                </h2>
                <div className="mt-2 flex flex-col gap-4 w-full">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        </>
    )
}

const ShareView = () => {
    const [isOpen, setIsOpen] = useState(false)
    let isUnderWidth = useMediaQuery('(max-width:600px)');


    return (
        <>
            <IconButton onClick={() => setIsOpen(true)} >
                <PiShareFat className="w-5 h-5" />
            </IconButton>

            {
                isUnderWidth ? <ShareSwiper isOpen={isOpen} setIsOpen={setIsOpen} /> : <ShareModal isOpen={isOpen} setIsOpen={setIsOpen} />
            }

        </>
    )
}

const ShareModal = ({ isOpen, setIsOpen }) => {

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <div className="py-5 px-5">
                <ShareViewContent />
            </div>
        </Dialog>
    )
}

const ShareViewContent = () => {
    const shareOptions = [
        { name: 'Facebook', icon: FacebookOutlined, color: 'blue', onClick: () => window.open('https://www.facebook.com/sharer/sharer.php?u=https://www.google.com', '_blank') },
        { name: 'Twitter', icon: BsTwitterX, color: 'black', onClick: () => window.open('https://twitter.com/intent/tweet?text=Hello%20world&url=https://www.google.com', '_blank') },
        { name: 'Whatsapp', icon: WhatshotOutlined, color: 'green', onClick: () => window.open('https://api.whatsapp.com/send?text=Hello%20world%20https://www.google.com', '_blank') },
        { name: 'Telegram', icon: Telegram, color: 'blue', onClick: () => window.open('https://t.me/share/url?url=https://www.google.com', '_blank') },
        { name: 'Copy Link', icon: LinkOutlined, color: 'black', onClick: () => navigator.clipboard.writeText('https://www.google.com') },
    ]

    return (
        <>
            <div className="flex items-center gap-5">
                {
                    shareOptions.map((item) => (
                        <>
                            <Tooltip title={item.name}>
                                <IconButton className="!w-14 !h-14 flex items-center justify-center" style={{ backgroundColor: item.color }} onClick={item?.onClick}>
                                    <item.icon className="w-10 h-10" />
                                </IconButton>
                            </Tooltip>
                        </>
                    ))
                }
            </div>
        </>
    )
}

const ShareSwiper = ({ isOpen, setIsOpen }) => {
    return (
        <SwipeableDrawer
            minFlingVelocity={500}
            disableSwipeToOpen={false}
            swipeAreaWidth={40}
            container={document?.body}
            anchor="bottom" open={isOpen} onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}
        >
            <div className="px-4 py-2">
                <ShareViewContent />
            </div>
        </SwipeableDrawer>
    )
}

export { UserBookmarks, UserClappedPost, ShareView };