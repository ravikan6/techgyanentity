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
        loading ? (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lightButton dark:border-darkButton"></div>
            </div>
        ) : (
            <div className="mx-auto px-4">
                <PostView_TIA data={{ list: posts?.data }} />
            </div>
        )
    )
}

export default AuthorPosts;