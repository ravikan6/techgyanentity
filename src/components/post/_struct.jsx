"use client";
import Link from "next/link";
import { ArticleImage } from "./_client";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "../rui";
import { PiDotsThreeCircleVertical } from "react-icons/pi";
import { ListItemIcon, MenuList } from "@mui/material";
import { TbHeartHandshake } from "react-icons/tb";


const PostView_TIA = ({ data }) => {

    return (
        <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                {
                    data?.list?.map((post) => (
                        <div key={post?.slug} className="text-left relative group/g_pst">
                            <Link href={`/${post?.author?.handle}/${post.slug}`}>
                                <ArticleImage classes="rounded-lg" image={post?.image} />
                                <div className="mt-2">
                                    <div className="w-[calc(100%-20px)]">
                                        <h2 className="text-sm md:text-base xl:text-lg mt-2 font-bold cheltenham line-clamp-2 truncate">{post.title}</h2>
                                        <span className="mt-1.5 text-gray-600 dark:text-gray-400">
                                            <time dateTime={post?.publishedAt}>{formatDate(post?.publishedAt)}</time> • 0 Views
                                        </span>
                                    </div>
                                    <div className="w-5">
                                        <PostViewActions id={post?.id} />
                                    </div>
                                </div>
                            </Link>
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
                <PiDotsThreeCircleVertical className="w-5 h-5" />
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