'use client';
import { MainSidebar } from './Home/sidebar';
import { Drawer, useMediaQuery } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { MainLogo } from '@/lib/client_components';
import { CgMenuLeft } from 'react-icons/cg';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;
const drawerWidthClose = 80;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open', shouldForwardProp: (prop) => prop !== 'variant' })(
    ({
        theme, open, variant
    }) => ({
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '12px',
            paddingRight: '12px',
        },
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
        },
        marginLeft: 0,
        paddingTop: '54px',
        width: `calc(100% - ${0}px)`,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        variants: [{
            props: {
                variant: 'permanent'
            },
            style: {
                width: {
                    width: drawerWidth_get(open, variant)
                }
            }
        }, {
            props: (
                {
                    variant,
                    open
                }
            ) => (open && variant == 'permanent'),
            style: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }
        }]
    }),
);


export const DrawerContext = React.createContext();

const drawerWidth_get = (open, variant) => {
    if (variant === 'permanent') {
        return open ? drawerWidth : drawerWidthClose;
    } else return open ? drawerWidth : 0;
}

const MainLayout = ({ children, session }) => {
    let q = useMediaQuery('(max-width:768px)');
    let v = !q && 'permanent';
    let o = !q && true;
    const [open, setOpen] = React.useState(o);
    const [variant, setVariant] = React.useState(v);

    const path = usePathname();

    const handleDrawerOpen = () => {
        setOpen((open) => !open);
        try {
            if (variant === 'permanent') sessionStorage.setItem('drawer', `${!open}`);
        } catch { }
    };

    const handleTempDrawer = () => {
        if (variant !== 'permanent') {
            setOpen(false);
        }
    };

    React.useEffect(() => {
        const drawerElement = document.getElementById('_drawer#');
        if (drawerElement) {
            setOpen(false);
            setVariant('temporary');
            const styleTag = document.getElementById('r_tt');
            if (styleTag && variant !== 'permanent') {
                styleTag.remove();
            }
        } else {
            if (variant === 'permanent') {
                let value = sessionStorage.getItem('drawer');
                if (value === 'false') {
                    setOpen(false);
                } else {
                    setOpen(true);
                }
            } else setOpen(o)
            setVariant(v)
        }
    }, [o, v, path, variant]);

    return (
        (<DrawerContext.Provider value={{ open, setOpen, setVariant, variant }}>
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    sx={[theme => ({
                        width: drawerWidth_get(open, variant),
                        flexShrink: 0,
                        transition: (theme) => (variant === 'permanent') && theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.short,
                        }),
                        '& .MuiDrawer-paper': {
                            width: drawerWidth_get(open, variant),
                            border: 'none',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.short,
                            })
                        }
                    }), variant !== 'permanent' ? {
                        '& .MuiDrawer-paper': {
                            backgroundColor: (theme) => theme.palette?.background?.default,
                        }
                    } : {
                        '& .MuiDrawer-paper': {
                            backgroundColor: 'transparent'
                        }
                    }, variant === 'persistent' ? {
                        '& .MuiDrawer-paper': {
                            mt: 0
                        }
                    } : {
                        '& .MuiDrawer-paper': {
                            mt: 0
                        }
                    }, variant !== 'permanent' ? {
                        '& .MuiDrawer-paper': {
                            pt: 0
                        }
                    } : {
                        '& .MuiDrawer-paper': {
                            pt: '54px'
                        }
                    }, variant !== 'permanent' ? {
                        zIndex: (theme) => theme.zIndex.drawer + 1
                    } : {
                        zIndex: 1
                    }]}
                    variant={variant}
                    anchor="left"
                    open={open}
                    onClose={handleDrawerOpen}
                    className={(variant === 'permanent' ? '!hidden md:!block' : '') + ' rb_SideBar_ScrollBar rb_tt'}
                >
                    {variant !== 'permanent' && <><div className='flex items-center ml-8 min-h-[54px] justify-start'>
                        <IconButton
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                        > <CgMenuLeft className='w-5 h-5' /> </IconButton>
                        <MainLogo className={'sm:ml-4 ml-3'} />
                    </div></>}
                    <MainSidebar session={session} variant={variant} open={open} onMenuClick={handleTempDrawer} />
                </Drawer>
                <Main open={open} variant={variant}>
                    {children}
                </Main>
            </Box>
        </DrawerContext.Provider>)
    );
}

export default MainLayout;
