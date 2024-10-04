"use server";
const { query } = require("@/lib/client")
const { GET_POST_BY_KEY } = require("@/lib/types/post")

const getPostBykey = async (keyId) => {
    let res = { success: false, data: null, error: null }

    try {
        let post = await query({
            query: GET_POST_BY_KEY,
            variables: {
                key: keyId
            }
        })

        if (post?.data && post.data.Posts.edges?.at(0)) {
            res.success = true
            res.data = post.data.Posts.edges.at(0).node
        }
        if (post?.error) res.error = post.error;
        return res;
    } catch (e) {
        res.error = e.message || 'Something went wrong!'
        return res
    }
}

export { getPostBykey };