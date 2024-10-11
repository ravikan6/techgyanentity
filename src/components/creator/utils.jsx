"use client";
import { useSession } from "next-auth/react";
import { Button, Menu, Tooltip } from "../rui";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { HeartBrokenOutlined } from "@mui/icons-material";
import { ListItemRdX } from "../Home/_profile-model";
import { BiChevronDown } from "react-icons/bi";
import { AuthorAvatar } from "./_client";
import { Skeleton } from "@mui/material";
import { followCreator, unfollowCreator } from "@/lib/actions/setters/creator";

const CreatorFollowButton = ({ value, options }) => {
    const [followed, setFollowed] = useState({ byMe: value?.byMe, notifPref: value?.notifPref });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const { data: session } = useSession();

    const handleFollowSystem = async () => {
        setLoading(true);
        handleMenuClose();
        try {
            if (session && session.user) {
                if (followed?.byMe) {
                    let res = await unfollowCreator({ key: options?.creator });
                    if (res.success) {
                        setFollowed({ byMe: false, notifPref: null });
                    } else {
                        setError(res.errors);
                    }
                } else {
                    // Follow Creator
                    let res = await followCreator({ key: options?.creator, notifPref: 'ALL' });
                    if (res.success) {
                        setFollowed({ byMe: true, notifPref: res.data?.followed?.notifPref });
                    } else {
                        setError(res.errors);
                    }
                }
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        session?.user ?
            <>
                <Button disabled={loading || error} onClick={followed?.byMe ? handleMenuOpen : handleFollowSystem} variant="contained" sx={followed?.byMe && { backgroundColor: (theme) => theme.palette.divider }} color={followed?.byMe ? "divider" : "primary"} size="small" endIcon={followed?.byMe && <BiChevronDown />} {...options?.button?.Props} >
                    {followed?.byMe ? 'Following' : 'Follow'}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'Author Follow Menu',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: '12px !important',
                            }
                        }
                    }}>
                    <ListItemRdX link={{ name: 'Notify all', icon: HeartBrokenOutlined }} />
                    <ListItemRdX link={{ name: 'Don\'t Notify', icon: HeartBrokenOutlined }} />
                    <ListItemRdX link={{ name: 'Unfollow', icon: HeartBrokenOutlined }} onClick={handleFollowSystem} />
                </Menu>
            </> :
            <Button variant="contained" color="primary" size="small" {...options?.button?.Props}>
                Follow
            </Button>
    )
}


const CreatorWrapper = ({ children, keyId }) => {
    return (
        <Tooltip title={<>We are working on it.</>} arrow enterDelay={1300} leaveDelay={300}
            enterNextDelay={800}
            PopperProps={{
                onClick(e) {
                    e.stopPropagation();
                }
            }}>
            <span>
                {children}
            </span>
        </Tooltip>
    )
}

/**
 * @deprecated
 */
const AuthorTipView = ({ shortId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // -----
            }
            catch {
                toast.error('Something Went Wrong')
            }
        };
        fetchData();
    }, [shortId]);

    return (
        data ? <>
            <section className="px-4 py-2 w-72 max-w-72 relative">
                <div className="flex items-center justify-between">
                    <AuthorAvatar data={data?.image} sx={{ width: '40px', height: '40px' }} />
                    <div className="ml-3 mr-1">
                        Follow
                    </div>
                </div>
                <div className="mt-1">
                    <h3 className="text-lg karnak font-bold text-white dark:text-black">{data?.name}</h3>
                    <p className="text-sm mt-0.5 franklin font-medium text-zinc-200 dark:text-zinc-800">{data?._count?.followers} Followers</p>
                </div>
                {data?.bio ? <div className="mt-4">
                    <p className="text-xs font-normal franklin text-zinc-300 dark:text-zinc-700 line-clamp-3 text-ellipsis">{data?.bio}</p>
                </div> : null}
            </section>
        </> :
            <section className="px-4 py-2 w-72 max-w-72">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={100} height={18} />
                <Skeleton variant="text" width={'100%'} className="mt-3" height={16} />
                <Skeleton variant="text" width={'100%'} height={16} />
                <Skeleton variant="text" width={'40%'} height={16} />
            </section>
    )

}

export { CreatorWrapper }

export { CreatorFollowButton };