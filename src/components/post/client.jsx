"use client";

import { formatNumber } from "@/lib/utils";
import { Button, Tooltip } from "../rui";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { CommentContext, StudioContext } from "@/lib/context";
import { GET_POST_COMMENTS } from "@/lib/types/post";
import { CommentContainer } from "../common";
import { ActionMenu } from "../Buttons";
import { Delete, HeartBroken } from "@mui/icons-material";
import { addPostComment, updatePostComment, updatePostCommentVote, updatePostPollVote } from "@/lib/actions/setters/post";

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
                data.PostComments.edges
            )
        }
    }, [post, called, data])

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
            },
            content: {
                key: post?.key,
                authorKey: post?.author?.key,
            },
            comment: {
                data: comments,
                set: setComments,
            },
            onSend: onSend,
            re: {
                query: GET_POST_COMMENTS,
                resolver: (data, setReplies) => {
                    if (data && data?.PostComments?.edges) {
                        setReplies(
                            data.PostComments.edges
                        )
                    }
                },
                reply: reply,
                setReply: setReply
            },
            onVote: onVote,
        }}>
            <CommentContainer />
        </CommentContext.Provider>
    )
}

export { MetaTypePollView, MetaMoreMenu, CommentView };