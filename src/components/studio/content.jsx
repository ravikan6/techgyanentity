"use client";
import * as React from 'react';
import { getAuthorPosts } from "@/lib/actions/blog";
import { StudioContext } from "@/lib/context";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { IconButton, Tooltip } from '../rui';
import { useRouter } from 'next/navigation';
import { CiMenuKebab } from 'react-icons/ci';
import { MdOutlineAnalytics, MdOutlineComment, MdOutlineEdit } from 'react-icons/md';


const StudioContent = () => {
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState([]);
    const [isMapping, setIsMapping] = useState(false);
    const { data, setLoading, loading } = useContext(StudioContext);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const handler = async () => {
            if (data?.data?.id) {
                const dt = await getAuthorPosts(data?.data?.id);
                if (dt?.data) setPosts(dt.data);
            }
            setLoading(false);
        };
        handler();
    }, [data]);

    useEffect(() => {
        if (posts?.length > 0) {
            setIsMapping(true);
            const data = posts?.map((post) => {
                return {
                    id: post?.shortId,
                    post: post,
                    visibility: post?.privacy,
                    date: post?.publishedAt ? new Date(post?.publishedAt).toLocaleDateString() : new Date(post?.createdAt).toLocaleDateString(),
                    claps: post?._count?.claps,
                    comments: post?._count?.comments,
                };
            });
            setPostData(data);
            setIsMapping(false);
        }
    }, [posts]);

    const columns = [
        {
            field: 'post',
            headerName: 'Post',
            renderCell: (params) => {
                return (
                    <SidePostView post={params?.value} />
                );
            },
            width: 370,
        },
        { field: 'visibility', headerName: 'Visibility', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'claps', headerName: 'Claps', type: 'number', width: 90, },
        { field: 'comments', headerName: 'Comments', type: 'number', width: 90, },
    ];

    const SidePostView = ({ post }) => {
        return (
            <div key={post?.shortId} className="flex items-center h-full w-[99%] space-x-4">
                <div className="w-[100px] flex-shrink-0">
                    <CldImage width={100} height={56} src={post?.image?.url} alt={post?.image?.alt} className="rounded-lg bg-black/5 dark:bg-white/5" />
                </div>
                <div className="flex flex-col flex-grow justify-start w-[calc(100%-100px)] items-start">
                    <h3 className="text-base cheltenham block w-[99%] font-semibold line-clamp-1 truncate">{post?.title}</h3>
                    <div className="h-10 group/pst__view relative transition-all duration-300 w-[99%]">
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 visible group-hover/pst__view:invisible text-xs text-pretty transition-all duration-300">{post?.description}</p>
                        <div className="space-x-3 mb-2 top-1 absolute flex transition-all duration-300 justify-start items-center invisible group-hover/pst__view:visible w-full">
                            <IconView Icon={MdOutlineEdit} onClick={() => router.push(`/studio/p/${post?.shortId}/edit`)} tip='Edit' />
                            <IconView Icon={MdOutlineComment} onClick={() => toast('Comments')} tip='Comments' />
                            <IconView Icon={MdOutlineAnalytics} onClick={() => toast('Analytics')} tip='Analytics' />
                            <IconView Icon={CiMenuKebab} onClick={() => router.push(`/studio/p/${post?.shortId}/editor`)} tip='Menu' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const IconView = ({ Icon, onClick, tip }) => {
        return (
            <Tooltip title={tip} placement='bottom'>
                <IconButton onClick={onClick} >
                    <Icon className="w-5 h-5" color="primary" />
                </IconButton>
            </Tooltip>
        )
    };

    return (
        <div>
            {(loading || isMapping) ? <BetaLoader2 /> : <div>
                <DataTable rows={postData} columns={columns} />
            </div>}
        </div>
    );

};

function DataTable({ rows, columns }) {
    return (
        <div style={{ height: 400 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                rowHeight={68}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                    '&.MuiDataGrid-root': {
                        border: 'none',
                    },
                    '.MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    "& .MuiDataGrid-cell:focus-within": {
                        outline: 'none !important'
                    },
                    '& .MuiDataGrid-cell': {
                        border: 'none',
                    },

                }}
            />
        </div>
    );
}



export const BetaLoader2 = () => {
    return (
        <div class='flex space-x-2 justify-center items-centerw-full my-10'>
            <span class='sr-only'>Loading...</span>
            <div class='h-6 w-6 bg-lightButton dark:!bg-darkButton rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div class='h-6 w-6 bg-lightButton dark:!bg-darkButton rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div class='h-6 w-6 bg-lightButton dark:!bg-darkButton rounded-full animate-bounce'></div>
        </div>
    );
};

export default StudioContent;