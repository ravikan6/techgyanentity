"use client";
import { getUserBookmarks, getUserClappedPost } from "@/lib/actions/user";
import { useEffect, useRef, useState } from "react";
import { PostListView2, PostListView_TIA } from "../post/_struct";
import { Skeleton } from "@mui/material";
import { Button } from "../rui";
import { toast } from "react-toastify";


export const TestToastify = () => {
    return (
        <div>
            <Button variant="outlined" onClick={() => toast.info('This is toast with info')} >
                Toast Info
            </Button>
            <Button variant="outlined" onClick={() => toast.error('This is toast with Error')} >
                Toast Error
            </Button>
            <Button variant="outlined" onClick={() => toast.warn('This is toast with Warn')} >
                Toast Warn
            </Button>
            <Button variant="outlined" onClick={() => toast.success('This is toast with Success')} >
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
        <div className="mx-auto flex justify-between sm:px-4 max-w-5xl">
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

export { UserBookmarks, UserClappedPost };