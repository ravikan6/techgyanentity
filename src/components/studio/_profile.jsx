'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Avatar, ListItemIcon, Typography, List, Divider, Skeleton } from '@mui/material';
import { NavigateBefore, Check, HelpOutlineOutlined, DashboardCustomizeOutlined, SettingsOutlined, Person4Outlined, AdminPanelSettingsOutlined, NightsStayOutlined, WbSunnyOutlined, SettingsBrightness, Logout, FeedbackOutlined, KeyboardArrowRightOutlined, TranslateOutlined, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip, Button } from '@/components/rui';
import { ListItemRdX, ListInsideModel, ThemeSelect, SecondaryMenu } from '@/components/Home/_profile-model';
import { StudioContext } from '@/lib/context';
import { SetAuthorStudioCookie } from '@/lib/actions/studio';
import { toast } from 'react-toastify';
import { gql, useQuery } from '@apollo/client';


export const StudioServiceSelecterMenu = ({ session, canSwitchAuthor = true }) => {
    const usesession = useSession();
    if (usesession?.data) {
        session = usesession.data;
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const [insiderOpen, setInsiderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [insiderData, setInsiderData] = useState(null);

    const [currentData, setCurrentData] = useState({ name: session?.user?.name, image: { url: session?.user?.image }, handle: session?.user?.username, url: `/@${session?.user?.username}`, createUrl: '/auth/login' });

    const context = useContext(StudioContext);
    const page = context?.data?.page;
    useMemo(() => {
        setCurrentData({ ...currentData, ...context?.data?.data, url: `/author/@${context?.data?.data?.handle}` });
    }, [context]);

    // The below functions is used to handle the events of the main menu. (Start)
    const handleClick = (event) => {
        setMenuOpen(true);
    };

    const handleClose = () => {
        setMenuOpen(false);
    };

    const handleInsiderOpen = (event) => {
        setInsiderOpen(true);
        handleClose(); // Close the first menu when the second menu is opened
    };

    const handleInsiderClose = () => {
        setInsiderOpen(false);
    };

    const handleBack = () => {
        setInsiderOpen(false);
        setMenuOpen(true);
    }

    const insiderRun = (value) => {
        setInsiderData({ ...insiderData, selected: value });

    }

    const state = {
        insiderOpen: insiderOpen,
        insiderData: insiderData,
        setInsiderData: setInsiderData,
        handleInsiderOpen: handleInsiderOpen,
        handleInsiderClose: handleInsiderClose,
    }

    return (
        <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', pr: '2px', position: 'relative' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={(e) => { handleClick(e); setAnchorEl(e.currentTarget) }}
                        size="small"
                        aria-controls={menuOpen ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    >
                        <Avatar alt='Avatar' className='uppercase font-medium text-base' src={currentData?.image?.url} sx={{ width: 32, height: 32 }}>{currentData?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                    </IconButton>
                    <div className='rounded-full w-4 h-4 box-border border-2 border-solid border-light dark:border-dark absolute -top-1 -right-1 flex justify-center items-center'>
                        <Link href={'/account'}>
                            <Avatar alt='Avatar' className='uppercase font-xs text-base' src={session?.user?.image} sx={{ width: 14, height: 14 }}>{session?.user?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                        </Link>
                    </div>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={menuOpen}
                onClose={handleClose}
                sx={{
                    minWidth: '260px',
                    height: 'calc(100%-80px)',
                    mt: 1.5,
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="rb_SideBar_ScrollBar overflow-y-auto"
            >
                <div className='px-2'>
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                        <div className="flex my-4 flex-col items-center justify-center">
                            <Avatar alt='Avatar' className="!w-20 !h-20 rounded-full" src={currentData?.image?.url}>{currentData?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                            <span className="mt-2 text-xl max-w-60 truncate font-medium cheltenham">Hi, {currentData?.name}</span>
                        </div>
                        <Tooltip title="Manage your Account">
                            <Button href='/account' variant="outlined" startIcon={<Avatar alt='Avatar' className='uppercase font-medium text-base' src={session?.user?.image} sx={{ width: 24, height: 24 }}>{session?.user?.name?.slice(0, 1)?.toUpperCase()}</Avatar>} color='secondary' ><span className='ml-2.5 truncate'>{session?.user?.email}</span></Button>
                        </Tooltip>
                    </Box>

                    <Box elevation={0} className="bg-lightHead dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, boxShadow: null }}>

                        {canSwitchAuthor ? <SwitchAccount state={state} context={context} /> : null}

                        <ListItemRdX link={{
                            name: 'Your data & privacy',
                            url: '/settings/data-privacy',
                            icon: AdminPanelSettingsOutlined,
                        }} />

                        <ThemeSelect state={state} />

                        <ListInsideModel link={{
                            name: `Language`,
                            selected: 'english',
                            icon: TranslateOutlined,
                        }} data={{
                            title: 'Language', selected: 'english', message: 'change you language', options: [{ name: 'English', value: 'english' }, { name: 'Hindi', value: 'hindi' }, { name: 'French', value: 'french' }, { name: 'Spanish', value: 'spanish' }], component: null
                        }} state={state} />
                    </Box>
                    <div className='mt-2 mb-2'>
                        <ListGridItem link={{
                            name: 'Help',
                            url: '/help',
                            icon: HelpOutlineOutlined,
                        }} link2={{
                            name: 'Send Feedback',
                            url: '/feedback',
                            icon: FeedbackOutlined,
                        }} />
                    </div>
                    <SIgnOutMenuBtn />
                    <div className="flex justify-center mt-3 mb-1 items-center space-x-2">
                        <Button className="!text-xs">Privacy Policy</Button>
                        <span>.</span>
                        <Button className="!text-xs">Terms of Service</Button>
                    </div>
                </div>
            </Menu>
            <Menu
                anchorEl={anchorEl}
                id="account-menu-inside"
                open={insiderOpen}
                onClose={handleInsiderClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            width: insiderData?.width || '256px',
                            pt: '0 !important',
                        }
                    }
                }}
                sx={{
                    mt: 1.5,
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <SecondaryMenu insiderData={insiderData} insiderRun={insiderRun} handleBack={handleBack} modern={false} state={state} />
            </Menu>

        </Fragment>
    );
}

const ListGridItem = ({ link, link2 }) => {
    return (
        <div key={link.name} className='flex justify-center space-x-1'>
            <MenuItem className="!bg-lightHead w-1/2 dark:!bg-darkHead rounded-r-2xl rounde-l-none" >
                <Tooltip title={link.helpText || link.name} placement="bottom-start">
                    <Link onClick={link?.onClick} className='w-full' href={link.url}>
                        <Box component="a" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                            <ListItemIcon>
                                <link.icon fontSize='small' />
                            </ListItemIcon>
                            <Typography variant="inherit truncate">{link.name}</Typography>
                        </Box>
                    </Link>
                </Tooltip>
            </MenuItem>
            <MenuItem className="!bg-lightHead w-1/2 dark:!bg-darkHead rounded-l-2xl rounde-r-none" >
                <Tooltip title={link2.helpText || link2.name} placement="bottom-start">
                    <Link onClick={link2?.onClick} className='w-full' href={link2.url}>
                        <Box component="a" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                            <ListItemIcon>
                                <link2.icon fontSize='small' />
                            </ListItemIcon>
                            <Typography variant="inherit truncate">{link2.name}</Typography>
                        </Box>
                    </Link>
                </Tooltip>
            </MenuItem>
        </div>
    )
};

const SwitchAccount = ({ state, context }) => {

    const [pageInfo, setPageInfo] = useState({
        serviceName: 'Author',
        createUrl: '/setup/author',
        des: 'Add new Creator Profile',
        // disabled: true,
    });

    return (
        <ListInsideModel link={{
            name: `Switch ${pageInfo?.serviceName}`,
            icon: Person4Outlined,
        }} data={{
            title: `Switch ${pageInfo?.serviceName}`, width: '320px', selected: context?.data?.data?.key, message: `Please select an ${pageInfo?.serviceName?.toLowerCase()} to switch to.`, component: AccountProfilesSwitcherView, isJsx: true, componentProps: { pageInfo: pageInfo },
        }} state={state} />
    )
}

const AccountProfilesSwitcherView = ({ state, pageInfo }) => {
    const context = useContext(StudioContext);
    let page = context?.data?.page;
    const { data: session } = useSession();

    const GET_USER_CREATORS = gql`
    query MyCretorAccounts {
      Me {
        creatorSet {
          edges {
            node {
                key
                name
                handle
                image {
                    url
                }
            }
          }
        }
      }
    }`;

    const { data, loading, refetch, error } = useQuery(GET_USER_CREATORS, {
        fetchPolicy: 'network-only'
    });
    console.log(data, loading, error)

    const updateContextCookie = (data) => {
        try {
            SetAuthorStudioCookie(data?.key).then((res) => {
                if (res) {
                    state.handleInsiderClose();
                    // window.location.reload();
                    context.setData({ ...context.data, data: data });
                }
            });
        }
        catch (error) {
            toast.error(`An error occurred while switching to ${data?.name} ${pageInfo?.serviceName}. Please try again.`);
        }
    };

    return (
        <div className='mb-2'>
            <div className='mx-4 my-2'>
                <h3 className='text-sm cheltenham font-semibold'>{session?.user?.name}</h3>
                <p className='text-xs'>{session?.user?.email}</p>
            </div>
            <Divider />
            <List className='mx-1 max-w-[320px]'>
                {loading ?
                    [1, 2].map((_, index) => (
                        <MenuItem key={index} sx={{ my: 1 }} >
                            <div className="flex items-center space-x-2 justify-between w-full">
                                <Skeleton variant="circular" width={32} height={32} animation='wave' />
                                <div className="flex-1 flex-col ml-5 w-[calc(100%-80px)]">
                                    <Skeleton variant="text" width={100} height={20} animation='wave' />
                                    <Skeleton variant="text" width={50} height={15} animation='wave' />
                                </div>
                                <div className='w-5 flex justify-center items-center'>
                                    <Skeleton variant="circular" width={20} height={20} animation='wave' />
                                </div>
                            </div>
                        </MenuItem>
                    )) :
                    error == undefined ? data?.Me?.creatorSet?.edges?.map((item, index) => {
                        item = item.node
                        return (
                            <Fragment key={index} >
                                <MenuItem onClick={() => { !(context?.data?.data?.key === item?.key) ? updateContextCookie(item) : null }}>
                                    <Tooltip title={`${item?.name} (${item?.handle})`}>
                                        <div className="flex items-center space-x-2 justify-between w-full">
                                            <ListItemIcon>
                                                <Avatar src={item?.image?.url} className='uppercase font-semibold' sx={{ width: 40, height: 40 }}>{item?.name?.slice(0, 1)}</Avatar>
                                            </ListItemIcon>
                                            <div className="flex-1 flex-col ml-6 w-[calc(100%-80px)]">
                                                <h3 className='truncate text-base ml-0.5 font-semibold'>{item?.name}</h3>
                                                <p className='truncate text-sm' >@{item?.handle}</p>
                                            </div>
                                            <div className='w-5 flex justify-center items-center'>
                                                {context?.data?.data?.key === item?.key ? <Check className='text-accentLight dark:text-accentDark' fontSize="small" /> : null}
                                            </div>
                                        </div>
                                    </Tooltip>
                                </MenuItem>
                            </Fragment>
                        )
                    })
                        : <>
                            <div className='flex flex-col gap-2 items-center  justify-center p-2'>
                                <p>
                                    {error.message || 'Something went wrong.'}
                                </p>
                                <Button variant='outlined' size="small" onClick={refetch}>
                                    Retry
                                </Button>
                            </div>
                        </>
                }
            </List>
            <Divider />
            <div className='mx-4 mt-2 flex flex-col space-y-3'>
                <ListGridItem link={{
                    name: `Add ${pageInfo?.serviceName}`,
                    url: `${pageInfo?.createUrl}`,
                    icon: Person4Outlined,
                    helpText: pageInfo?.des,
                }} link2={{
                    name: `Sign Out`,
                    url: '#',
                    icon: Logout,
                    onClick: () => signOut(),
                    helpText: 'Click here to sign out',
                }} />
            </div>
        </div>
    )
}


const SIgnOutMenuBtn = () => {
    return (
        <MenuItem className="bg-lightHead w-full dark:bg-darkHead " >
            <Tooltip title="Click here to sign out">
                <Box onClick={() => signOut()} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                    <ListItemIcon>
                        <Logout fontSize='small' />
                    </ListItemIcon>
                    <Typography variant="inherit truncate">Sign Out</Typography>
                </Box>
            </Tooltip>
        </MenuItem>
    )
}