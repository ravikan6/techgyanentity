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

/**
 * Renders the buttons for a post, including claps, comments, bookmarks, share, and more options.
 * @param {Object} props - The props object containing the post ID.
 * @returns {JSX.Element} - The JSX element representing the post buttons.
 */
export const PostActions = ({ id, className, modern }) => {

    return (
        <>
            <div className={`flex my-2 h-8 overflow-hidden ${modern ? 'justify-between' : 'justify-start'} space-x-6 items-center flex-row ${className}`}>
                <div className={`justify-start flex items-center space-x-6`}>
                    <ClapPost />
                    {/* <AiOutlineComment className="h-6 w-6 ml-6 dark:text-gray-200 text-slate-500" />
                    <div className="ml-1 text-gray-500">2K</div> */}
                </div>
                <div className={`${modern ? ' justify-end' : ' justify-start'} flex items-center space-x-6`}>
                    <Bookmark id={id} />
                    <BtnWithMenu id={id} />
                </div>
            </div>
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