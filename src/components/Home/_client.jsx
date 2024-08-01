"use client";
import { getUserBookmarks, getUserClappedPost } from "@/lib/actions/user";
import { useEffect, useRef, useState } from "react";
import { PostListView2, PostListView_TIA } from "../post/_struct";


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
        <div className="mx-auto px-4">
            <PostListView_TIA data={{ list: posts?.data, loading: loading, ref: lastItemRef, hasMore: posts.meta?.hasMore }} />
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
        <div className="mx-auto px-4">
            <PostListView2 data={{ list: posts?.data, loading: loading, ref: lastItemRef, hasMore: posts.meta?.hasMore }} />
        </div>
    )
}

export { UserBookmarks, UserClappedPost };