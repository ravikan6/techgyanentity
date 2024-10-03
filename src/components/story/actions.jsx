"use client";

import { useState } from "react";
import { Button, Tooltip } from "../rui";
import { PiHandsClappingLight } from "react-icons/pi";
import { FaHandsClapping } from "react-icons/fa6";
import { BookmarkButton, CommonShareView, MoreMenuButton, ShareButton } from "../common";
import { AiOutlineComment } from "react-icons/ai";
import { updateStoryClap } from "@/lib/actions/setters/story";
import { toast } from "react-toastify";


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

    return (
        <>
            <BookmarkButton is={is} options={{
                button: options?.button,
            }} />
        </>
    );
}

const ShareView = ({ }) => {
    return (
        <>
            <CommonShareView options={{
                meta: {
                    url: '/hello-world'
                }
            }} />
        </>
    );
}

const MoreMenuView = ({ }) => {

    return (
        <>
            <MoreMenuButton />
        </>
    );
}


export { ClapView, BookmarkView, ShareView, MoreMenuView, CommentButtonView };