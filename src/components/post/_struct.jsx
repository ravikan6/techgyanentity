"use client";
import Link from "next/link";
import { ArticleImage } from "./_client";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "../rui";
import { PiDotsThreeVertical } from "react-icons/pi";
import { ListItemIcon, MenuList } from "@mui/material";
import { TbHeartHandshake } from "react-icons/tb";


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
                                <Link href={`/${post?.author?.handle}/${post.slug}`}>
                                    <div className="w-[calc(100%-32px)]">
                                        <h2 className="text-base font-bold cheltenham line-clamp-2 text-ellipsis">{post.title}</h2>
                                        <span className="mt-1.5 text-gray-600 dark:text-gray-400 text-sm">
                                            <time dateTime={post?.publishedAt}>{formatDate(post?.publishedAt)}</time> • 0 Views
                                        </span>
                                    </div>
                                </Link>
                                <div className="w-8 opacity-0 group-hover/g_pst:opacity-100">
                                    <PostViewActions id={post?.id} />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
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
                sx={{ zIndex: '999' }} >
                <MenuList className='min-w-44'>
                    <MenuItem>
                        <ListItemIcon>
                            <TbHeartHandshake className='w-6 h-6' />
                        </ListItemIcon>
                        <span className='text-sm'>Share</span>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon >
                            <TbHeartHandshake className='w-6 h-6' />
                        </ListItemIcon>
                        <span className='text-sm'>Add to Read Later</span>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon >
                            <TbHeartHandshake className='w-6 h-6' />
                        </ListItemIcon>
                        <span className='text-sm'>Report Thumbnail</span>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon >
                            <TbHeartHandshake className='w-6 h-6' />
                        </ListItemIcon>
                        <span className='text-sm'>Add on Recommandation</span>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};


export { PostViewActions, PostView_TIA };