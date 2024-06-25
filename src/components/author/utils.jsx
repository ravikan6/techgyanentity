"use client";
import { useSession } from "next-auth/react";
import { Button } from "../rui";
import React, { useEffect, useState } from "react";
import { checkAuthorFollowAction, followAuthorAction } from "@/lib/actions/author";
import { toast } from "react-toastify";

const FollowButton = ({ authorId }) => {
    const [isFollowing, setIsFollowing] = useState({ status: false, id: null });
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const { data: session } = useSession();

    useEffect(() => {
        const checkAuthorFollow = async () => {
            if (session) {
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
    }, [session]);

    const handleFollowSystem = async () => {
        setIsLoaded(false);
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
        <>
            <Button disabled={!isLoaded || error} onClick={handleFollowSystem} variant="contained" color="primary" size="small" >
                {isFollowing?.status ? 'Following' : 'Follow'}
            </Button>
        </>
    )
}


export { FollowButton }