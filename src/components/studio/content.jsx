"use client";
import * as React from 'react';
import { getAuthorPosts } from "@/lib/actions/blog";
import { StudioContext } from "@/lib/context";
import { CldImage } from "next-cloudinary";
import { useContext, useEffect, useState, useMemo } from "react";
import { toast } from 'react-toastify';
import { Button, IconButton, MenuItem, Tooltip } from '../rui';
import { useRouter } from 'next/navigation';
import { CiMenuKebab } from 'react-icons/ci';
import { MdOutlineAnalytics, MdOutlineComment, MdOutlineEdit } from 'react-icons/md';
import { formatDate } from '@/lib/utils';


import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';

import {
    Box,
    ListItemIcon,
    Typography,
    lighten,
} from '@mui/material';
import { AccountCircle, Send } from '@mui/icons-material';


const StudioContent = () => {
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState([]);
    const [isMapping, setIsMapping] = useState(false);
    const { data, setLoading, loading } = useContext(StudioContext);

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
                    date: post?.publishedAt ? { value: post?.publishedAt, label: 'Published' } : { value: post?.createdAt, label: 'Created' },
                    claps: post?._count?.claps,
                    comments: post?._count?.comments,
                };
            });
            setPostData(data);
            setIsMapping(false);
        }
    }, [posts]);

    const columns = useMemo(() => [
        {
            accessorFn: (row) => row?.post?.title,
            id: 'post',
            header: 'Post',
            size: 370,
            Cell: ({ renderedCellValue, cell, row }) => {
                console.log(renderedCellValue, cell, row, '_____________tbl')
                return <SidePostView post={cell} title={renderedCellValue} />
            },
        },
        {
            accessorKey: 'visibility',
            header: 'Visibility',
        },
        {
            accessorFn: (row) => new Date(row?.date?.value),
            id: 'date',
            header: 'Date',
            filterVariant: 'date',
            Cell: ({ cell, row }) => <div className='flex flex-col'><span>{formatDate(cell.getValue())}</span> <span>{row?.date?.label}</span></div>
        },
        {
            accessorKey: 'claps',
            filterFn: 'between',
            header: 'Claps',
            size: 200,
        },
        {
            accessorKey: 'comments',
            header: 'Comments',
        },

    ]);

    const table = useMaterialReactTable({
        columns,
        data: postData,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: false,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: false,
        enableRowSelection: true,
        initialState: {
            showColumnFilters: false,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select', 'post'],
            },
        },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined',
        },
        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-around',
                    left: '30px',
                    maxWidth: '1000px',
                    position: 'sticky',
                    width: '100%',
                }}
            >
                {JSON.stringify(row)}
            </Box>
        ),
        renderRowActionMenuItems: ({ closeMenu }) => [
            <MenuItem
                key={0}
                onClick={() => {
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <AccountCircle />
                </ListItemIcon>
                View Profile
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={() => {
                    // Send email logic...
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Send />
                </ListItemIcon>
                Send Email
            </MenuItem>,
        ],
        renderTopToolbar: ({ table }) => {
            const handleDeactivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('deactivating ' + row.getValue('post'));
                });
            };

            const handleActivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('activating ' + row.getValue('name'));
                });
            };

            const handleContact = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('contact ' + row.getValue('name'));
                });
            };

            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(theme.palette.background.default, 0.05),
                        display: 'flex',
                        gap: '0.5rem',
                        p: '8px',
                        justifyContent: 'space-between',
                    })}
                >
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* import MRT sub-components */}
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                                color="error"
                                disabled={!table.getIsSomeRowsSelected()}
                                onClick={handleDeactivate}
                                variant="contained"
                            >
                                Deactivate
                            </Button>
                            <Button
                                color="success"
                                disabled={!table.getIsSomeRowsSelected()}
                                onClick={handleActivate}
                                variant="contained"
                            >
                                Activate
                            </Button>
                            <Button
                                color="info"
                                disabled={!table.getIsSomeRowsSelected()}
                                onClick={handleContact}
                                variant="contained"
                            >
                                Contact
                            </Button>
                        </Box>
                    </Box>
                </Box>
            );
        },
    });

    return (
        <div>
            {(loading || isMapping) ? <BetaLoader2 /> : <div>
                <MaterialReactTable table={table} />
            </div>}
        </div>
    );

};

const SidePostView = ({ post, title }) => {
    const router = useRouter();

    return (
        <div key={post?.shortId} className="flex items-center h-full w-[99%] space-x-4">
            <div className="w-[100px] flex-shrink-0">
                <CldImage width={100} height={56} src={post?.image?.url} alt={post?.image?.alt} className="rounded-lg bg-black/5 dark:bg-white/5" />
            </div>
            <div className="flex flex-col flex-grow justify-start w-[calc(100%-100px)] items-start">
                <h3 className="text-base cheltenham block w-[99%] font-semibold line-clamp-1 truncate">{title}</h3>
                <div className="h-10 relative transition-all duration-300 w-[99%]">
                    <p className="text-gray-600 rb__studio__content__desc dark:text-gray-400 line-clamp-2 text-xs text-pretty">{post?.description}</p>
                    <div className="space-x-3 mb-2 top-1 rb__studio__content__action absolute flex justify-start items-center w-full">
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