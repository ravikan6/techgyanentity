"use client";
import { useSession } from "next-auth/react";
import { Button, Menu, Tooltip } from "../rui";
import React, { useEffect, useMemo, useState } from "react";
import { checkAuthorFollowAction, followAuthorAction, getAuthorForTip } from "@/lib/actions/author";
import { toast } from "react-toastify";
import { HeartBrokenOutlined } from "@mui/icons-material";
import { ListItemRdX } from "../Home/_profile-model";
import { BiChevronDown } from "react-icons/bi";
import { UnAuthorizedActionWrapper } from "../post/postActions";
import { AuthorAvatar } from "./_client";
import { Skeleton } from "@mui/material";

const FollowButton = ({ authorId, buttonProps }) => {
    const [isFollowing, setIsFollowing] = useState({ status: false, id: null });
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const { data: session } = useSession();

    useMemo(() => {
        const checkAuthorFollow = async () => {
            if (session?.user) {
                const res = await checkAuthorFollowAction(authorId);
                if (res?.data) {
                    setIsFollowing(res?.data);
                } else {
                    setError(res?.errors);
                }
                setIsLoaded(true);
            }
        };
        checkAuthorFollow();
    }, [session?.user]);

    const handleFollowSystem = async () => {
        setIsLoaded(false);
        handleMenuClose();
        try {
            if (session) {
                let res = await followAuthorAction(authorId)
                if (res?.data) {
                    setIsFollowing(res?.data);
                    if (res?.data?.status) {
                        toast.success('Followed');
                    } else {
                        toast.success('Unfollowed');
                    }
                } else {
                    setError(res?.errors);
                }
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoaded(true);
        }
    }

    return (
        session?.user ?
            <>
                <Button disabled={!isLoaded || error} onClick={isFollowing?.status ? handleMenuOpen : handleFollowSystem} variant="contained" sx={isFollowing?.status && { backgroundColor: (theme) => theme.palette.divider }} color={isFollowing?.status ? "divider" : "primary"} size="small" endIcon={isFollowing.status && <BiChevronDown />} {...buttonProps} >
                    {isFollowing?.status ? 'Following' : 'Follow'}
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
            <UnAuthorizedActionWrapper description={'Login to follow this author'} >
                <Button variant="contained" color="primary" size="small" {...buttonProps}>
                    Follow
                </Button>
            </UnAuthorizedActionWrapper>
    )
}

const AuthorTipWrapper = ({ children, shortId }) => {
    return (
        <Tooltip title={<AuthorTipView shortId={shortId} />} arrow enterDelay={1500} leaveDelay={300}
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


const AuthorTipView = ({ shortId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAuthorForTip(shortId);
                if (res?.data) {
                    setData(res?.data);
                }
            }
            catch {
                toast.error('Something Went Wrong')
            }
        };
        fetchData();
    }, [shortId]);

    return (
        data ? <>
            <section className="px-4 py-2 max-w-72">
                <div className="flex items-center justify-between">
                    <AuthorAvatar data={data?.image} sx={{ width: '40px', height: '40px' }} />
                    <div className="mx-3">
                        <FollowButton authorId={data?.id} />
                    </div>
                </div>
                <div className="mt-1">
                    <h3 className="text-lg karnak font-bold text-white dark:text-black">{data?.name}</h3>
                    <p className="text-sm mt-0.5 text-zinc-200 dark:text-zinc-800">{data?._count?.followers} Followers</p>
                </div>
                <div className="mt-4">
                    <p className="text-xs font-normal text-zinc-300 dark:text-zinc-700 line-clamp-3 text-ellipsis">{data?.bio}</p>
                </div>
            </section>
        </> :
            <section className="px-4 py-2 w-full max-w-72">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={100} height={18} />
                <Skeleton variant="text" width={'100%'} className="mt-3" height={16} />
                <Skeleton variant="text" width={'100%'} height={16} />
                <Skeleton variant="text" width={'40%'} height={16} />
            </section>
    )

}

export { FollowButton, AuthorTipWrapper }