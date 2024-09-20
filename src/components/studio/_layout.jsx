'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { StudioSidebar } from './_sidebar';
import { DrawerContext } from '../mainlayout';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Backdrop, Drawer, LinearProgress, useMediaQuery } from '@mui/material';
import { MainLogo } from '@/lib/client';
import { StudioContext } from '@/lib/context';
import { CgMenuLeft } from 'react-icons/cg';

const drawerWidth = 240;
const drawerWidthClose = 80;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open', shouldForwardProp: (prop) => prop !== 'variant' })(
    ({
        theme, open, variant
    }) => ({
        flexGrow: 1,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        marginLeft: 0,
        marginTop: '54px',
        width: `calc(100% - ${drawerWidth_get(open, variant)}px)`,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        variants: [{
            props: (
                {
                    variant,
                    open
                }
            ) => (open && variant == 'permanent'),
            style: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            }
        }, {
            props: (
                {
                    variant,
                    open
                }
            ) => (open && variant == 'persistent'),
            style: {
                transition: null,
                marginLeft: `-${drawerWidth}px`,
            }
        }]
    }),
);

const drawerWidth_get = (open, variant) => {
    if (variant === 'persistent') {
        return open ? drawerWidth : 0;
    } else {
        return open ? drawerWidth : drawerWidthClose;
    }
}

const StudioLayout = ({ children, session }) => {
    const q = useMediaQuery('(max-width:768px)');
    const q2 = useMediaQuery('(max-width:1024px)');
    let v = q ? 'persistent' : 'permanent';
    let o = q ? false : true;
    const [open, setOpen] = React.useState(o);
    const [variant, setVariant] = React.useState(v);

    const { data, loading } = React.useContext(StudioContext);

    const handleDrawerOpen = () => {
        setOpen(!open);
    }

    React.useMemo(() => {
        setOpen(o)
        setVariant(v)
    }, [q]);

    React.useMemo(() => {
        if (variant === 'permanent') {
            if (q2) {
                setOpen(false);
            } else {
                !open && setOpen(true);
            }
        }
    }, [q2]);

    return (
        (<DrawerContext.Provider value={{ open, setOpen, variant }}>
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    sx={[theme => ({
                        width: drawerWidth_get(open, variant),
                        flexShrink: 0,
                        transition: (theme) => (variant === 'permanent') && theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        '& .MuiDrawer-paper': {
                            width: drawerWidth_get(open, variant),
                            border: 'none',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            })
                        }
                    }), variant === 'persistent' ? {
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
                    }, variant === 'persistent' ? {
                        '& .MuiDrawer-paper': {
                            pt: 0
                        }
                    } : {
                        '& .MuiDrawer-paper': {
                            pt: '54px'
                        }
                    }, variant === 'persistent' ? {
                        zIndex: (theme) => theme.zIndex.drawer + 1
                    } : {
                        zIndex: 1
                    }]}
                    variant={variant}
                    anchor="left"
                    open={open}
                    className={variant === 'permanent' ? '!hidden md:!block' : ''}
                >
                    {variant === 'persistent' && <><div className='flex items-center ml-8 min-h-[54px] justify-start'>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                        > <CgMenuLeft className='w-5 h-5 ' /> </IconButton>
                        <MainLogo className={'ml-4'} />
                    </div></>}
                    <StudioSidebar session={session} variant={variant} open={open} />
                </Drawer>
                <Main aria-busy={loading} open={open} variant={variant}>
                    <Backdrop sx={theme => ({
                        zIndex: theme.zIndex.drawer
                    })}
                        open={open && variant === 'persistent'}
                        onClick={handleDrawerOpen}
                    > </Backdrop>
                    <Backdrop open={loading} invisible sx={{ zIndex: 1, opacity: 0.1, left: drawerWidth_get(open, variant) }} />
                    {loading ? <LinearProgress className="!h-0.5 !fixed !top-[54px] !-ml-6 !z-[99] w-full" color="accent" /> : null}
                    {children}
                </Main>
            </Box>
        </DrawerContext.Provider>)
    );
}

export default StudioLayout;
