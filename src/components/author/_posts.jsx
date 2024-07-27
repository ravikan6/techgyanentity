"use client";
import { getAuthorPosts } from "@/lib/actions/author";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { PostView_TIA } from "../post/_struct";

const AuthorPosts = ({ data, initialPosts }) => {
    const [posts, setPosts] = useState({ data: [...initialPosts], meta: { hasMore: initialPosts?.AuthorPostslength >= 5 } });
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    useEffect(() => {
        fetcher(cursor);
    }, [cursor]);

    const fetcher = async (cursor) => {
        setLoading(true);
        const response = await getAuthorPosts({ handle: data.handle, cursor, skip: cursor && 1 });
        if (response.status === 200) {
            setPosts((prev) => ({
                ...prev,
                data: [...prev.data, ...response.data],
                meta: { ...prev.meta, hasMore: response?.data?.length >= 5 }
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
            if (entries[0].isIntersecting) {
                setCursor(posts.data.at(-1)?.shortId);
            }
        });

        if (lastItemRef.current) observer.current.observe(lastItemRef.current);
    }, [loading]);

    return (
        <div className="mx-auto px-4">
            <PostView_TIA data={{ list: posts?.data, loading: loading, ref: lastItemRef, hasMore: posts.meta?.hasMore }} />
        </div >
    )
}

export default AuthorPosts;