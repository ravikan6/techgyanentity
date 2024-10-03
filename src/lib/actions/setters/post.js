"use server";

import { api } from "@/lib/client";
import { VOTE_ON_POST_COMMENT, VOTE_ON_POST_POLL, CREATE_POST_POLL, CREATE_POST, CREATE_POST_IMAGE } from "@/lib/types/post";
import { uploadImage } from "../upload";

const createPost = async (input) => {
    let res = { data: null, success: false, errors: [] };
    if (!input && !input?.authorKey) {
        res.errors.push({ message: 'No data provided' })
        return res
    }

    let typeOfId, client = await api();

    try {
        switch (input.type) {
            case "IMAGE": {
                if (!input.content?.images) {
                    res.errors.push({ message: 'No image provided' })
                    return res
                }
                let images = input.content.images.map((i, index) => {
                    let file = i.file?.has("data") ? i.file.get("data") : i.file;

                    if (!file) {
                        res.errors.push({ message: `No file provided for image ${index + 1}` })
                        return res
                    }
                    return {
                        file: file,
                        caption: i?.caption,
                        location: i?.location,
                    }
                });

                let newImages = await Promise.all(images.map(async (i) => {
                    let url = await uploadImage(i.file, 'TechGyan');
                    return {
                        url: url.data.public_id,
                        caption: i?.caption,
                        provider: 'cloudinary',
                        action: 'CREATE'
                    }
                }));

                let { data, errors } = await client.mutate({
                    mutation: CREATE_POST_IMAGE,
                    variables: {
                        images: newImages
                    }
                })
                if (data && data?.createPostImage?.postImage) {
                    typeOfId = await data?.createPostImage?.postImage?.id;
                } else {
                    throw new Error('Something went wrong while creating poll.')
                }
            } case "POLL": {
                if (!input.content?.options) {
                    res.errors.push({ message: 'No options provided' })
                    return res
                }
                let options = input.content.options.map((o, i) => {
                    return {
                        id: i + 1,
                        text: o
                    }
                })

                let { data, errors } = await client.mutate({
                    mutation: CREATE_POST_POLL,
                    variables: {
                        question: input.content?.title,
                        options: options
                    }
                })
                if (data && data?.createPostPoll?.poll) {
                    typeOfId = await data?.createPostPoll?.poll?.id;
                } else {
                    throw new Error('Something went wrong while creating poll.')
                }
                break;
            } default: {
                if (!input.content?.title) {
                    res.errors.push({ message: 'No title provided' })
                    return res
                }
            }
        }
    } catch (e) {
        res.errors.push({ message: 'Something went wrong' })
        return res
    }

    if (input.type !== 'TEXT' && !typeOfId) {
        res.errors.push({ message: 'Something went wrong' })
        return res
    }

    try {
        let { data, errors } = await client.mutate({
            mutation: CREATE_POST,
            variables: {
                authorKey: input.authorKey,
                data: {
                    typeOf: input.type,
                    state: 'PUBLISHED',
                    typeOfId: typeOfId,
                    text: input.content?.title
                }
            }
        })
        if (data && data?.createPost?.post) {
            res.success = true
            res.data = await data?.createPost?.post;
        }
    } catch (e) {
        res.errors.push({ message: 'An error occurred' })
    }
    return res;
}

const updatePostCommentVote = async (id) => {
    let res = { data: null, success: false, errors: [] }

    if (!id) return res;

    try {
        let client = await api();

        let { data, errors } = await client.mutate({
            mutation: VOTE_ON_POST_COMMENT,
            variables: {
                id: id,
            }
        })
        if (data && data.voteOnPostComment?.comment) {
            let comment = await data.voteOnPostComment.comment;
            res.data = comment
            res.success = true
        }
        if (errors) {
            res.errors = errors
        }
        return res;

    } catch (e) {
        res.errors = [...res.errors, { message: e?.message }]
        res.success = false
        return res;
    }

}

const updatePostPollVote = async (postKey, optionId) => {
    let res = { data: null, success: false, errors: [] }

    if (!postKey || typeof optionId !== "number") return res;

    try {
        let client = await api();

        let { data, errors } = await client.mutate({
            mutation: VOTE_ON_POST_POLL,
            variables: {
                postKey: postKey,
                optionId: optionId,
            }
        })
        if (data && data.doVotePostPoll?.poll) {
            let poll = await data.doVotePostPoll.poll;
            res.data = poll
            res.success = true
        }
        if (errors) {
            res.errors = errors
        }
        return res;

    } catch (e) {
        res.errors = [...res.errors, { message: e?.message }]
        res.success = false
        return res;
    }

}

export { updatePostCommentVote, updatePostPollVote }

export { createPost };