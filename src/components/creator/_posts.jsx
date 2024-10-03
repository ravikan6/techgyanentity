"use client";
import { getAuthorPosts } from "@/lib/actions/author";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { PostView_TIA } from "../post/_struct";

const AuthorPosts = ({ data, initialPosts }) => {
    const [posts, setPosts] = useState({ data: [...initialPosts], meta: { hasMore: initialPosts?.length >= 12 } });
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    useEffect(() => {
        if (cursor) fetcher(cursor);
    }, [cursor]);

    const fetcher = async (cursor) => {
        setLoading(true);
        const response = await getAuthorPosts({ handle: data.handle, cursor: cursor, skip: cursor && 1 });
        if (response.status === 200) {
            setPosts((prev) => ({
                data: [...prev.data, ...response.data],
                meta: { ...prev.meta, hasMore: response?.data?.length >= 12 }
            }));
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
            <PostView_TIA data={{ list: posts?.data, loading: loading, ref: lastItemRef, hasMore: posts.meta?.hasMore, author: { handle: data?.handle } }} hidden={{ author: true }} />
        </div >
    )
}

export default AuthorPosts;