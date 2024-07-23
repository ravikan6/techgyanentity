"use client";
import { getAuthorPosts } from "@/lib/actions/author";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArticleImage } from "../post/_client";
import { AuthorAvatar } from "./_client";

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
                <div className="grid xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                    {
                        posts?.data?.map((post) => (
                            <div key={post?.slug} className="text-left">
                                <Link href={`/${post?.author?.handle}/${post.slug}`}>
                                    <ArticleImage classes="rounded-lg" image={post?.image} />
                                    <h2 className="text-xl mt-2 font-bold cheltenham">{post.title}</h2>
                                </Link>
                                <span className="flex mt-2 space-x-3 items-center">
                                    <Link href={`/@${data?.handle}`} className="flex items-center space-x-3">
                                        <AuthorAvatar data={{ url: data?.image.url }} className={'!w-10 !h-10'} />
                                        <p className="text-base flex flex-col font-semibold">
                                            {data?.name}
                                            <span className="text-sm -mt-1.5 font-medium">{data?.handle}</span>
                                        </p>
                                    </Link>
                                </span>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    )
}

export default AuthorPosts;