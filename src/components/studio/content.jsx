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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
} from 'material-react-table';
import {
    Box,
    lighten,
} from '@mui/material';
import { DrawerContext } from '../mainlayout';
import { PrivacyHandlerBtn } from '../Buttons';
import { PiReadCvLogo } from 'react-icons/pi';


const StudioContent = () => {
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState([]);
    const [isMapping, setIsMapping] = useState(true);
    const { data, setLoading, loading } = useContext(StudioContext);

    const { variant, open } = useContext(DrawerContext);

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
            !isMapping && setIsMapping(true);
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
            size: 320,
            Cell: ({ renderedCellValue, row }) => {
                return <SidePostView post={row.original.post} title={renderedCellValue} />
            },
            columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith'],
        },
        {
            accessorKey: 'visibility',
            header: 'Visibility',
            enableColumnFilter: false,
            enableGlobalFilter: false,
            Cell: ({ renderedCellValue, row }) => {
                const v = row.original?.visibility;
                return (
                    <div className='flex items-center'>
                        <PrivacyHandlerBtn privacy={v?.toLowerCase()} />
                        <span className='text-[16px] mt-0.5 ml-2'>
                            {v?.slice(0, 1) + v?.slice(1).toLowerCase()   /* Capitalize first letter */}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorFn: (row) => new Date(row?.date?.value),
            id: 'date',
            header: 'Date',
            filterVariant: 'date',
            columnFilterModeOptions: ['date'],
            Cell: ({ cell, row }) => <div className='flex flex-col text-center'><span className='text-center'>{formatDate(cell.getValue())}</span> <span className="opacity-80 text-center">{row?.original?.date?.label}</span></div>
        },
        {
            accessorKey: 'claps',
            filterFn: 'between',
            header: 'Claps',
            size: 200,
            columnFilterModeOptions: ['between', 'lessThan', 'greaterThan'],
        },
        {
            accessorKey: 'comments',
            header: 'Comments',
            enableColumnFilter: false,
            enableGlobalFilter: false,
        },

    ]);

    const table = useMaterialReactTable({
        columns,
        data: postData,
        enableColumnFilterModes: true,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: false,
        enableRowSelection: true,
        enableExpanding: false,
        enableStickyHeader: true,
        initialState: {
            showColumnFilters: false,
            showGlobalFilter: true,
            ...(variant === 'permanent') && {
                columnPinning: {
                    left: ['mrt-row-select', 'post'],
                }
            }
        },
        enableGlobalFilterModes: true,
        globalFilterModeOptions: ['fuzzy', 'startsWith', 'date', 'contains', 'equals'],
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'circular',
            variant: 'outlined',
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
                backgroundColor: 'transparent',
            },
        },
        muiTableHeadCellProps: ({ column }) => ({
            sx: ({ theme }) => ({
                backgroundColor: theme?.palette?.background?.default || 'var(--rb-palette-background-default)',
            }),
            className: `${column.getIsPinned() && 'before:!shadow-none'}`
        }),
        muiTableBodyCellProps: ({ column }) => ({
            sx: ({ theme }) => ({
                backgroundColor: theme?.palette?.background?.default || 'var(--rb-palette-background-default)',
            }),
            className: `${column.getIsPinned() && 'before:!shadow-none'}`
        }),
        renderEmptyRowsFallback: ({ table }) => (
            <div className="flex justify-center min-h-96 items-center">No Posts Found</div>
        ),
        renderTopToolbar: ({ table }) => {
            const handleDeactivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('deactivating ' + row.original?.post?.shortId);
                });
            };

            return (
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        gap: '0.5rem',
                        p: '8px',
                        justifyContent: 'space-between',
                    })}
                >
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_GlobalFilterTextField sx={{ border: 'none' }} InputProps={{ startAdornment: null, endAdornment: null }} table={table} />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                                color="button"
                                disabled={!table.getIsSomeRowsSelected()}
                                onClick={handleDeactivate}
                                variant="outlined"
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Box>
            );
        },
    });

    return (
        <div style={{ margin: (variant === 'permanent') && '0 -20px' }}>
            <MaterialReactTable table={table} state={{ isLoading: isMapping, showSkeletons: isMapping }} muiTableContainerProps={{ sx: { maxHeight: 'calc(100vh - 116px)' } }} />
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
                    <div className="space-x-4 md:space-x-8 top-1.5 rb__studio__content__action absolute flex justify-between items-center w-full">
                        <IconView Icon={MdOutlineEdit} onClick={() => router.push(`/studio/p/${post?.shortId}/edit`)} tip='Edit' />
                        <IconView Icon={MdOutlineComment} onClick={() => router.push(`/studio/p/${post?.shortId}/comments`)} tip='Comments' />
                        <IconView Icon={MdOutlineAnalytics} onClick={() => router.push(`/studio/p/${post?.shortId}/analytics`)} tip='Analytics' />
                        <IconView Icon={PiReadCvLogo} onClick={() => router.push(`/post/${post?.slug}`)} tip='Read on Main Page' />
                        <IconView Icon={CiMenuKebab} onClick={() => router.push(`/studio/`)} tip='Menu' />
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
                <Icon className="w-5 h-5 text-black dark:text-white" />
            </IconButton>
        </Tooltip>
    )
};

const StudioContentView = () => {
    const { loading } = useContext(StudioContext);

    return (
        <>
            <div className='h-[calc(100vh-57px)]'>
                <div className="flex overflow-x-auto h-[60px] flex-wrap justify-between px-4 items-center py-2 rounded-xl bg-lightHead dark:bg-darkHead -mx-4 sm:space-x-1">
                    <div className="flex items-center justify-between w-full mb-1 mt-1 sm:w-auto sm:justify-start space-x-2 md:space-x-3 lg:space-x-5">
                        {
                            [{ name: 'Post', value: 'post' }, { name: 'Web Stories', value: 'webstories' }, { name: 'Short Article', value: 'shortarticle' }].map((item, index) => {
                                return (
                                    <Button disabled={loading} key={index} onClick={() => console.log('Clicked')} variant="contained" sx={{ px: { xs: 3, sm: 1.4, md: 2.3, lg: 3 } }} className={`font-semibold truncate !text-nowrap cheltenham ${'post' === item.value ? '!bg-accentLight dark:!bg-accentDark !text-white dark:!text-secondaryDark' : '!bg-light dark:!bg-dark !text-slate-900 dark:!text-slate-100'}`} color="primary" size="small" >
                                        {item.name}
                                    </Button>
                                );
                            })
                        }
                    </div>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StudioContent />
                </LocalizationProvider>
            </div>
        </>
    )
};

export default StudioContentView;

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