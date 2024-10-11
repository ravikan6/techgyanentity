"use client";
import { useSession } from "next-auth/react";
import { Button, Menu, MenuItem, Tooltip } from "../rui";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { BiChevronDown } from "react-icons/bi";
import { AuthorBottomButtons } from "./_client";
import { ListItem, ListItemIcon, Skeleton, Typography } from "@mui/material";
import { followCreator, unfollowCreator } from "@/lib/actions/setters/creator";
import { MdNotificationsActive, MdOutlineCheck, MdOutlineNotifications, MdOutlineNotificationsOff } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { AnonymousAction } from "../common";
import { useLazyQuery } from "@apollo/client";
import Image from "next/image";
import { ErrorBox } from "../post/_struct";
import { GET_CREATOR_IN_TIP } from "@/lib/types/creator";

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

    const handleFollow = async (notifications) => {
        setLoading(true);
        const res = await followCreator({ key: options?.creator, notifPref: notifications });
        if (res?.success) {
            setFollowed(res.data?.followed);
            setError(null);
            toast.success('Followed successfully');
        } else {
            setError(res.errors);
        }
        setLoading(false);
    }

    const handleUnfollow = async () => {
        setLoading(true);
        const res = await unfollowCreator(options?.creator);
        if (res.success) {
            setFollowed(res.data?.followed);
            setError(null);
            toast.success('Unfollowed successfully');
        } else {
            setError(res.errors);
        }
        setLoading(false);
    }

    const notifList = [
        { name: 'All Notifications', icon: <MdNotificationsActive />, value: 'ALL' },
        { name: 'Personalized', icon: <MdOutlineNotifications />, value: 'PERSONALIZED' },
        { name: 'No Notifications', icon: <MdOutlineNotificationsOff />, value: 'NONE' },
    ]

    return (
        session?.user ?
            <>
                <Button
                    disabled={loading}
                    onClick={followed?.byMe ? handleMenuOpen : () => handleFollow('ALL')}
                    variant="contained"
                    sx={followed?.byMe && { backgroundColor: (theme) => theme.palette.divider }}
                    color={error ? 'error' : followed?.byMe ? "divider" : "primary"}
                    size="small"
                    startIcon={followed?.byMe && (followed?.notifPref === 'ALL' ? <MdNotificationsActive /> : followed?.notifPref === 'PERSONALIZED' ? <MdOutlineNotifications /> : <MdOutlineNotificationsOff />)}
                    endIcon={followed?.byMe && <BiChevronDown />}
                    {...options?.button?.Props} >
                    {error ? 'Retry' : followed?.byMe ? 'Following' : 'Follow'}
                </Button >
                <Menu
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'Creator Follow Menu',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: '12px !important',
                            }
                        }
                    }}>
                    {
                        notifList.map((item, index) => (
                            <MenuItem key={index} onClick={() => {
                                handleFollow(item.value);
                            }} sx={{
                                justifyContent: 'space-between'
                            }}>
                                <ListItemIcon>
                                    {item?.icon}
                                </ListItemIcon>
                                <Typography variant="inherit">
                                    {item.name}
                                </Typography>
                                {followed?.notifPref === item.value && <ListItemIcon>
                                    <MdOutlineCheck />
                                </ListItemIcon>}
                            </MenuItem>
                        ))
                    }
                    <MenuItem onClick={handleUnfollow}>
                        <ListItemIcon>
                            <AiOutlineUserDelete />
                        </ListItemIcon>
                        Unfollow
                    </MenuItem>
                </Menu>
            </> :
            <AnonymousAction isAnonymous={true} text={'Please login to follow'} >
                <Button variant="contained" color="primary" size="small" {...options?.button?.Props}>
                    Follow
                </Button>
            </AnonymousAction>
    )
}


const CreatorWrapper = ({ children, keyId }) => {
    return (
        <Tooltip title={<CreatorWrapperView creatorKey={keyId} />} arrow enterDelay={1300} leaveDelay={300}
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

const CreatorWrapperView = ({ creatorKey }) => {
    const [getCreator, { data, error, loading, called }] = useLazyQuery(GET_CREATOR_IN_TIP)

    useEffect(() => {
        if (creatorKey) {
            getCreator({ variables: { key: creatorKey } })
        }
    }, [creatorKey])

    const creator = data?.Creators?.edges[0]?.node;

    return (
        called && data ? <>
            <section className="px-4 py-2 w-72 max-w-72 relative">
                <div className="flex items-center justify-start gap-4">
                    <Image src={creator?.image?.url} width={40} height={40} className="rounded-full" />
                    <div className="flex flex-col">
                        <h3 className="text-base karnak font-bold text-white dark:text-black">{creator?.name}</h3>
                        <p className="text-xs franklin font-medium text-zinc-200 dark:text-zinc-800">{creator?.handle}</p>
                    </div>
                </div>
                <div className="mt-1 flex flex-col">
                    <div className="flex gap-2 justify-start items-center overflow-hidden">
                        {creator?.social?.slice(0, 2)?.map((item, i) => (
                            <AuthorBottomButtons key={i} url={item?.url} title={item?.name} isExt={true} />
                        ))}
                    </div>
                    <CreatorFollowButton value={creator?.followed} options={{ creator: creator?.key }} />
                </div>
                {creator?.description ? <div className="mt-4">
                    <p className="text-xs font-normal franklin text-zinc-300 dark:text-zinc-700 line-clamp-3 text-ellipsis">{creator?.description}</p>
                </div> : null}
            </section>
        </> :
            loading ? <section className="px-4 py-2 w-72 max-w-72">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={100} height={18} />
                <Skeleton variant="text" width={'100%'} className="mt-3" height={16} />
                <Skeleton variant="text" width={'100%'} height={16} />
                <Skeleton variant="text" width={'40%'} height={16} />
            </section> : error ? <ErrorBox error={error} onRetry={
                () => getCreator({ variables: { key: creatorKey } })
            } /> : null
    )
}

export { CreatorWrapper }

export { CreatorFollowButton };