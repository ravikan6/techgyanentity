"use client";

import { useState } from "react";
import { Button, Tooltip } from "../rui";
import { PiHandsClappingLight } from "react-icons/pi";
import { FaHandsClapping } from "react-icons/fa6";
import { BookmarkButton, CommonShareView, MoreMenuButton, ShareButton } from "../common";
import { AiOutlineComment } from "react-icons/ai";
import { updateStoryClap, updateStorySaved } from "@/lib/actions/setters/story";
import { toast } from "react-toastify";
import { Menu } from "../styled";
import { MenuListItem } from "../common/client";
import { Report } from "@mui/icons-material";


const ClapView = ({ value, options }) => {
    const [loading, setLoading] = useState(false);
    const [claps, setClpas] = useState({ count: value?.count, me: value?.meClaped })

    async function onAction() {
        if (value?.storyKey) {
            try {
                setLoading(true)
                let res = await updateStoryClap(value?.storyKey);
                if (res.success) {
                    setClpas({
                        count: res.data?.clapsCount,
                        me: res.data?.clappedByMe
                    })
                };
                if (res.errors) {
                    res.errors.forEach((e) => {
                        toast.error(e.message);
                    });
                }
            } catch (e) {
                toast.error('Something went wrong!')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            <Tooltip title={claps?.me ? 'Unclap' : 'Clap'} placement='top'>
                <Button
                    disabled={loading}
                    sx={[{ px: 2, height: '32px' }, claps.count == 0 && { width: '32px', minWidth: '32px' }]}
                    onClick={onAction}
                    size='small'
                    variant='outlined'
                    color='primary'
                    startIcon={claps?.me ? <FaHandsClapping className="w-4 h-4" /> : <PiHandsClappingLight className={`w-4 h-4 ${claps.count == 0 ? 'ml-2.5' : null} `} />}
                    endIcon={claps.count == 0 ? null : <span className='!text-xs'>{(claps.count === null || claps.count === undefined) ? '--' : claps.count}</span>}
                />
            </Tooltip>
        </>
    )

};

const ClapReadonlyView = ({ claps = { count: 0, me: false } }) => {

    return (
        <div className="flex items-center gap-1.5">
            {claps?.me ? <FaHandsClapping className="w-3.5 h-3.5" /> : <PiHandsClappingLight className={`w-4 h-4`} />}
            {claps.count == 0 ? null : <span className='!text-xs'>{(claps.count === null || claps.count === undefined) ? '--' : claps.count}</span>}
        </div>
    )
}

const CommentReadonlyView = ({ count }) => {

    return (
        <div className="flex items-center gap-1.5">
            {<AiOutlineComment className={`w-3.5 h-3.5`} />}
            {count == 0 ? null : <span className='!text-xs'>{(count === null || count === undefined) ? '--' : count}</span>}
        </div>
    )
}

const CommentButtonView = ({ count, options }) => {

    return (
        <>
            <Button
                sx={[{ px: 2, height: '32px' }, count == 0 && { width: '32px', minWidth: '32px' }]}
                onClick={options?.onClick}
                size='small'
                variant='outlined'
                color='primary'
                startIcon={<AiOutlineComment className={`w-4 h-4 ${count == 0 ? 'ml-2.5' : null} `} />}
                endIcon={count == 0 ? null : <span className='!text-xs'>{(count === null || count === undefined) ? '--' : count}</span>}
            />
        </>
    )
}

const BookmarkView = ({ value, options }) => {
    const [is, setIs] = useState(value?.is);
    const [loading, setLoading] = useState(false);

    async function onAction() {
        if (value?.storyKey) {
            try {
                setLoading(true)
                let res = await updateStorySaved(value?.storyKey);
                if (res.success) {
                    setIs(res.data?.savedByMe)
                };
                if (res.errors) {
                    res.errors.forEach((e) => {
                        toast.error(e.message);
                    });
                }
            } catch (e) {
                toast.error('Something went wrong!')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            <BookmarkButton is={is} options={{
                button: {
                    disabled: loading,
                    onClick: onAction,
                    ...options?.button
                }
            }} />
        </>
    );
}

const ShareView = ({ href = { path: null, query: null }, options }) => {
    let url = href?.path ? `${href?.path}${href?.query ? `?${href?.query}` : ''}` : null;
    return (
        <>
            <CommonShareView options={{
                meta: {
                    url: url,
                }
            }} />
        </>
    );
}

const MoreMenuView = ({ }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    }

    return (
        <>
            <MoreMenuButton options={{
                button: {
                    onClick: handleOpen
                },
            }} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ mt: 1 }}
            >
                <MenuListItem item={{ name: 'Report', icon: Report }} options={{
                    onClick: () => {
                        toast.info('Reported');
                        handleClose();
                    }
                }} />
            </Menu>
        </>
    );
}

const _MetaMoreMenuView = ({ }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    }

    return (
        <>
            <MoreMenuButton options={{
                button: {
                    onClick: handleOpen,
                    variant: 'text',
                    sx: {
                        minWidth: '18px',
                        minHeight: '18px',
                        p: 0,
                    },
                    Props: {
                        color: 'inherit'
                    }
                },
                icon: {
                    className: 'w-3.5 h-3.5'
                }
            }} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ mt: 1 }}
            >
                <MenuListItem item={{ name: 'Report', icon: Report }} options={{
                    onClick: () => {
                        toast.info('Reported');
                        handleClose();
                    }
                }} />
            </Menu>
        </>
    );
}


export { ClapView, BookmarkView, ShareView, MoreMenuView, CommentButtonView, CommentReadonlyView, ClapReadonlyView, _MetaMoreMenuView };