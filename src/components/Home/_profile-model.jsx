'use client';
import Link from 'next/link';
import { ThemeSwitch } from '../theme';
import { signOut } from 'next-auth/react';
import { image_URL_v2 } from '@/lib/resolver';
import { Fragment, useEffect, useState } from 'react'
import { Box, Avatar, ListItemIcon, Typography, List, Divider } from '@mui/material';
import { NavigateBefore, Check, HelpOutlineOutlined, DashboardCustomizeOutlined, SettingsOutlined, Person4Outlined, AdminPanelSettingsOutlined, NightsStayOutlined, WbSunnyOutlined, SettingsBrightness, Logout, FeedbackOutlined, KeyboardArrowRightOutlined, TranslateOutlined, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip, Button } from '@/components/rui';

export const UserProfileModel = ({ data }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [insiderOpen, setInsiderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [insiderData, setInsiderData] = useState(null);

    const handleClick = (event) => {
        setMenuOpen(event.currentTarget);
    };

    const handleClose = () => {
        setMenuOpen(null);
    };

    const handleInsiderOpen = (event) => {
        setInsiderOpen(event.currentTarget);
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
    }

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
                        <Avatar className='uppercase' src={image_URL_v2(data?.user?.picture)} sx={{ width: 32, height: 32 }}>{data?.user?.username?.slice(0, 1)}</Avatar>
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
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="rb_SideBar_ScrollBar overflow-y-auto"
            >
                <Box className="h-[80px] max-h-[80px] w-full flex flex-col justify-center overflow-hidden">
                    <MenuItem>
                        <Avatar src={image_URL_v2(data?.user?.picture, { rounded: true, width: 40 })}>{data?.user?.username?.slice(0, 1)}</Avatar>
                        <Typography sx={{ ml: 2 }} variant="inherit">{data?.user?.username}</Typography>
                    </MenuItem>
                </Box>
                {/* <Divider /> */}
                <Box elevation={0} className="bg-lightHead dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, mx: 1, boxShadow: null }}>
                    <ListItemRdX link={{
                        name: 'Your Profile',
                        url: `/@${data?.user?.username}`,
                        icon: Person4Outlined,
                    }} />
                    <ListItemRdX link={{
                        name: `${process.env.NEXT_PUBLIC_STUDIO_NAME}`,
                        url: `/studio/${data?.user?.username}/dashboard`,
                        icon: DashboardCustomizeOutlined,
                    }} />
                    <MenuItem onClick={() => signOut()}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Sign Out
                    </MenuItem>

                    <Divider />

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

                    <Divider />

                    <ListItemRdX link={{
                        name: 'Settings',
                        url: '/settings',
                        icon: SettingsOutlined,
                    }} />

                    <Divider />

                    <ListItemRdX link={{
                        name: 'Help',
                        url: '/help',
                        icon: HelpOutlineOutlined,
                    }} />
                    <ListItemRdX link={{
                        name: 'Send Feedback',
                        url: '/feedback',
                        icon: FeedbackOutlined,
                    }} />
                </Box>
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
                            width: '260px',
                            mt: 1.5,
                            pt: '0 !important',
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box className="dark:bg-accentDark bg-accent" sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1, mt: -3, pt: 3 }}>
                    <IconButton sx={{ mr: 2 }} onClick={handleBack} size="small">
                        <NavigateBefore htmlColor='#fff' fontSize="small" />
                    </IconButton>
                    <h3 className='font-semibold text-white' variant="inherit">{insiderData?.title}</h3>
                </Box>
                {/* <Divider /> */}
                <p className='text-sm px-4 py-2 text-slate-600 dark:text-slate-300' >{insiderData?.message}</p>
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

export const NavMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [insiderOpen, setInsiderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [insiderData, setInsiderData] = useState(null);

    const handleClick = (event) => {
        setMenuOpen(event.currentTarget);
    };

    const handleClose = () => {
        setMenuOpen(null);
    };

    const handleInsiderOpen = (event) => {
        setInsiderOpen(event.currentTarget);
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
    }

    return (
        <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Menu">
                    <IconButton
                        onClick={(e) => { handleClick(e); setAnchorEl(e.currentTarget) }}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={menuOpen ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    >
                        <MoreVert fontSize='small' />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="main-menu"
                open={menuOpen}
                onClose={handleClose}
                sx={{
                    minWidth: '260px',
                    height: 'calc(100%-80px)',
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="rb_SideBar_ScrollBar overflow-y-auto"
            >
                <Box elevation={0} className="bg-white dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, mx: 1, boxShadow: null }}>


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

                    <Divider />

                    <ListItemRdX link={{
                        name: 'Settings',
                        url: '/settings',
                        icon: SettingsOutlined,
                    }} />

                    <Divider />

                    <ListItemRdX link={{
                        name: 'Help',
                        url: '/help',
                        icon: HelpOutlineOutlined,
                    }} />
                    <ListItemRdX link={{
                        name: 'Send Feedback',
                        url: '/feedback',
                        icon: FeedbackOutlined,
                    }} />
                </Box>
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
                            width: '260px',
                            mt: 1.5,
                            pt: '0 !important',
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box className="dark:bg-darkHead bg-gray-200" sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1, mt: -3, pt: 3 }}>
                    <IconButton sx={{ mr: 2 }} onClick={handleBack} size="small">
                        <NavigateBefore fontSize="small" />
                    </IconButton>
                    <Typography variant="inherit">{insiderData?.title}</Typography>
                </Box>
                <p className='text-sm px-4 py-2 text-slate-600 dark:text-slate-300' >{insiderData?.message}</p>
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


const ListItemRdX = ({ link }) => {
    return (
        <MenuItem key={link.name} >
            <Link className='w-full' href={link.url}>
                <Tooltip title={link.helpText || link.name} placement="left" slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 20],
                                },
                            },
                        ],
                    },
                }} >
                    <Box component="a" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <ListItemIcon>
                            <link.icon fontSize='small' />
                        </ListItemIcon>
                        <Typography variant="inherit">{link.name}</Typography>
                    </Box>
                </Tooltip>
            </Link>
        </MenuItem>
    )
}

const ListInsideModel = ({ link = {}, data = {}, state = {} }) => {

    return (
        <>
            <MenuItem onClick={(event) => { state.handleInsiderOpen(event); state.setInsiderData(data); }} aria-controls={state.insiderOpen ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={state.insiderOpen ? 'true' : undefined} >
                <Tooltip title={link.helpText || link.name} placement="left" slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 20],
                                },
                            },
                        ],
                    },
                }} >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <ListItemIcon>
                            <link.icon fontSize='small' />
                        </ListItemIcon>
                        <Typography variant="inherit">{link?.name}{link?.selected && <>:<span className='ml-0.5 mr-1 text-xs'>{link?.selected}</span></>} </Typography>
                        <KeyboardArrowRightOutlined fontSize='small' sx={{ ml: 'auto', mr: 0.3 }} />
                    </Box>
                </Tooltip>
            </MenuItem>
        </>
    )
}

const ThemeSelect = ({ state }) => {
    const [theme, setTheme] = useState('system');
    let themeIcon = SettingsBrightness;
    switch (theme) {
        case 'light':
            themeIcon = WbSunnyOutlined;
            break;
        case 'dark':
            themeIcon = NightsStayOutlined;
            break;
        default:
            themeIcon = SettingsBrightness;
            break;
    }

    useEffect(() => {
        if (localStorage.getItem('theme') || localStorage.getItem('mui-mode')) {
            let getTheme = localStorage.getItem('theme');
            setTheme(getTheme);
            if (!getTheme || getTheme == null) {
                setTheme(localStorage.getItem('mui-mode'));
            };
        }
    }, []);

    return (
        <ListInsideModel link={{
            name: `Appearance`,
            selected: `${theme.slice(0, 1).toUpperCase() + theme.slice(1)} ${ /*theme === 'system' ? 'Theme' : ''*/ 'Theme'}`,
            icon: themeIcon,
        }} data={{
            title: 'Appearance', selected: theme, message: 'The settings only apply to the current browser.', component: <ThemeSwitch setThemeName={setTheme} />
        }} state={state} />
    )
}

export { ListItemRdX, ListInsideModel, ThemeSelect };