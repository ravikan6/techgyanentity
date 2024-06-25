"use client";
/**
 * Renders the buttons for a post, including claps, comments, bookmarks, share, and more options.
 * @param {Object} props - The props object containing the post ID.
 * @returns {JSX.Element} - The JSX element representing the post buttons.
 */
import { AiOutlineComment } from 'react-icons/ai';
import { PiHandsClappingLight } from 'react-icons/pi';
// import { ShareModal } from './share';
import Bookmark from './bookmark';
import { BtnWithMenu } from '../Buttons';
import { Button } from '../rui';
import { SwipeableDrawer } from '@mui/material';
import { ArticleComments } from './_client';
import { useState } from 'react';

/**
 * Renders the buttons for a post, including claps, comments, bookmarks, share, and more options.
 * @param {Object} props - The props object containing the post ID.
 * @returns {JSX.Element} - The JSX element representing the post buttons.
 */
export const PostActions = ({ id, className, modern }) => {
    const [drawable, setDrawable] = useState(false);

    return (
        <>
            <div className={`flex my-2 h-8 overflow-hidden ${modern ? 'justify-between' : 'justify-start'} space-x-6 items-center flex-row ${className}`}>
                <div className={`justify-start flex items-center space-x-6`}>
                    <ClapPost />
                    <Button

                        sx={{ px: 2, height: '32px' }} size='small' variant='outlined' color='primary' startIcon={<AiOutlineComment />} endIcon={<><span className='font-xs leading-none'>--</span></>} />
                </div>
                <div className={`${modern ? ' justify-end' : ' justify-start'} flex items-center space-x-6`}>
                    <Bookmark id={id} />
                    <BtnWithMenu id={id} />
                </div>
            </div>
            <SwipeableDrawer disableSwipeToOpen={false}
                swipeAreaWidth={40}
                sx={{ height: '100%' }}
                container={document?.body}
                slotProps={{
                    root: {
                        style: {
                            height: '100%',
                            borderRadius: '20px 20px 0 0'
                        }
                    }
                }}
                ModalProps={{
                    keepMounted: true,
                }} anchor="bottom" open={drawable} onClose={() => setDrawable(false)} onOpen={() => setDrawable(true)}>
                <div className="visible">
                    <ArticleComments articleId={id} />
                </div>
            </SwipeableDrawer>
        </>
    );
}

const ClapPost = () => {
    return (
        <Button sx={{ px: 2, height: '32px' }} size='small' variant='outlined' color='primary' startIcon={<PiHandsClappingLight />} endIcon={<><span className='font-xs leading-none'>--</span></>} >
            {/* <div className='h-full w-0.5 rounded-md bg-secondary/40 dark:bg-secondaryDark/20'></div> */}
        </Button>
    );
}