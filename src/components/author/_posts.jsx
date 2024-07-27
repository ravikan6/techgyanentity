"use client";
import { getAuthorPosts } from "@/lib/actions/author";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostView_TIA } from "../post/_struct";

const AuthorPosts = ({ data }) => {
    const [posts, setPosts] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetcher = async () => {
            setLoading(true);
            const response = await getAuthorPosts({ handle: data.handle });
            if (response.status === 200) {
                setPosts((prev) => ({
                    ...prev,
                    data: response.data,
                }));
            } else {
                toast.error('Failed to fetch posts');
            }
            setLoading(false);
        }
        fetcher();
    }, [data?.handle]);

    return (
        <div className="mx-auto px-4">
            <PostView_TIA data={{ list: posts?.data, loading: loading }} />
        </div >
    )
}

export default AuthorPosts;