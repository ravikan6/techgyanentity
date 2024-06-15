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

/**
 * Renders the buttons for a post, including claps, comments, bookmarks, share, and more options.
 * @param {Object} props - The props object containing the post ID.
 * @returns {JSX.Element} - The JSX element representing the post buttons.
 */
export const PostActions = (props) => {

    return (
        <>
            <div className='my-2'>
                <div className="flex border-y px-4 py-2 justify-between items-center dark:border-y-slate-800 border-y-gray-200 flex-row">
                    <div className='flex'>
                        <PiHandsClappingLight className="h-6 w-6 dark:text-gray-200 text-slate-500" />
                        <div className="ml-1 text-gray-500">--</div>
                        <AiOutlineComment className="h-6 w-6 ml-6 dark:text-gray-200 text-slate-500" />
                        <div className="ml-1 text-gray-500">2K</div>
                    </div>
                    <div className="flex justify-end">
                        <Bookmark id={props.id} />
                        {/* <ShareModal id={props.id} ch_id={ch_id} url={'https://raviblog.tech/#new/hellow/benn/value/me/now-you-dont-know-about-me/kk'} /> */}
                        <BtnWithMenu id={props.id} />
                    </div>
                </div>
            </div>
        </>
    );
}