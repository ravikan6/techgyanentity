'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { StudioSidebar } from './_sidebar';
import { DrawerContext } from '../mainlayout';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { Backdrop, Drawer, LinearProgress, useMediaQuery } from '@mui/material';
import { MainLogo } from '@/lib/client';
import { StudioContext } from '@/lib/context';

const drawerWidth = 240;
const drawerWidthClose = 80;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open', shouldForwardProp: (prop) => prop !== 'variant' })(
    ({ theme, open, variant }) => ({
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
        ...((open && variant == 'permanent') && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...((open && variant == 'persistent') && {
            transition: null,
            marginLeft: `-${drawerWidth}px`,
        }),
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
        <DrawerContext.Provider value={{ open, setOpen, variant }}>
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    sx={{
                        width: drawerWidth_get(open, variant),
                        flexShrink: 0,

                        transition: (theme) => (variant === 'permanent') && theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),

                        '& .MuiDrawer-paper': {
                            width: drawerWidth_get(open, variant),
                            backgroundColor: (theme) => variant === 'persistent' ? theme.palette?.modelBG?.main : 'transparent',
                            mt: variant === 'persistent' ? 0 : 0,
                            pt: variant === 'persistent' ? 0 : '54px',
                            border: 'none',
                            transition: (theme) => theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                        zIndex: variant === 'persistent' ? (theme) => theme.zIndex.drawer + 1 : 1,
                    }}
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
                        > <MenuIcon /> </IconButton>
                        <MainLogo className={'ml-4'} />
                    </div></>}
                    <StudioSidebar session={session} variant={variant} open={open} />
                </Drawer>
                <Main aria-busy={loading} open={open} variant={variant}>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer }}
                        open={open && variant === 'persistent'}
                        onClick={handleDrawerOpen}
                    > </Backdrop>
                    <Backdrop open={loading} invisible sx={{ zIndex: 1, opacity: 0.1, left: drawerWidth_get(open, variant) }} />
                    <LinearProgress className="!h-0.5 !fixed !top-[54px] !-ml-6 !z-[99] w-full" hidden={!loading} color="accent" />
                    {children}
                </Main>
            </Box>
        </DrawerContext.Provider>
    );
}

export default StudioLayout;
