"use client";
import { getAuthorPosts } from "@/lib/actions/author";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        ) : (
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.data.map((post, index) => (
                        <div key={index} className="bg-light dark:bg-dark shadow-md rounded-md p-4">
                            <Link href={`/@${data.handle}/${post.slug}`}>
                                <a>
                                    <h2 className="text-xl font-bold">{post.title}</h2>
                                </a>
                            </Link>
                            <p className="text-gray-600 text-sm mt-2">{post.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    )
}

export default AuthorPosts;