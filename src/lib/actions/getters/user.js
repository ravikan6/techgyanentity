"use server";

import { GET_USER_CLAPPED_STORIES } from "@/lib/types/user";

/**
 * Fetches the stories clapped by the user.
 *
 * @async
 * @function getUserClappedStories
 * @param {Object} params - The parameters for the query.
 * @param {string} params.after - The cursor for pagination.
 * @param {number} params.limit - The number of stories to fetch.
 * @returns {Promise<Object>} The result object containing success status, data, and errors.
 */
const getUserClappedStories = async ({ after, limit }) => {
    let res = { success: false, data: null, errors: [] };
    try {
        let { data, errors } = await query({
            query: GET_USER_CLAPPED_STORIES,
            variables: {
                after: after,
                limit: limit
            }
        })

        if (data) {
            res.data = data?.Me?.storyClaps;
            res.success = true;
        }

        if (errors) {
            res.errors = errors;
        }
    } catch (error) {
        console.error(error);
        res.errors.push({ message: error.message });
    }
};

export { getUserClappedStories };