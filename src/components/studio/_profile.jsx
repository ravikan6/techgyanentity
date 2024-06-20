'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { image_URL_v2 } from '@/lib/resolver';
import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Avatar, ListItemIcon, Typography, List, Divider, Skeleton } from '@mui/material';
import { NavigateBefore, Check, HelpOutlineOutlined, DashboardCustomizeOutlined, SettingsOutlined, Person4Outlined, AdminPanelSettingsOutlined, NightsStayOutlined, WbSunnyOutlined, SettingsBrightness, Logout, FeedbackOutlined, KeyboardArrowRightOutlined, TranslateOutlined, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip, Button } from '@/components/rui';
import { ListItemRdX, ListInsideModel, ThemeSelect } from '@/components/Home/_profile-model';
import { StudioContext } from '@/lib/context';
import { SetAuthorStudioCookie } from '@/lib/actions/studio';
import { toast } from 'react-toastify';
import { getUserAuthors } from '@/lib/actions/user';


export const StudioServiceSelecterMenu = ({ session }) => {
    const usesession = useSession();
    if (usesession?.data) {
        session = usesession.data;
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const [insiderOpen, setInsiderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [insiderData, setInsiderData] = useState(null);

    const [currentData, setCurrentData] = useState({ name: session?.user?.name, image: session?.user?.picture, handle: session?.user?.username, url: `/@${session?.user?.username}`, createUrl: '/auth/login' });

    const context = useContext(StudioContext);
    const page = context?.data?.page;

    console.log(context?.data, 'context?.data', page, 'page');

    useMemo(() => {
        // if (page === 'channel') {
        //     setCurrentData({ ...currentData, ...context?.data?.data, url: `/${process.env.CHANNEL_URL_PREFIX}/@${context?.data?.data?.handle}` });
        // } else if (page === 'community') {
        setCurrentData({ ...currentData, ...context?.data?.data, url: `/author/@${context?.data?.data?.handle}` });
        // } else {
        //     setCurrentData({ ...currentData, name: session?.user?.name, id: session?.user?.id, image: session?.user?.picture, handle: session?.user?.username, url: `/@${session?.user?.username}` });
        // }
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
    // The above functions is used to handle the events of the main menu. (End)

    // The below is the code for the menu items of the main menu. (Start)

    return (
        <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', pr: '2px' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={(e) => { handleClick(e); setAnchorEl(e.currentTarget) }}
                        size="small"
                        aria-controls={menuOpen ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    >
                        <Avatar alt='Avatar' className='uppercase font-medium text-base' src={currentData?.image} sx={{ width: 32, height: 32 }}>{currentData?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                    </IconButton>
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
                            <Avatar alt='Avatar' className="w-20 h-20 rounded-full" src={currentData?.image}>{currentData?.name?.slice(0, 1)?.toUpperCase()}</Avatar>
                            <span className="mt-2 text-xl max-w-60 truncate font-medium cheltenham">Hi, {currentData?.name}</span>
                        </div>
                        <Button variant="outlined" color='accent' fullWidth >Manage your {process.env.APP_NAME} Account</Button>
                    </Box>


                    <Box elevation={0} className="bg-lightHead dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, boxShadow: null }}>

                        <SwitchAccount state={state} context={context} />

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
                <Box className="bg-lightHead dark:bg-darkHead absolute w-full" sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1, mt: -3, pt: 3 }}>
                    <IconButton sx={{ mr: 2 }} onClick={handleBack} size="small">
                        <NavigateBefore fontSize="small" />
                    </IconButton>
                    <Typography variant="inherit">{insiderData?.title}</Typography>
                </Box>
                {/* <Divider /> */}
                <p className='text-sm px-4 mt-10 py-2 text-wrap mx-auto text-slate-600 dark:text-slate-300' >{insiderData?.message}</p>
                {(insiderData?.component) ? insiderData?.component
                    : insiderData?.options.map((option, index) => (
                        <MenuItem onClick={() => insiderRun(option.value)} key={index} >
                            <ListItemIcon>
                                {option.value === insiderData?.selected ? <Check fontSize="small" /> : null}
                            </ListItemIcon>
                            {option.name}
                        </MenuItem>
                    ))
                }
            </Menu>

        </Fragment>
    );
}

const ListGridItem = ({ link, link2 }) => {
    return (
        <div key={link.name} className='flex justify-center space-x-1'>
            <MenuItem className="bg-lightHead w-1/2 dark:bg-darkHead rounded-r-2xl rounde-l-none" >
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
            <MenuItem className="bg-lightHead w-1/2 dark:bg-darkHead rounded-l-2xl rounde-r-none" >
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
    const { data: session } = useSession();

    const [pageInfo, setPageInfo] = useState({
        serviceName: 'Author',
        createUrl: '/setup/author',
        des: 'Comming soon...',
        disabled: true,
    });

    // useMemo(() => {
    //     if (context?.data?.page === 'channel') {
    //         setPageInfo({ ...pageInfo, serviceName: 'Channel', createUrl: '/setup/channel' });
    //     } else if (context?.data?.page === 'community') {
    //         setPageInfo({ ...pageInfo, serviceName: 'Community', createUrl: '/setup/community' });
    //     }
    // }, [context?.data?.page, state.insiderOpen]);

    const updateContextCookie = (data) => {
        try {
            SetAuthorStudioCookie(data).then((res) => {
                if (res) {
                    context.setData({ ...context.data, data: data });
                    state.handleInsiderClose();
                }
            });
        }
        catch (error) {
            toast.error(`An error occurred while switching to ${data?.name} ${pageInfo?.serviceName}. Please try again.`);
        }
    };

    const Component = () => {
        const [thisData, setThisData] = useState(null);
        let page = context?.data?.page;
        useMemo(async () => {
            try {
                const fdata = await getUserAuthors();
                setThisData(fdata?.data);
            } catch (error) {
                toast.error('An error occurred while fetching data. Please try again.');
            }
        }, [session, state.insiderOpen]);

        return (
            <div className='mb-2'>
                <div className='mx-4 my-2'>
                    <h3 className='text-sm cheltenham font-semibold'>{session?.user?.name}</h3>
                    <p className='text-xs'>{session?.user?.email}</p>
                </div>
                <Divider />
                <List className='mx-1 max-w-[320px]'>
                    {thisData ? thisData?.map((item, index) => {
                        item = { ...item, image: item?.logo || item?.avatar };
                        return (
                            <Fragment key={index} >
                                <MenuItem onClick={() => { !(context?.data?.data?.id === item?.id) && updateContextCookie(item) }}>
                                    <Tooltip title={`${item?.name} (${item?.handle})`}>
                                        <div className="flex items-center space-x-2 justify-between w-full">
                                            <ListItemIcon>
                                                <Avatar src={item?.image} className='uppercase font-semibold' sx={{ width: 32, height: 32 }}>{item?.name?.slice(0, 1)}</Avatar>
                                            </ListItemIcon>
                                            <div className="flex-1 flex-col ml-5 w-[calc(100%-80px)]">
                                                <h3 className='truncate text-base ml-0.5 font-semibold'>{item?.name}</h3>
                                                <p className='truncate text-sm' >@{item?.handle}</p>
                                            </div>
                                            <div className='w-5 flex justify-center items-center'>
                                                {context?.data?.data?.id === item?.id ? <Check fontSize="small" /> : null}
                                            </div>
                                        </div>
                                    </Tooltip>
                                </MenuItem>
                            </Fragment>
                        )
                    }) :
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
                        ))
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
    let newComp = useMemo(() => {
        return <Component />
    }, [context?.data?.data?.id, pageInfo]);

    return (
        <ListInsideModel link={{
            name: `Switch ${pageInfo?.serviceName}`,
            icon: Person4Outlined,
        }} data={{
            title: `Switch ${pageInfo?.serviceName}`, width: '320px', selected: context?.data?.data?.id, message: `Please select an ${pageInfo?.serviceName?.toLowerCase()} to switch to.`, component: newComp
        }} state={state} />
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
const CreateChannelBtn = () => {
    return (
        <MenuItem className="bg-lightHead w-full dark:bg-darkHead " >
            <Tooltip title="Click here to sign out">
                <Box onClick={() => { }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                    <ListItemIcon>
                        <Person4Outlined fontSize='small' />
                    </ListItemIcon>
                    <Typography variant="inherit truncate">Add Channel</Typography>
                </Box>
            </Tooltip>
        </MenuItem>
    )
}