"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CrossButton, ShareButton } from ".";
import { useMediaQuery } from "@mui/material";
import { Button, Dialog, IconButton, SwipeableDrawer, Tooltip } from "../rui";
import { copyText } from "@/lib/helpers";
import { ChevronLeft, ChevronRight, FacebookOutlined, LinkOutlined, Reddit, StackedBarChartOutlined, Telegram, WhatsApp, X } from "@mui/icons-material";
import { MenuListItem } from "./client";
import { TextField } from "@/components/styled";

const ShareContext = createContext({
    open: false,
    setOpen: () => { },
    onClose: () => { },
    meta: {},
    sm: false,
});

const ShareView = ({ options }) => {
    const [open, setOpen] = useState(false)
    const isSM = useMediaQuery('(max-width:600px)');

    function onClose() {
        setOpen(false)
    }

    return (
        <>
            <ShareContext.Provider value={{
                open: open,
                setOpen: setOpen,
                onClose: onClose,
                meta: options?.meta || {},
                sm: isSM,
            }} >
                <ShareButton options={{
                    button: {
                        onClick: () => setOpen(true),
                    }
                }} />
                {isSM ? <_ShareSwiperView /> : <_ShareModalView />}
            </ShareContext.Provider>
        </>
    )
}

const _ShareModalView = () => {
    const { open, onClose, meta } = useContext(ShareContext);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ maxWidth: '480px', width: '100%', mx: 'auto' }}
        >
            <div className="my-5 px-4 relative">
                <div className="absolute -top-2 right-2">
                    <CrossButton options={{
                        button: {
                            onClick: onClose,
                        }
                    }} />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg karnak">
                        Share
                    </h2>
                    <_ShareInnerButtonsView />
                    <_ShareCopyLinkView />
                </div>
            </div>
        </Dialog>
    )
}

const _ShareCopyLinkView = () => {
    const { meta } = useContext(ShareContext);

    return (
        <TextField
            fullWidth
            variant="outlined"
            value={`${window.location.origin}${meta?.url}`}
            size="small"
            slotProps={{
                input: {
                    endAdornment: <Button
                        variant="contained"
                        className="h-full font-semibold -mr-2"
                        color="inherit"
                        size="small"
                        onClick={() => copyText(`${window.location.origin}${meta?.url}`)}>
                        Copy
                    </Button>
                }
            }}
        />
    )
}

const _ShareInnerButtonsView = () => {
    let [container, setContainer] = useState();
    const [scroll, setScroll] = useState(0);

    const { meta } = useContext(ShareContext);

    const _options = [
        {
            name: 'Facebook',
            icon: FacebookOutlined,
            color: 'blue',
            onClick: () => window.open('https://www.facebook.com/sharer/sharer.php?u=https://www.google.com', '_blank')
        },
        {
            name: 'TwitteEntityr',
            icon: X,
            color: 'black',
            onClick: () => window.open('https://twitter.com/intent/tweet?text=Hello%20world&url=https://www.google.com', '_blank')

        },
        {
            name: 'Whatsapp',
            icon: WhatsApp,
            color: 'green',
            onClick: () => window.open('https://api.whatsapp.com/send?text=Hello%20world%20https://www.google.com', '_blank')
        },
        {
            name: 'Telegram',
            icon: Telegram,
            color: 'blue',
            onClick: () => window.open('https://t.me/share/url?url=https://www.google.com', '_blank')
        },
        {
            name: 'Copy Link',
            icon: LinkOutlined,
            color: 'black',
            onClick: () => copyText(`${window.location.origin}${meta?.url}`)
        },
        {
            name: 'Reddit',
            icon: Reddit,
            color: 'red',
            onClick: () => { }
        },
        {
            name: 'Stack Overflow',
            icon: StackedBarChartOutlined,
            color: 'blue',
            onClick: () => { }
        }
    ];


    const handlePrevClick = () => {
        if (container)
            container.scrollLeft -= container.offsetWidth;
    };

    const handleNextClick = () => {
        if (container)
            container.scrollLeft += container.offsetWidth;
    };

    useEffect(() => {
        const handleScroll = () => {
            setScroll(container.scrollLeft);
        };
        if (container) container.addEventListener('scroll', handleScroll);

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
        };
    }, [container]);

    useEffect(() => {
        let cont = document.getElementById('#_share_options');
        if (cont) setContainer(cont);
    }, []);

    return (
        <>
            <div className='relative mx-2'>
                <div id="#_share_options" className='block scroll-smooth overflow-auto min-[425px]:overflow-hidden whitespace-nowrap'>
                    {_options.map((item, index) => (
                        <span key={index} className={`inline-block ${_options.length === (index + 1) ? '' : 'mr-5'}`}>
                            <Tooltip title={item.name}>
                                <IconButton className="!w-14 !h-14 p-3 flex items-center justify-center !bg-lightButton dark:!bg-darkButton" onClick={item?.onClick}>
                                    <item.icon className="w-10 h-10 dark:text-dark text-zinc-800" />
                                </IconButton>
                            </Tooltip>
                        </span>
                    ))}
                </div>
                {scroll > 0 &&
                    <div className='w-8 h-8 invisible min-[425px]:visible flex justify-center items-center rounded-full shadow-md absolute -left-4 top-3'>
                        <IconButton className={`text-black dark:text-white cursor-pointer hover:bg-accentLight dark:hover:bg-accentDark !bg-lightHead dark:!bg-darkHead  transition-colors rounded-full h-8 w-8`} onClick={handlePrevClick}>
                            <ChevronLeft />
                        </IconButton>
                    </div>
                }
                {scroll < container?.scrollWidth - container?.offsetWidth &&
                    <div className='w-8 h-8 invisible min-[425px]:visible flex justify-center items-center rounded-full shadow-md absolute -right-4 top-3'>
                        <IconButton className={`text-black dark:text-white cursor-pointer hover:bg-accentLight dark:hover:bg-accentDark !bg-lightHead dark:!bg-darkHead transition-colors rounded-full h-8 w-8`} onClick={handleNextClick}>
                            <ChevronRight />
                        </IconButton>
                    </div>
                }
            </div>
        </>
    );
};

const _ShareSwiperView = () => {
    const { meta, open, onClose, setOpen } = useContext(ShareContext);
    return (
        <SwipeableDrawer
            minFlingVelocity={300}
            disableSwipeToOpen={false}
            swipeAreaWidth={20}
            container={document?.body}
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={() => setOpen(true)}
            sx={{ zIndex: 1500, '& .MuiDrawer-paper': { borderRadius: '20px', marginRight: '8px', marginLeft: '8px', marginBottom: '8px' } }}
            keepMounted={false}
        >
            <h2 className="text-lg karnak mb-3">
                Share
            </h2>
            <_ShareInnerButtonsView />
            <hr className="my-2"></hr>
            <MenuListItem item={{
                name: 'Copy Link',
                icon: LinkOutlined
            }} options={{
                onClick: () => copyText(`${window.location.origin}${meta?.url}`)
            }} />
        </SwipeableDrawer>
    )
}

export { ShareView }; 