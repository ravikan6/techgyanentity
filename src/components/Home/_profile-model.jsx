'use client';
import Link from 'next/link';
import { ThemeSwitch } from '../theme';
import { signOut, useSession } from 'next-auth/react';
import { Fragment, useEffect, useState } from 'react'
import { Box, Avatar, ListItemIcon, Typography, List, Divider } from '@mui/material';
import { NavigateBefore, Check, HelpOutlineOutlined, DashboardCustomizeOutlined, SettingsOutlined, Person4Outlined, AdminPanelSettingsOutlined, NightsStayOutlined, WbSunnyOutlined, SettingsBrightness, Logout, FeedbackOutlined, KeyboardArrowRightOutlined, TranslateOutlined, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip, Button } from '@/components/rui';
import { TbUserPlus } from 'react-icons/tb';

export const UserProfileModel = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [insiderOpen, setInsiderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [insiderData, setInsiderData] = useState(null);
    const [data, setData] = useState(user);

    const session = useSession();

    useEffect(() => {
        if (session.data?.user) {
            setData(session.data);
        }
    }, [session.data]);

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
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={(e) => { handleClick(e); setAnchorEl(e.currentTarget) }}
                        size="small"
                        aria-controls={menuOpen ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    >
                        <Avatar className='uppercase' src={data?.user?.image} sx={{ width: 32, height: 32 }}>{data?.user?.username?.slice(0, 1)}</Avatar>
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
                className="rb_sss rb_ss overflow-y-auto"
            >
                <Box className="h-[60px] max-h-[60px] w-full overflow-hidden">
                    <MenuItem>
                        <Avatar src={data?.user?.image}>{data?.user?.username?.slice(0, 1)}</Avatar>
                        <div className='ml-5 flex flex-col justify-center items-start'>
                            <h3 className='font-bold'>{data?.user?.name}</h3>
                            <p className='stymie -mt-1'>{data?.user?.username}</p>
                        </div>
                    </MenuItem>
                </Box>

                {/* {(data?.user?.Author?.length === 0) && <Box className="bg-lightHead dark:bg-darkHead overflow-hidden" sx={{ borderRadius: '14px', py: 2, px: 1, mx: '4px', boxShadow: null, mb: 2, mt: 1 }}>
                    <div className='flex flex-col max-w-[230px] mx-auto items-center'>
                        <p className='text-sm mb-2 text-slate-600 text-center dark:text-slate-300'>Become an author and start publishing your articles.</p>
                        <Link href='/setup/author'>
                            <Button variant='outlined' size='small' sx={{ minWidth: '80px' }} startIcon={<TbUserPlus />}>Become Author</Button>
                        </Link>
                    </div>
                </Box>} */}

                <Box elevation={0} className="bg-lightHead group/menu_box dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, mx: '4px', boxShadow: null }}>
                    <ListItemRdX link={{
                        name: 'Manage Account',
                        url: `/account/@${data?.user?.username}`,
                        icon: Person4Outlined,
                    }} />

                    {(data?.user?.Author?.length > 0) && <ListItemRdX link={{
                        name: `${process.env.NEXT_PUBLIC_STUDIO_NAME}`,
                        url: `/${process.env.STUDIO_URL_PREFIX}/dashboard`,
                        icon: DashboardCustomizeOutlined,
                    }} />}

                    <MenuItem onClick={() => signOut()}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Sign Out
                    </MenuItem>

                    <Divider />

                    <div className='flex flex-col max-w-[230px] pb-3 mx-auto items-center'>
                        <p className='text-sm mb-2 text-slate-600 text-center dark:text-slate-300'>Become an author and start publishing your articles.</p>
                        <Link href='/setup/author'>
                            <Button variant='outlined' size='small' sx={{ minWidth: '80px' }} startIcon={<TbUserPlus />}>Become Author</Button>
                        </Link>
                    </div>

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
                <SecondaryMenu insiderData={insiderData} insiderRun={insiderRun} handleBack={handleBack} />

            </Menu>

        </Fragment>
    );
}

export const SecondaryMenu = ({ insiderData, insiderRun, handleBack, modern = true }) => {

    return (
        <>
            <Box className={`${modern ? 'dark:bg-accentDark bg-accent' : "bg-lightHead dark:bg-darkHead"} absolute w-full`} sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1, mt: -3, pt: 3 }}>
                <IconButton sx={{ mr: 2 }} onClick={handleBack} size="small">
                    <NavigateBefore className={` dark:text-white ${modern ? 'text-white' : 'text-black'}`} fontSize="small" />
                </IconButton>
                {modern ? <h3 className='font-semibold text-white' variant="inherit">{insiderData?.title}</h3>
                    : <Typography variant="inherit">{insiderData?.title}</Typography>
                }
            </Box>
            <div className='w-full rb_sss mt-10'>
                <p className='text-sm py-2 px-4 text-wrap mx-auto text-slate-600 dark:text-slate-300' >{insiderData?.message}</p>
                {(insiderData?.isJsx) ? insiderData?.component
                    : insiderData?.options.map((option, index) => (
                        <MenuItem onClick={() => insiderRun(option.value)} key={index} >
                            <ListItemIcon>
                                {option.value === insiderData?.selected ? <Check fontSize="small" /> : null}
                            </ListItemIcon>
                            {option.name}
                        </MenuItem>
                    ))
                }
            </div>
        </>
    )
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
                className="rb_sss rb_ss overflow-y-auto"
            >
                <Box elevation={0} className="bg-lightHead dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, mx: '4px', boxShadow: null }}>


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
                className="rb_sss"
            >
                <SecondaryMenu insiderData={insiderData} insiderRun={insiderRun} handleBack={handleBack} />
            </Menu>

        </Fragment>
    );
}


const ListItemRdX = ({ link, onClick = () => { } }) => {
    return (
        <MenuItem key={link.name} onClick={onClick} >
            <Tooltip title={link?.helpText || link.name} placement="left" slotProps={{
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
                {link?.url ? <Link className='w-full' href={link?.url || '#'}>
                    <Box component="a" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <ListItemIcon>
                            <link.icon fontSize='small' />
                        </ListItemIcon>
                        <Typography variant="inherit">{link?.name}</Typography>
                    </Box>
                </Link> :
                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <ListItemIcon>
                            <link.icon fontSize='small' />
                        </ListItemIcon>
                        <Typography variant="inherit">{link?.name}</Typography>
                    </Box>}
            </Tooltip>
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