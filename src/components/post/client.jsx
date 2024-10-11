"use client";

import { formatNumber } from "@/lib/utils";
import { Button, Tooltip } from "../rui";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { CommentContext, StudioContext } from "@/lib/context";
import { GET_POST_COMMENTS } from "@/lib/types/post";
import { CommentContainer } from "../common";
import { ActionMenu, BackBtn, NextBtn } from "../Buttons";
import { Delete, HeartBroken } from "@mui/icons-material";
import { addPostComment, updatePostComment, updatePostCommentVote, updatePostPollVote } from "@/lib/actions/setters/post";
import Image from 'next/image';
import { IoResize } from 'react-icons/io5';
import IconButton from '@mui/material/IconButton';

const MetaTypePollView = ({ poll, options }) => {
    const [pollData, setPollData] = useState(poll);
    const [disabled, setDisabled] = useState(false);

    const onSubmit = async (option) => {
        if (!options?.key || typeof option !== "number") return null;
        setDisabled(true);
        try {
            let res = await updatePostPollVote(options?.key, option);

            if (res.success) {
                setPollData((prev) => ({ ...prev, ...res.data }))
            }
            if (res.errors) {
                res.errors.forEach((e) => toast.error(e?.message))
            }
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setDisabled(false)
        }
    }

    return (
        <div className="mb-1">
            <h3 className="text-base text-gray-900 dark:text-gray-100">{pollData?.question}</h3>
            <div className="mt-3 flex flex-col gap-2.5">
                {
                    pollData?.options?.map((option, index) => (
                        <Tooltip key={index} title={option?.text}>
                            <div className="relative h-auto rounded-[12px] overflow-hidden z-[1]">
                                <Button
                                    onClick={() => onSubmit(option?.id)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    disabled={disabled}
                                    sx={{
                                        justifyContent: 'space-between',
                                        px: 1.5,
                                        borderRadius: '12px',
                                        textAlign: 'start'
                                    }}
                                    endIcon={
                                        (option?.votes !== null && option?.votes !== undefined && typeof pollData?.myVote === "number")
                                            ? (
                                                <span className="!text-xs cheltenham">
                                                    {((option?.votes / pollData?.votesCount * 100) || 0).toFixed(2)}%
                                                </span>
                                            ) : null
                                    }
                                >
                                    <span className="mr-0.5">{option?.text}</span>
                                </Button>
                                <div
                                    className={`absolute h-full top-0 ${disabled ? 'bg-gray-200 dark:bg-gray-600' : 'bg-secondary dark:bg-secondaryDark'}`}
                                    style={{
                                        zIndex: '-1',
                                        width: (option?.votes !== null && option?.votes !== undefined) ? `${(option?.votes / pollData?.votesCount * 100).toFixed(2)}%` : '0px',
                                        opacity: pollData?.votesCount ? (pollData?.myVote !== null && pollData?.myVote === option?.id) ? 1 : 0.4 : 0,
                                    }}
                                />
                            </div>
                        </Tooltip>
                    ))
                }
            </div>
            <div className="mt-3 text-sm cheltenham text-gray-600 dark:text-gray-400 font-bold">
                <Link href={options?.url || '#'}>
                    {formatNumber(pollData?.votesCount)} Votes
                </Link>
            </div>
        </div>
    )
}

const MetaTypeImageView = ({ content, options }) => {
    let slides = content?.images || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasNext, setHasNext] = useState(slides.length > 1);
    const [hasPrev, setHasPrev] = useState(false);
    const [original, setOriginal] = useState(true);

    const startX = useRef(0);
    const endX = useRef(0);

    const goToNextSlide = useCallback(() => {
        setTimeout(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            setCurrentIndex(nextIndex);
            setHasPrev(true);
            setHasNext(nextIndex < slides.length - 1);
        }, 100);
    }, [currentIndex, slides.length]);

    const goToPrevSlide = useCallback(() => {
        setTimeout(() => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            setCurrentIndex(prevIndex);
            setHasPrev(prevIndex > 0);
            setHasNext(true);
        }, 100);
    }, [currentIndex, slides.length]);

    const radioBtnClick = useCallback((index) => {
        setTimeout(() => {
            setCurrentIndex(index);
            setHasPrev(index > 0);
            setHasNext(index < slides.length - 1);
        }, 200);
    }, [slides.length]);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        endX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (startX.current - endX.current > 50) {
            goToNextSlide();
        } else if (endX.current - startX.current > 50) {
            goToPrevSlide();
        }
    };

    return (
        <div
            className={`relative group ${options?._1v1 ? 'aspect-square' : 'aspect-[4/5]'} mx-auto ${options?.blackBg ? 'bg-black' : 'bg-transparent'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-full h-full overflow-hidden">
                {/* Images Slider */}
                <div
                    className={`flex transition-transform h-full duration-500 ease-in-out`}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="flex-shrink-0 relative w-full h-full">
                            <Image
                                fill
                                className={`w-full h-full ${original ? 'object-contain' : 'object-cover'}`}
                                src={slide?.url}
                                alt={slide?.alt || 'Slide image'}
                                draggable={false}
                            />
                            {slide?.caption && (
                                <div className="absolute text-sm bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
                                    {slide.caption}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Original Image Button */}
            <div className={`absolute right-4 bottom-4 bg-accentLight dark:bg-accentDark ${original ? 'opacity-60' : 'opacity-100'} rounded-full transition-all duration-300`}>
                <IconButton
                    onClick={() => setOriginal(!original)}
                    className="rounded-full"
                >
                    <IoResize className="w-4 h-4" />
                </IconButton>
            </div>

            {slides.length > 1 && (
                <>
                    <BackBtn
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2  rounded-full opacity-80 hover:opacity-100 ${hasPrev ? 'bg-accentLight/90 dark:bg-accentDark/90 shadow-md' : 'bg-lightHead/30 dark:bg-darkHead/30'}`}
                        onClick={goToPrevSlide}
                        disabled={!hasPrev}
                    >
                    </BackBtn>
                    <NextBtn
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 ${hasNext ? 'bg-accentLight/90 dark:bg-accentDark/90 shadow-md' : 'bg-lightHead/30 dark:bg-darkHead/30'}`}
                        onClick={goToNextSlide}
                        disabled={!hasNext}
                    ></NextBtn>
                    <div className="absolute bottom-4 z-10 w-full flex justify-center space-x-2 items-center">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => radioBtnClick(index)}
                                className={`rounded-full transition-all ${index === currentIndex ? 'bg-accentLight dark:bg-accentDark w-2.5 h-2.5' : 'bg-accentLight/70 dark:bg-accentDark/70 w-2 h-2'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const MetaMoreMenu = () => {
    const listMenu = [
        { label: 'Edit', icon: HeartBroken },
        { label: 'Delete', icon: Delete },
        { label: 'Report', icon: HeartBroken }
    ];

    return (
        <ActionMenu list={listMenu} />
    )
}

const CommentView = ({ post }) => {
    const [comments, setComments] = useState([]);
    const [form, setForm] = useState({
        text: '',
        show: false,
        action: 'CREATE', // "UPDATE", "REPLY"
        parentId: null
    })
    const [sending, setSending] = useState(false);
    const [reply, setReply] = useState({
        data: null,
        id: null,
    })
    const { creator } = useContext(StudioContext);
    const observer = useRef();
    const lastItemRef = useRef(null);

    const [getComments, { data, loading, error, called }] = useLazyQuery(GET_POST_COMMENTS);

    useEffect(() => {
        if (post.key && !called) {
            getComments({
                variables: {
                    key: post.key,
                    parent_Id: null,
                }
            })
        }
        if (data && data.PostComments.edges) {
            setComments(
                [...comments, ...data.PostComments.edges]
            )
        }
    }, [post, called, data])

    useEffect(() => {
        if (loading || !data?.PostComments?.pageInfo?.hasNextPage) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && data?.PostComments?.pageInfo?.hasNextPage) {
                getComments({
                    variables: {
                        key: post.key,
                        parent_Id: null,
                        after: data?.PostComments?.pageInfo?.endCursor
                    }
                });
            }
        });

        if (lastItemRef.current) observer.current.observe(lastItemRef.current);
    }, [loading]);


    const onSend = async () => {
        if (!form.text || !form.show || !form.action || !post.key) return null;
        if (form.action === 'REPLY' && !form.parentId) return null;
        if (form.action === 'UPDATE' && !form?.commentId) return null;
        let authorKey = creator?.data?.key === post?.author?.key ? creator?.data?.key : null;
        try {
            setSending(true)
            if (form.action === 'UPDATE') {
                let res = await updatePostComment(form.commentId, form.text);

                if (res.success) {
                    let comment = res.data;
                    if (form.parentId) {
                        setReply({
                            data: comment,
                            action: 'UPDATE'
                        })
                    } else {
                        let newComments = comments.map((item) => (item.node.id === comment.id) ? { ...item, node: { ...item.node, ...comment } } : item);
                        setComments(newComments)
                    }
                    setForm({
                        text: '',
                        show: false,
                        action: 'CREATE',
                        parentId: null,
                    })
                }

            } else {
                let res = await addPostComment(post.key, form.text, form.action, form.parentId, authorKey)

                if (res.success) {
                    if (form.action === 'REPLY') {
                        setReply({
                            data: res.data,
                            action: 'NEW'
                        })
                    } else {
                        setComments((prev) => [{ cursor: null, node: res.data, ...prev }])
                    }
                    setForm({
                        text: '',
                        show: false,
                        action: 'CREATE',
                        parentId: null,
                    })
                }
            }
        } catch (e) {
            console.log(e) // #remove
        } finally {
            setSending(false)
        }
    }

    const onVote = async (id) => {
        if (id === null || id === undefined) return null;

        try {
            let res = await updatePostCommentVote(id);
            if (res.success) {
                return {
                    me: res.data?.myVote,
                    count: res.data?.votes
                };
            }
            return null;
        } catch (e) {
            console.log(e) // #remove
        }
    }

    return (
        <CommentContext.Provider value={{
            form: {
                data: form,
                set: setForm,
            },
            state: {
                loading: loading === undefined ? true : loading,
                sending: sending,
                setSending: setSending,
                lastItemRef: lastItemRef,
                hasMore: data?.PostComments?.pageInfo?.hasNextPage || false,
            },
            content: {
                key: post?.key,
                authorKey: post?.author?.key,
            },
            comment: {
                data: comments,
                set: setComments,
                count: post?.commentsCount || 0,
            },
            onSend: onSend,
            re: {
                query: GET_POST_COMMENTS,
                resolver: (data) => {
                    if (data && data?.PostComments?.edges) {
                        return {
                            data: data?.PostComments?.edges,
                            pageInfo: data?.PostComments?.pageInfo
                        }
                    } else return { data: [], pageInfo: {} };
                },
                reply: reply,
                setReply: setReply,
            },
            onVote: onVote,
        }}>
            <CommentContainer />
        </CommentContext.Provider>
    )
}

export { MetaTypePollView, MetaMoreMenu, CommentView, MetaTypeImageView };