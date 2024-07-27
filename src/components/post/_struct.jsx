"use client";
import Link from "next/link";
import { ArticleImage } from "./_client";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { IconButton, Menu } from "../rui";
import { PiDotsThreeVertical } from "react-icons/pi";
import { Skeleton } from "@mui/material";
import { TbHeartHandshake } from "react-icons/tb";
import { ListItemRdX } from "../Home/_profile-model";


const PostView_TIA = ({ data }) => {

    return (
        <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                {
                    data?.list?.map((post) => (
                        <div key={post?.slug} className="relative group/g_pst transition-opacity duration-300">
                            <Link href={`/${post?.author?.handle}/${post.slug}`}>
                                <ArticleImage className="rounded-xl" image={post?.image} />
                            </Link>
                            <div className="mt-2 flex flex-nowrap items-start justify-between">
                                <div className="w-[calc(100%-32px)] grow">
                                    <Link href={`/${post?.author?.handle}/${post.slug}`} className="w-full">
                                        <h2 className="text-base font-bold cheltenham line-clamp-2 text-ellipsis">{post.title}</h2>
                                        <span className="mt-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                            <time dateTime={post?.publishedAt}>{formatDate(post?.publishedAt)}</time> • 0 Views
                                        </span>
                                    </Link>
                                </div>
                                <div className="w-8 opacity-0 group-hover/g_pst:opacity-100">
                                    <PostViewActions id={post?.id} />
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    data?.loading && <PostLoadingSkelton count={6} />
                }
            </div>
            {
                data?.list?.length === 0 && !data?.loading && (
                    <div className="w-full flex justify-center items-center h-48">
                        <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                )
            }
        </>
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
                            borderRadius: '12px',
                        }
                    }
                }}>
                <ListItemRdX link={{ title: 'Share', url: '/share', icon: TbHeartHandshake }} />
                <ListItemRdX link={{ title: 'Bookmark', url: '/bookmark', icon: TbHeartHandshake }} />
                <ListItemRdX link={{ title: 'Report', url: '/report', icon: TbHeartHandshake }} />
                <ListItemRdX link={{ title: 'Print Post', url: '/report', icon: TbHeartHandshake }} />
            </Menu>
        </>
    );
};

const PostLoadingSkelton = ({ count }) => {
    return (
        Array(count).fill().map((_, index) => (
            <div key={index} className='w-full'>
                <Skeleton variant='rounded' className='!w-full h-96 block rounded-xl' animation="wave" />
                <div className='w-full mt-2 h-4 bg-lightHead dark:bg-darkHead animate-pulse rounded-xl'></div>
                <div className='w-5/12 mt-1 h-4 bg-lightHead dark:bg-darkHead animate-pulse rounded-xl'></div>
                <div className="mt-2 flex justify-start space-x-4 items-center">
                    <div className='w-3/12 h-2.5 bg-lightHead dark:bg-darkHead animate-pulse rounded-xl'></div>
                    <div className='w-1 h-1 bg-lightHead dark:bg-darkHead animate-pulse rounded-xl'></div>
                    <div className='w-3/12 h-2.5 bg-lightHead dark:bg-darkHead animate-pulse rounded-xl'></div>
                </div>
            </div>
        ))
    )
}

export { PostViewActions, PostView_TIA };