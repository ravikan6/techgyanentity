"use server";
import { auth } from "@/lib/auth";
import { api } from "@/lib/client";
import { ADD_STORY_COMMENT, CREATE_STORY, UPDATE_STORY_CLAP, UPDATE_STORY_COMMENT, UPDATE_STORY_CONTENT, UPDATE_STORY_DETAILS, UPDATE_STORY_SAVED, VOTE_ON_STORY_COMMENT } from "@/lib/types/story";
import { uploadImage, cloudinaryProvider } from "@/lib/actions/upload";
import { redirect } from "next/navigation";

/**
 * Creates a new story for the given author.
 *
 * @async
 * @function createStory
 * @param {string} authorKey - The key of the author for whom the story is being created.
 * @returns {Promise<Object>} An object containing the result of the story creation.
 * @property {Object|null} data - The data returned from the story creation, or null if there was an error.
 * @property {boolean} success - Indicates whether the story creation was successful.
 * @property {Array<Object>} errors - An array of error objects, each containing a message property.
 */
const createStory = async (authorKey) => {
    if (!authorKey) return { data: null, success: false, errors: [{ message: 'Author ID is required' }] };
    let key;

    try {
        let client = await api();
        const { data, errors } = await client.mutate({
            mutation: CREATE_STORY,
            variables: {
                authorKey: authorKey,
            },
            errorPolicy: 'all',
        });

        if (data?.createStory?.story) {
            key = data?.createStory?.story?.key;
        }
    } catch (error) {
        return { data: null, success: false, errors: [{ message: error.message }] };
    }
    if (key) {
        redirect(`/${process.env.STUDIO_URL_PREFIX || 'studio'}/p/${key}/editor`);
    }
}

const updateStoryContent = async (input) => {
    let res = { data: null, success: false, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let client = await api();
        const { data, errors } = await client.mutate({
            mutation: UPDATE_STORY_CONTENT,
            variables: {
                key: input.key,
                content: input.content,
                title: input.title,
            },
            errorPolicy: 'all',
        });
        if (data?.updateStory?.story) {
            res = { ...res, data: data?.updateStory?.story, success: true };
        }

        res = { ...res, errors: errors || [] };

        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

const updateStoryDetails = async (data) => {
    let res = { data: null, success: false, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let setter = { ...data?.data };
    let file = data?.file ? data?.file : new FormData();
    let cat = setter?.category?.id;
    let tags = setter?.tags.map((t) => t.name);
    delete setter.category;
    if (setter?.doPublish) {
        setter.state = 'PUBLISHED';
    }

    if (file.has('image') && setter?.image?.provider === 'file') {
        let image = file.get('image')
        try {
            let ftImage = await uploadImage(image);
            if (ftImage.success) {
                ftImage = await cloudinaryProvider(ftImage?.data);
                setter.image = { ...data?.data?.image, ...ftImage }
            } else {
                throw new Error(ftImage?.message);
            }
        } catch (error) {
            res.errors.push({ message: 'An error occurred while uploading post Image. Please try again later.' });
            setter?.image?.url && delete setter.image.url;
            setter?.image?.provider && delete setter.image.provider;
            setter?.image?.action && delete setter.image.action;
        }
    }

    try {
        let vars = {
            key: data.key,
            category: cat || null,
            description: setter?.description,
            privacy: setter?.privacy,
            state: setter?.state,
            tags: tags,
            title: setter?.title,
            slug: setter?.slug,
            doPublish: setter?.doPublish || false,
            image: setter?.image?.url ? {
                url: setter?.image?.url,
                provider: setter?.image?.provider,
                action: setter?.image?.action || 'UPDATE',
                id: setter?.image?.id,
            } : null,
        }
        let client = await api();
        const { data: output, errors } = await client.mutate({
            mutation: UPDATE_STORY_DETAILS,
            variables: vars,
            errorPolicy: 'all',
        });
        if (output?.updateStory?.story) {
            res = { ...res, data: output?.updateStory?.story, success: true };
        }

        res = { ...res, errors: errors || [] };
        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

const addStoryComment = async (storyKey, text, action, parentId, authorKey = null) => {
    let res = { data: null, success: false, errors: [] }

    if (!text || !action || !storyKey) return res;
    if (action === 'REPLY' && !parentId) return res;

    try {
        let client = await api();

        if (action === 'CREATE') {
            let { data, errors } = await client.mutate({
                mutation: ADD_STORY_COMMENT,
                variables: {
                    storyKey: storyKey,
                    text: text,
                    authorKey: authorKey
                }
            })
            if (data && data.createStoryComment?.comment) {
                let comment = await data.createStoryComment.comment;
                res.data = comment
                res.success = true
            }
            if (errors) {
                res.errors = errors
            }
            return res;
        } else if (action === 'REPLY') {
            let { data, errors } = await client.mutate({
                mutation: ADD_STORY_COMMENT,
                variables: {
                    storyKey: storyKey,
                    text: text,
                    parentId: parentId,
                    authorKey: authorKey
                }
            })
            if (data && data.createStoryComment?.comment) {
                let comment = await data.createStoryComment.comment;
                res.data = comment
                res.success = true
            }
            if (errors) {
                res.errors = errors
            }
            return res
        }
        throw new Error("Action is not allowed.")
    } catch (e) {
        res.errors = [...res.errors, { message: e?.message }]
        res.success = false
        return res;
    }

}

const updateStoryComment = async (commentId, text) => {
    let res = { data: null, success: false, errors: [] }

    if (!text || !commentId) return res;

    try {
        let client = await api();

        let { data, errors } = await client.mutate({
            mutation: UPDATE_STORY_COMMENT,
            variables: {
                commentId: commentId,
                text: text
            }
        })
        if (data && data.updateStoryComment?.comment) {
            let comment = await data.updateStoryComment.comment;
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

const updateStoryCommentVote = async (id) => {
    let res = { data: null, success: false, errors: [] }

    if (!id) return res;

    try {
        let client = await api();

        let { data, errors } = await client.mutate({
            mutation: VOTE_ON_STORY_COMMENT,
            variables: {
                id: id,
            }
        })
        if (data && data.voteOnStoryComment?.comment) {
            let comment = await data.voteOnStoryComment.comment;
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

const updateStoryClap = async (storyKey) => {
    let res = { data: null, success: false, errors: [] }

    try {
        let client = await api();

        let { data, errors } = await client.mutate({
            mutation: UPDATE_STORY_CLAP,
            variables: {
                storyKey: storyKey,
            }
        })
        if (data && data.clapOnStory?.story) {
            let story = await data.clapOnStory.story;
            res.data = story
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

const updateStorySaved = async (storyKey) => {
    let res = { data: null, success: false, errors: [] }

    try {
        let client = await api();

        let { data, errors } = await client.mutate({
            mutation: UPDATE_STORY_SAVED,
            variables: {
                storyKey: storyKey,
            }
        })
        if (data && data.saveStory?.story) {
            let story = await data.saveStory.story;
            res.data = story
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

export { addStoryComment as storyCommentAction };

export { updateStoryClap, updateStoryCommentVote, updateStoryComment, updateStorySaved };

export { updateStoryContent, updateStoryDetails, createStory }; // Story