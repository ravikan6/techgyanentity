import { Avatar, Card } from "@mui/material";
import { MetaMoreMenu, MetaTypeImageView, MetaTypePollView } from "./client";
import { PostCommentView } from ".";
import { RouterBackBtn } from "../Buttons";
import Link from "next/link";
import { ImageSliderView } from "./_struct";


const View = ({ post, options }) => {

    return (
        <>
            <section className="max-w-3xl mx-auto my-5">
                <div className="bg-lightHead/40 dark:bg-darkHead/40 rounded-xl w-full md:p-4 p-2">
                    <div className="flex justify-between items-center">
                        <MetaAuthorView author={post?.author} />
                        <MetaMoreMenu />
                    </div>
                    <div className="mt-2 px-2">
                        <MetaTypeContentView post={post} options={{
                            image: {
                                showText: true,
                            },
                            ...options?.meta?.content,
                        }} />
                    </div>
                </div>
                <div className="relative">
                    <PostCommentView post={post} />
                </div>
            </section>
        </>
    )
}

const View2 = ({ post, options }) => {

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start h-full">
                <div className="w-full sm:w-1/2 h-full">
                    <MetaTypeContentView post={post} options={{
                        image: {
                            blackBg: true,
                        },
                        ...options?.meta?.content,
                    }} />
                </div>
                <div className="w-full relative sm:w-1/2 sm:flex-1 overflow-y-auto h-full sm:max-h-[calc(100vh-80px)] md:max-h-[480px] lg:max-h-[580px]">
                    <div className="sm:absolute top-0 right-0 w-full h-16">
                        <div className="p-3 pt-4 sm:pt-3 bg-lightHead dark:bg-darkHead backdrop-blur-md flex justify-between items-center w-full">
                            <MetaAuthorView author={post?.author} />
                            <div className="flex items-center gap-2 justify-end">
                                <MetaMoreMenu />
                                <RouterBackBtn />
                            </div>
                        </div>
                    </div>
                    <div className="px-2 sm:mt-16 relative sm:h-[calc(100%-68px)] overflow-y-scroll">
                        <PostCommentView post={post} />
                    </div>
                </div>
            </div>
        </>
    )
}

const CardView = ({ post, options }) => {
    return (
        <>
            <Card sx={{ padding: 2 }} >
                <MetaAuthorView author={post?.author} />
                <div className="my-2 px-2">
                    <MetaTypeContentView post={post} options={{
                        image: {
                            showText: true,
                            _1v1: true,
                        },
                        ...options?.meta?.content,
                    }} />
                </div>
                <Link href={{
                    pathname: '/view',
                    query: `type=post&id=${post?.key}`,
                }} >
                    Go to ...
                </Link>
            </Card>
        </>
    )
}

const MetaAuthorView = ({ author }) => {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <Avatar src={author?.image?.url} sx={{ width: '32px', height: '32px' }} />
            </div>
            <div className="ml-4">
                <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{author?.name}</div>
                <div className="text-xs text-zinc-600 -mt-px dark:text-slate-400">{author?.handle}</div>
            </div>
        </div>
    )
}

const MetaTypeContentView = ({ post, options }) => {
    switch (post?.typeOf) {
        case 'IMAGE':
            return (
                <>
                    {options?.image?.showText ? <p className="text-base text-gray-900 dark:text-gray-100 mb-3">{post?.text}</p> : null}
                    <div className={`max-w-xl mx-auto ${options?.image?.rounded ? 'rounded-md overflow-hidden ' : ''}`}>
                        <MetaTypeImageView content={post?.typeImage} options={{
                            ...options?.image,
                        }} />
                        {/* }} slides={images} url={`@${post?.author?.handle}/post/${post?.key}`} bg={false} /> */}
                    </div>
                </>
            );
        case 'POLL':
            return (
                <div className={`${options?.p4 ? 'p-4' : ''}`}>
                    <MetaTypePollView poll={post?.typePoll} options={{ key: post?.key }} />
                </div>
            );
        default:
            return (
                <div className={`${options?.p4 ? 'p-4' : ''}`}>
                    <p className="text-base text-gray-900 dark:text-gray-100">{post?.text}</p>
                </div>
            );
    }
}

export default View;
export { View2, CardView };