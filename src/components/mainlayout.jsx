'use client';
import { MainSidebar } from './Home/sidebar';
import { Backdrop, Drawer, useMediaQuery } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MainLogo } from '@/lib/client';
import { CgMenuLeft } from 'react-icons/cg';


const drawerWidth = 240;
const drawerWidthClose = 80;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open', shouldForwardProp: (prop) => prop !== 'variant' })(
    ({ theme, open, variant }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: 0,
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


export const DrawerContext = React.createContext();

const drawerWidth_get = (open, variant) => {
    if (variant === 'persistent') {
        return open ? drawerWidth : 0;
    } else {
        return open ? drawerWidth : drawerWidthClose;
    }
}

const MainLayout = ({ children, session }) => {
    let q = useMediaQuery('(max-width:768px)');
    let v = q ? 'persistent' : 'permanent';
    let o = q ? false : true;
    const [open, setOpen] = React.useState(o);
    const [variant, setVariant] = React.useState(v);

    const handleDrawerOpen = () => {
        setOpen(!open);
    }

    React.useMemo(() => {
        setOpen(o)
        setVariant(v)
    }, [q]);

    return (
        <DrawerContext.Provider value={{ open, setOpen }}>
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
                            backgroundColor: (theme) => variant === 'persistent' ? theme.palette.modelBG.main : 'transparent',
                            mt: variant === 'persistent' ? 0 : 0, // '54px'
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
                    className={variant === 'permanent' ? '!hidden min-[600px]:!block' : ''}
                >
                    {variant === 'persistent' && <><div className='flex items-center ml-8 min-h-[54px] justify-start'>
                        <IconButton
                            // color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                        > <CgMenuLeft /> </IconButton>
                        <MainLogo className={'ml-4'} />
                    </div></>}
                    <MainSidebar session={session} variant={variant} open={open} />
                </Drawer>
                <Main open={open} variant={variant}>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer }}
                        open={open && variant === 'persistent'}
                        onClick={handleDrawerOpen}
                    > </Backdrop>
                    {children}
                </Main>
            </Box>
        </DrawerContext.Provider>
    );
}

export default MainLayout;
