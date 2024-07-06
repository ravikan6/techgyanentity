"use client";
import { getDrafts } from "@/lib/actions/blog";
import { StudioContext } from "@/lib/context";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";


const Drafts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data } = useContext(StudioContext);

    useEffect(() => {
        const handler = async () => {
            if (data?.data?.id) {
                const dt = await getDrafts(data?.data?.id);
                setPosts(dt);
            }
            setLoading(false);
        };
        handler();
    }, [data]);

    return (
        <div>
            {loading ? <BetaLoader2 /> : <div>
                {posts.map((post) => (
                    <div key={post.id} className="flex items-center space-x-4 p-2 border-b border-gray-200">
                        {/* Left side image */}
                        <div className="w-16 h-16 flex-shrink-0">
                            <CldImage src={post?.image?.url} alt={post?.image?.alt} className="rounded-lg bg-black/5 dark:bg-white/5" />
                        </div>

                        {/* Right side content */}
                        <div className="flex flex-col flex-grow justify-start items-start">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base cheltenham font-semibold">{post?.title}</h3>
                                <div className="flex space-x-2">
                                    <Link href={`/studio/p/${post.shortId}/edit`} className="text-lightButton dark:text-darkButton hover:underline">
                                        Edit
                                    </Link>
                                    {/* Additional actions can go here */}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">{post?.description}</p>
                        </div>
                    </div>
                ))}

            </div>}
        </div>
    );

}


const BetaLoader2 = () => {
    return (
        <div class='flex space-x-2 justify-center items-centerw-full my-10 dark:invert'>
            <span class='sr-only'>Loading...</span>
            <div class='h-6 w-6 bg-lightButton dark:bg-darkButton rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div class='h-6 w-6 bg-lightButton dark:bg-darkButton rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div class='h-6 w-6 bg-lightButton dark:bg-darkButton rounded-full animate-bounce'></div>
        </div>
    );
};

export default Drafts;