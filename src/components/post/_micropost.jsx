"use client";
import { useRouter } from "next-nprogress-bar";
import { AuthorAvatar } from "../author/_client";
import { Button } from "../rui";
import { ImagePostView, ImageSliderView, PollView } from "./_struct";
import { ActionMenu, RouterBackBtn } from "../Buttons";
import { Delete, HeartBroken } from "@mui/icons-material";
import confirm from "@/lib/confirm";
import { deleteMicroPost } from "@/lib/actions/delete";
import { useState } from "react";
import { toast } from "react-toastify";
import { getPostCommentReplies, getPostComments, postCommentAction, postCommentClapAction, postCommentDeleteAction } from "@/lib/actions/create";
import { CommentsView } from "./comment";
import Link from "next/link";


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
            return <Link href={`view?type=post&id=${post.shortId}`}>
                <p className="text-base text-gray-900 dark:text-gray-100">{post.content}</p>
            </Link>;
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
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start h-full">
            <div className="w-full sm:w-1/2">
                <MicroPostPageContent post={post} session={session} />
            </div>
            <div className="w-full relative sm:w-1/2 sm:flex-1 overflow-y-auto sm:max-h-[calc(100vh-80px)] md:max-h-[480px] lg:max-h-[580px]">
                <div className="sm:sticky top-0 right-0 w-full">
                    <div className="p-3 rounded-xl bg-lightHead/40 dark:bg-darkHead/40 backdrop-blur-md flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AuthorAvatar data={{ url: post.author?.image?.url }} sx={{ width: '32px', height: '32px' }} />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{post.author.name}</div>
                                <div className="text-xs text-zinc-600 -mt-px dark:text-slate-400">{post.author.handle}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <MicroPostActions id={post?.shortId} />
                            <RouterBackBtn />
                        </div>
                    </div>
                </div>
                <div className="sm:mt-20 px-2">
                    {post.type === 'IMAGE' ? <p className="text-base text-gray-900 dark:text-gray-100 mb-3">{post?.content}</p> : null}
                    <section className="px-2">
                        <MicroPostCommentsView post={post} />
                    </section>
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
                        return <div className={`max-w-xl mx-auto ${imgRounded ? 'rounded-md overflow-hidden ' : ''}`}><ImageSliderView slides={post.typeContent.list} url={`@${post?.author?.handle}/post/${post.shortId}`} /></div>;
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

const MicroPostActions = ({ id, list = [] }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDelete = async () => {
        if (id) {
            try {
                if (confirm('Are you sure you want to delete this post?')) {
                    setLoading(true);
                    const res = await deleteMicroPost(id);
                    if (res.status === 200) {
                        toast.info('Post deleted successfully');
                        router.push('/home');
                    } else {
                        console.log(res.errors);
                    }
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    const listMenu = [
        ...list,
        { label: 'Edit', icon: HeartBroken },
        { label: 'Delete', icon: Delete, onClick: () => onDelete() },
        { label: 'Report', icon: HeartBroken }
    ];

    return (
        <>
            <ActionMenu list={listMenu} />
        </>
    );
}

const MicroPostCommentsView = ({ post }) => {

    async function getComments(options = {}) {
        try {
            let res = await getPostComments(post.id, options);
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function commentAction(obj = {}) {
        try {
            let res = await postCommentAction({ postId: post.shortId, ...obj });
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function getCommentReplies(id, options = {}) {
        try {
            let res = await getPostCommentReplies(id, options);
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function deleteComment(id) {
        try {
            let res = await postCommentDeleteAction({ id });
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }
    async function clapAction(data, action) {
        try {
            let res = await postCommentClapAction(data, action);
            return res;
        } catch (error) {
            return { status: 500, data: null };
        }
    }

    return (
        <div className="mt-4">
            <CommentsView contentAuthor={post?.author} count={post?._count?.comments} getComments={getComments} commentAction={commentAction} getCommentReplies={getCommentReplies} deleteComment={deleteComment} clapAction={clapAction} />
        </div>
    );
};


export { MicroPostView, CommunityPostContent, MicroPostViewPage, MicroPostPageContent, MicorPostAuthor, MicroPostActions, MicroPostCommentsView };