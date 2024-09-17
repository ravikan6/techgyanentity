"use client";
import { useRouter } from "next-nprogress-bar";
import { AuthorAvatar } from "../author/_client";
import { Button } from "../rui";
import { ImagePostView, ImageSliderView, PollView } from "./_struct";


const MicroPostView = ({ post, session }) => {
    return (
        <div className="p-3 rounded-xl bg-lightHead/40 dark:bg-darkHead/40">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <AuthorAvatar data={{ url: post.author?.image?.url }} sx={{ width: '32px', height: '32px' }} />
                </div>
                <div className="ml-4">
                    <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{post.author.name}</div>
                    <div className="text-xs text-zinc-600 -mt-px dark:text-slate-400">{post.author.handle}</div>
                </div>
            </div>
            <div className="mt-2.5">
                <CommunityPostContent post={post} session={session} />
            </div>
        </div>
    )
}


const CommunityPostContent = ({ post, session }) => {
    switch (post.type) {
        case 'TEXT':
            return <p className="text-base text-gray-900 dark:text-gray-100">{post.content}</p>;
        case 'IMAGE':
            return <ImagePostView post={post.typeContent} url={`view?type=post&id=${post.shortId}`} />;
        case 'LINK':
            return <a href={post.content} target="_blank" rel="noreferrer">{post.content}</a>;
        case 'POLL':
            return <PollView post={post} session={session} url={`view?type=post&id=${post.shortId}`} />;
        case 'ARTICLE':
            return <div>Article</div>;
        default:
            return <div>Unknown</div>;
    }
}


const MicroPostViewPage = ({ post, session }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row gap-3 mdsm:gap-0 items-start">
            <div className="w-full sm:w-1/2">
                <MicroPostPageContent post={post} session={session} />
            </div>
            <div className="w-full sm:w-1/2 sm:flex-1">
                <div className="p-3 rounded-xl bg-lightHead/40 dark:bg-darkHead/40">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AuthorAvatar data={{ url: post.author?.image?.url }} sx={{ width: '32px', height: '32px' }} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{post.author.name}</div>
                            <div className="text-xs text-zinc-600 -mt-px dark:text-slate-400">{post.author.handle}</div>
                        </div>
                    </div>
                    <div className="mt-2.5">
                    </div>
                </div>
                <div className="mt-4 px-2">
                    <p>
                        {post?.content}
                    </p>
                </div>

                <div className="flex flex-col gap-3 px-2">
                    <Button variant="outlined" onClick={() => {
                        router.back();
                        router.push('/@techgyanentity/what-are-signals-in-tailwind-how-do-they-work-and-use')
                    }}>
                        Back and Go
                    </Button>

                    <Button variant="contained" onClick={() => {
                        try {
                            router.back();
                        } finally {
                            router.push('/@techgyanentity/what-are-signals-in-tailwind-how-do-they-work-and-use')
                        }
                    }}>
                        Back and finaly Go
                    </Button>

                    <Button variant="text" onClick={() => {
                        router.push('/@techgyanentity/what-are-signals-in-tailwind-how-do-they-work-and-use')
                    }}>
                        Go
                    </Button>
                </div>

            </div>
        </div>
    )
}


const MicroPostPageContent = ({ post, session }) => {
    switch (post.type) {
        case 'TEXT':
            return <p className="text-base text-gray-900 dark:text-gray-100">{post.content}</p>;
        case 'IMAGE':
            return <ImageSliderView slides={post.typeContent.list} url={`@${post?.author?.handle}/post/${post.shortId}`} />;
        case 'LINK':
            return <a href={post.content} target="_blank" rel="noreferrer">{post.content}</a>;
        case 'POLL':
            return <PollView post={post} session={session} />;
        case 'ARTICLE':
            return <div>Article</div>;
        default:
            return <div>Unknown</div>;
    }
}


export { MicroPostView, CommunityPostContent, MicroPostViewPage }