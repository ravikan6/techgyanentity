"use client";
import * as React from 'react';
import { StudioContext } from "@/lib/context";
import { useContext, useEffect, useState, useMemo } from "react";
import { Button, IconButton, Tooltip } from '../rui';
import { useRouter } from 'next/navigation';
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
    darken,
    lighten,
    useTheme,
} from '@mui/material';
import { DrawerContext } from '../mainlayout';
import { PostDetailsTableViewMenu, PrivacyHandlerBtn } from '../Buttons';
import { RiLinkUnlinkM } from 'react-icons/ri';
import { ArticleImage } from '../post/_client';
import { gql, useQuery, useLazyQuery } from '@apollo/client';

const GET_AUTHOR_POSTS = gql`
query MyQuery($key: String = "") {
  Creators(key: $key) {
    edges {
      node {
        storySet {
          edges {
            node {
              updatedAt
              title
              state
              slug
              scheduledAt
              publishedAt
              privacy
              key
              isDeleted
              id
              description
              deletedAt
              createdAt
              image {
                url
                alt
              }
            }
          }
        }
      }
    }
  }
}`;

const StudioContent = () => {
    const [stories, setStories] = useState([]);
    const { data, setLoading, loading: contextLoading } = useContext(StudioContext);

    const { variant, open } = useContext(DrawerContext);
    const theme = useTheme();

    const [loadStories, { data: creatorStories, loading, called }] = useLazyQuery(GET_AUTHOR_POSTS, {
        variables: {
            key: data?.data?.key
        }
    })

    useEffect(() => {
        if (data?.data?.key && !called) {
            loadStories();
        }
    }, [data]);

    useEffect(() => {
        if (creatorStories) {
            const stories = creatorStories?.Creators?.edges[0]?.node?.storySet?.edges;
            const data = stories.map((edge) => {
                const node = edge.node;
                return {
                    story: node,
                    visibility: node?.privacy,
                    date: {
                        value: node?.publishedAt || node?.scheduledAt || node?.createdAt,
                        label: node?.publishedAt ? 'Published' : node?.scheduledAt ? 'Scheduled' : 'Draft'
                    },
                    claps: 0,
                    comments: 0,
                }
            });
            setStories(stories);
        }
    }, [creatorStories]);

    const columns = useMemo(() => [
        {
            accessorFn: (row) => row?.story?.title,
            id: 'story',
            header: 'Post',
            size: 320,
            maxSize: 320,
            Cell: ({ renderedCellValue, row }) => {
                return <SidePostView story={row.original.story} title={renderedCellValue} setStories={setStories} />
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
            Cell: ({ cell, row }) => <div className='flex flex-col text-center'><span className='text-center'>{formatDate(cell.getValue())}</span> <span className="opacity-70 text-center">{row?.original?.date?.label}</span></div>
        },
        {
            accessorKey: 'claps',
            filterFn: 'between',
            header: 'Claps',
            columnFilterModeOptions: ['between', 'lessThan', 'greaterThan'],
        },
        {
            accessorKey: 'comments',
            header: 'Comments',
            enableColumnFilter: false,
            enableGlobalFilter: false,
        },

    ]);

    const baseBackgroundColor =
        theme.palette.mode === 'dark'
            ? 'rgb(26, 45, 76, 1)'
            : 'rgb(253, 236, 236, 0)';

    const table = useMaterialReactTable({
        columns,
        data: stories,
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
            ...((variant === 'permanent') && {
                columnPinning: {
                    left: ['mrt-row-select', 'story'],
                }
            })
        },
        enableGlobalFilterModes: true,
        globalFilterModeOptions: ['fuzzy', 'startsWith', 'date', 'contains', 'equals'],
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'head-overlay',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'standard',
            placeholder: ' ',
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
        state: {
            showSkeletons: loading,
        },
        muiTableBodyProps: {
            sx: (theme) => ({
                '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
                {
                    backgroundColor: baseBackgroundColor,
                },
                '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
                {
                    backgroundColor: darken(baseBackgroundColor, 0.2),
                },
                '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
                {
                    backgroundColor: baseBackgroundColor,
                },
                '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
                {
                    backgroundColor: darken(baseBackgroundColor, 0.2),
                },
                '& tr > td:not([data-pinned="false"])::before':
                {
                    backgroundColor: 'var(--rb-palette-background-default)',
                },
            }),
        },
        muiTableHeadProps: {
            sx: (theme) => ({
                '& th': {
                    backgroundColor: 'var(--rb-palette-background-default)',
                },
                '& th[data-pinned="true"]::before': {
                    backgroundColor: 'var(--rb-palette-background-default)',
                }
            }),
        },
        muiTableContainerProps: {
            sx: { maxHeight: 'calc(100vh - 210px) !important', height: 'calc(100vh - 210px)' },
            style: { maxHeight: 'calc(100vh - 210px) !important', minHeight: '300px' }
        },
        mrtTheme: (theme) => ({
            baseBackgroundColor: baseBackgroundColor,
            draggingBorderColor: theme.palette.secondary.main,
            pinnedRowBackgroundColor: 'var(--rb-palette-background-default)',
        }),
        renderTopToolbar: ({ table }) => {
            const handleDeactivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('deactivating ' + row.original?.story?.shortId);
                });
            };

            return (
                <>
                    <div className="flex items-center justify-between w-full px-7 md:px-2 mb-1 pt-2 sm:w-auto sm:justify-start space-x-2 md:space-x-3 lg:space-x-5">
                        {
                            [{ name: 'Post', value: 'story' }, { name: 'Web Stories', value: 'webstories' }, { name: 'Short Article', value: 'shortarticle' }].map((item, index) => {
                                return (
                                    <Button disabled={contextLoading} key={index} onClick={() => console.log('Clicked')} variant="contained" sx={{ px: { xs: 3, sm: 1.4, md: 2.3, lg: 3 } }} className={`font-semibold truncate !text-nowrap cheltenham ${'story' === item.value ? '!bg-lightButton dark:!bg-darkButton !text-black dark:!text-black' : '!bg-light dark:!bg-dark !text-slate-900 dark:!text-slate-100'}`} color="button" size="small" >
                                        {item.name}
                                    </Button>
                                );
                            })
                        }
                    </div>
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            gap: '0.5rem',
                            px: '8px',
                            justifyContent: 'space-between',
                        })}
                    >
                        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <MRT_ToggleFiltersButton table={table} />
                            <MRT_GlobalFilterTextField sx={{ border: 'none' }} slotProps={{ input: { startAdornment: null, endAdornment: null, disableUnderline: true } }} table={table} />
                        </Box>
                        {/* <Box>
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
                        </Box> */}
                    </Box>
                </>
            );
        },
    });

    return (
        <div className={`${(variant === 'permanent') ? 'md:-mx-5' : 'md:mx-0'} -mx-6`}>
            <MaterialReactTable table={table} />
        </div>
    );

};

const SidePostView = ({ story, title, setStories }) => {
    const router = useRouter();
    const { data } = useContext(StudioContext);

    return (
        <div key={story?.key} className="flex max-w-[370px] min-w-[370px] items-center h-full w-[99%] space-x-4">
            <div className="w-[100px] flex-shrink-0">
                <ArticleImage image={story?.image} width={100} height={56} className={'bg-black/5 dark:bg-white/5 !rounded'} />
            </div>
            <div className="flex flex-col flex-grow justify-start w-[calc(100%-100px)] items-start">
                <h3 className="text-base cheltenham block w-[99%] font-semibold line-clamp-1 truncate">{title}</h3>
                <div className="h-10 relative transition-all duration-300 w-[99%]">
                    <p className="text-gray-600 rb__studio__content__desc dark:text-gray-400 line-clamp-2 text-xs text-pretty">{story?.description}</p>
                    <div className="space-x-4 md:space-x-6 top-1.5 rb__studio__content__action absolute flex justify-start items-center w-full">
                        <IconView Icon={MdOutlineEdit} onClick={() => router.push(`/studio/p/${story?.key}/edit`)} tip='Edit' />
                        <IconView Icon={MdOutlineComment} onClick={() => router.push(`/studio/p/${story?.key}/comments`)} tip='Comments' />
                        <IconView Icon={MdOutlineAnalytics} onClick={() => router.push(`/studio/p/${story?.key}/analytics`)} tip='Analytics' />
                        <IconView Icon={RiLinkUnlinkM} onClick={() => window.open(`/${data?.data?.handle ? `@${data?.data?.handle}` : 'story'}/${story?.slug}`, '_blank')} tip='Read it on Post Page' />
                        <PostDetailsTableViewMenu url={story?.slug} data={{ id: story?.key, img: story?.image?.url, title: title, description: story?.description }} setStories={setStories} />
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
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StudioContent />
            </LocalizationProvider>
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