"use client";
import { useSession } from "next-auth/react";
import { Button, Menu, Tooltip } from "../rui";
import React, { useMemo, useState } from "react";
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
        <Tooltip title={<AuthorTipView shortId={shortId} />} arrow enterDelay={800} leaveDelay={300}>
            {children}
        </Tooltip>
    )
}


const AuthorTipView = ({ shortId }) => {
    const [data, setData] = useState(null);

    useMemo(() => {
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
                <div className="flex items-center">
                    <AuthorAvatar data={data?.image} sx={{ width: '80px', height: '80px' }} />
                    <div className="ml-4">
                        <h3 className="text-lg karnak font-bold">{data?.name}</h3>
                        <p className="text-sm mt-0.5 stymie italic text-gray-500">{data?._count?.followers} Followers</p>
                    </div>
                </div>
                <div className="mt-4">
                    <FollowButton authorId={data?.id} buttonProps={{ fullWidth: true }} />
                </div>
            </section>
        </> :
            <section className="px-4 py-2 max-w-72">
                <div className="flex items-center">
                    <Skeleton variant="circular" width={80} height={80} />
                    <div className="ml-4">
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width={80} height={20} />
                    </div>
                </div>
                <div className="mt-4">
                    <Skeleton variant="rounded" height={40} />
                </div>
            </section>
    )

}

export { FollowButton, AuthorTipWrapper }