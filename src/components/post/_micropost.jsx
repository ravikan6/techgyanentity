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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start">
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
                        {() => {
                            switch (post.type) {
                                case 'IMAGE':
                                    return <p className="text-base text-gray-900 dark:text-gray-100">{post?.content}</p>;
                                default:
                                    return null;
                            }
                        }}
                    </p>
                </div>
            </div>
        </div>
    )
}


const MicroPostPageContent = ({ post, session, imgRounded, className, addPad = true }) => {
    return (
        <div className={className}>
            {(() => {
                switch (post.type) {
                    case 'TEXT':
                        return <p className="text-base text-gray-900 dark:text-gray-100">{post.content}</p>;
                    case 'IMAGE':
                        return <div className={`max-w-md ${imgRounded ? 'rounded-md overflow-hidden mx-auto' : ''}`}><ImageSliderView slides={post.typeContent.list} url={`@${post?.author?.handle}/post/${post.shortId}`} /></div>;
                    case 'LINK':
                        return <a href={post.content} target="_blank" rel="noreferrer">{post.content}</a>;
                    case 'POLL':
                        return <div className={`${addPad ? 'p-4' : ''}`}><PollView post={post} session={session} /> </div>;
                    case 'ARTICLE':
                        return <div>Article</div>;
                    default:
                        return <div>Unknown</div>;
                }
            })()}
        </div>
    )

}

const MicorPostAuthor = ({ post }) => {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <AuthorAvatar data={{ url: post.author?.image?.url }} sx={{ width: '32px', height: '32px' }} />
            </div>
            <div className="ml-4">
                <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{post.author.name}</div>
                <div className="text-xs text-zinc-600 -mt-px dark:text-slate-400">{post.author.handle}</div>
            </div>
        </div>
    )
}




export { MicroPostView, CommunityPostContent, MicroPostViewPage, MicroPostPageContent, MicorPostAuthor };