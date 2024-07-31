"use client";
import Link from "next/link";
import { ArticleImage } from "./_client";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { IconButton, Menu } from "../rui";
import { PiDotsThreeVertical } from "react-icons/pi";
import { Skeleton } from "@mui/material";
import { ListItemRdX } from "../Home/_profile-model";
import { HeartBrokenOutlined } from "@mui/icons-material";
import { AuthorAvatar } from "../author/_client";


const PostView_TIA = ({ data }) => {

    return (
        <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                {
                    data?.list?.map((post) => (
                        <div key={post?.slug} className="relative group/g_pst transition-opacity duration-300">
                            <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                <ArticleImage className="rounded-xl" image={post?.image} />
                            </Link>
                            <div className="mt-2 h-20 flex flex-nowrap items-start justify-between">
                                <div className="w-[calc(100%-32px)] grow">
                                    <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`} className="w-full">
                                        <h2 className="text-base font-bold cheltenham line-clamp-2 text-ellipsis">{post.title}</h2>
                                        <span className="mt-1.5 text-zinc-700 dark:text-zinc-300 text-sm imperial">
                                            <time dateTime={post?.publishedAt}>{formatDate(post?.publishedAt)}</time> • 0 Views
                                        </span>
                                    </Link>
                                </div>
                                <div className="w-8 opacity-100">
                                    <PostViewActions id={post?.id} />
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    data?.loading && <PostGridLoadingSkelton count={12} />
                }
                <span ref={data?.ref} ></span>
            </div>
            {
                data?.list?.length === 0 && !data?.loading && (
                    <div className="w-full flex justify-center items-center h-48">
                        <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                )
            }
            {
                (!data?.hasMore && !data?.loading && data?.list?.length > 0) && (
                    <div className="w-full flex justify-center items-center h-10">
                        <p className="text-gray-500 dark:text-gray-400">Yah!, you reach the end.</p>
                    </div>
                )
            }
        </>
    )
}

const PostListView_TIA = ({ data }) => {

    return (
        <>
            <div className="w-full flex flex-col justify-start items-start flex-nowrap">
                {
                    data?.list?.map((post) => (
                        <div key={post?.slug} className="relative mb-4 flex items-start space-x-4 group/g_pst transition-opacity duration-300">
                            <Link className=" w-3/12" href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                <ArticleImage className="rounded-lg" image={post?.image} />
                            </Link>
                            <div className="w-[calc(75%-16px)] flex flex-col ">
                                <div className="flex flex-nowrap items-start justify-between mb-3">
                                    <div className="w-[calc(100%-32px)] grow ">
                                        <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`} className="w-full">
                                            <h2 className="text-base font-bold cheltenham line-clamp-2 text-ellipsis">{post.title}</h2>
                                            <span className="mt-1.5 text-zinc-700 dark:text-zinc-300 text-sm imperial">
                                                <time dateTime={post?.publishedAt}>{formatDate(post?.publishedAt)}</time> • 0 Views
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="w-8 opacity-100">
                                        <PostViewActions id={post?.id} />
                                    </div>
                                </div>
                                <PostAuthorView author={post?.author} />
                            </div>
                        </div>
                    ))
                }
                {
                    data?.loading && <PostListLoadingSkelton count={12} />
                }
                <span ref={data?.ref} ></span>
            </div>
            {
                data?.list?.length === 0 && !data?.loading && (
                    <div className="w-full flex justify-center items-center h-48">
                        <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                )
            }
            {
                (!data?.hasMore && !data?.loading && data?.list?.length > 0) && (
                    <div className="w-full flex justify-center items-center h-10">
                        <p className="text-gray-500 dark:text-gray-400">Yah!, you reach the end.</p>
                    </div>
                )
            }
        </>
    )
}

const PostAuthorView = ({ author }) => {
    return (
        <div className="flex items-center space-x-4">
            <Link href={`/@${author?.handle}`}>
                <AuthorAvatar data={{ url: author?.image?.url }} />
            </Link>
            <div>
                <Link href={`/@${author?.handle}`}>
                    <h3 className="text-base font-bold cheltenham">{author?.name}</h3>
                </Link>
            </div>
        </div>
    )
}


const PostViewActions = ({ id }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton size='small' onClick={handleClick}>
                <PiDotsThreeVertical className="w-6 h-6" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'Post Actions',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px !important',
                            minWidth: '180px'
                        }
                    }
                }}>
                <ListItemRdX link={{ name: 'Add to Bookmark', url: '/share', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Report', url: '/report', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Say Thanks', url: '/bookmark', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Share', url: '/report', icon: HeartBrokenOutlined }} />
            </Menu>
        </>
    );
};

const PostGridLoadingSkelton = ({ count }) => {
    return (
        Array(count).fill().map((_, index) => (
            <div key={index} className='w-full'>
                <Skeleton variant='rounded' className='!w-full aspect-video !h-auto block rounded-xl' animation="wave" />
                <Skeleton variant='text' className='mt-3' animation="wave" />
                <Skeleton variant='text' className='mt-1 !w-7/12' animation="wave" />
                <div className="mt-2 flex justify-start space-x-4 items-center">
                    <Skeleton variant='rounded' className='!w-3/12' animation="wave" />
                    <Skeleton variant='circular' className='!w-1.5 !h-1.5' animation="wave" />
                    <Skeleton variant='rounded' className='!w-3/12' animation="wave" />
                </div>
            </div>
        ))
    )
}

const PostListLoadingSkelton = ({ count }) => {
    return (
        Array(count).fill().map((_, index) => (
            <div key={index} className='w-full flex items-start space-x-4 group/g_pst transition-opacity duration-300'>
                <Skeleton variant='rounded' className='!w-35' animation="wave" />
                <div className="h-20 flex max-w-[calc(65%-16px)] flex-nowrap items-start justify-between">
                    <Skeleton variant='text' className='!w-9/12' animation="wave" />
                    <Skeleton variant='text' className='!w-8' animation="wave" />
                </div>
            </div>
        ))
    )
}

export { PostViewActions, PostView_TIA, PostListView_TIA };