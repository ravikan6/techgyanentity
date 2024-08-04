"use client";
/**
 * Renders the buttons for a post, including claps, comments, bookmarks, share, and more options.
 * @param {Object} props - The props object containing the post ID.
 * @returns {JSX.Element} - The JSX element representing the post buttons.
 */
import { AiOutlineComment } from 'react-icons/ai';
import { PiHandsClappingLight } from 'react-icons/pi';
import { BookmarkBtn, BtnWithMenu, PostEditButton } from '../Buttons';
import { Button, SwipeableDrawer } from '../rui';
import { ArticleComments } from './_client';
import { useState, useEffect, useContext } from 'react';
import { articleClapsAction, articleClapsList, bookmarkAction, checkBookmarkAction, isPostAuthor } from '@/lib/actions/author';
import { useSession } from 'next-auth/react';
import { FaHandsClapping } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { StudioContext } from '@/lib/context';

/**
 * Renders the buttons for a post, including claps, comments, bookmarks, share, and more options.
 * @param {Object} props - The props object containing the post ID.
 * @returns {JSX.Element} - The JSX element representing the post buttons.
 */
export const PostActions = ({ id, className, modern, commentCount, isExpanded, article }) => {
    const [drawable, setDrawable] = useState(false);

    return (
        <>
            <div className={`flex my-2 h-8 overflow-hidden ${modern ? 'justify-between' : 'justify-start'} space-x-6 items-center flex-row ${className}`}>
                <div className={`justify-start flex items-center space-x-6`}>
                    <ClapPost id={id} />
                    {!isExpanded && <Button
                        onClick={() => setDrawable(true)}
                        sx={{ px: 2, height: '32px' }} size='small' variant='outlined' color='primary' startIcon={<AiOutlineComment />} endIcon={<><span className='!text-xs'>{(commentCount == null || commentCount == undefined) ? '--' : commentCount}</span></>} />}
                    <AuthorActions id={id} authorId={article?.author?.id} />
                </div>
                <div className={`${modern ? ' justify-end' : ' justify-start'} flex items-center space-x-6`}>
                    <Bookmark id={article?.shortId} />
                    <BtnWithMenu id={id} />
                </div>
            </div>
            {!isExpanded && <SwipeableDrawer disableSwipeToOpen={false}
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
                    keepMounted: false,
                }} anchor="bottom" open={drawable} onClose={() => setDrawable(false)} onOpen={() => setDrawable(true)}>
                <div className="">
                    <ArticleComments articleId={id} article={article} />
                </div>
            </SwipeableDrawer>}
        </>
    );
}

export const Bookmark = ({ id, variant }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        try {
            checkBookmarkAction(id).then((res) => {
                if (res?.status === 200) {
                    setIsBookmarked(res?.data?.status);
                }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleBookmarkClick = async () => {
        setIsLoading(true);
        try {
            let res = await bookmarkAction(id)
            if (res?.status === 200) {
                setIsBookmarked(res?.data?.status);
                toast.success(res?.data?.status ? 'Bookmarked' : 'Unbookmarked');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <BookmarkBtn variant={variant} isLoading={isLoading} onClick={handleBookmarkClick} bookmarked={isBookmarked} />
    );
}

const ClapPost = ({ id }) => {
    const [claps, setClaps] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClapped, setIsClapped] = useState({ is: false, clappedId: null });
    const [clapsCount, setClapsCount] = useState(0);
    const { data: session } = useSession();

    useEffect(() => {
        articleClapsList(id).then((res) => {
            setClaps(res?.data);
            setClapsCount(res?.data?.length);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    }, [id])

    useEffect(() => {
        if (claps) {
            claps.forEach((clap) => {
                if (clap?.userId == session?.user?.id) {
                    setIsClapped({ is: true, clappedId: clap?.id });
                }
            });
        }
    }, [claps])

    const handleClap = async () => {
        setIsLoading(true);
        try {
            if (isClapped.is && isClapped.clappedId) {
                let res = await articleClapsAction(isClapped.clappedId, 'delete');
                if (res?.status === 200) {
                    setIsClapped({ is: false, clappedId: null });
                    setClapsCount(clapsCount - 1);
                }
            } else {
                let res = await articleClapsAction(id, 'create');
                if (res?.status === 200) {
                    let clapped = res?.data;
                    if (clapped) {
                        setIsClapped({ is: true, clappedId: clapped?.id });
                        setClapsCount(clapsCount + 1);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to clap');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button disabled={isLoading} sx={{ px: 2, height: '32px' }} onClick={handleClap} size='small' variant='outlined' color='primary' startIcon={isClapped?.is ? <FaHandsClapping className="w-4 h-4" /> : <PiHandsClappingLight className="w-4 h-4" />} endIcon={<><span className='!text-xs'>{(clapsCount === null || clapsCount === undefined) ? '--' : clapsCount}</span></>} />
    );
}


const AuthorActions = ({ id, authorId }) => {
    const { data } = useContext(StudioContext);

    if (data?.data?.id === authorId) {
        return (
            <PostEditButton href={`/${process.env.NEXT_PUBLIC_STUDIO_PATH}/p/${id}/edit`} />
        );
    }
}