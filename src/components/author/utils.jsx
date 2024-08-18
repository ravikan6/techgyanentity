"use client";
import { useSession } from "next-auth/react";
import { Button, Menu } from "../rui";
import React, { useMemo, useState } from "react";
import { checkAuthorFollowAction, followAuthorAction } from "@/lib/actions/author";
import { toast } from "react-toastify";
import { HeartBrokenOutlined } from "@mui/icons-material";
import { ListItemRdX } from "../Home/_profile-model";
import { BiChevronDown } from "react-icons/bi";
import { UnAuthorizedActionWrapper } from "../post/postActions";

const FollowButton = ({ authorId }) => {
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
                <Button disabled={!isLoaded || error} onClick={isFollowing?.status ? handleMenuOpen : handleFollowSystem} variant="contained" sx={isFollowing?.status && { backgroundColor: (theme) => theme.palette.divider }} color={isFollowing?.status ? "divider" : "primary"} size="small" endIcon={isFollowing.status && <BiChevronDown />} >
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
                <Button variant="contained" color="primary" size="small" >
                    Follow
                </Button>
            </UnAuthorizedActionWrapper>
    )
}


export { FollowButton }