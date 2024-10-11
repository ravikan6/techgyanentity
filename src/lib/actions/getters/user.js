"use server";

import { query } from "@/lib/client";
import { GET_USER_CLAPPED_STORIES } from "@/lib/types/user";

/**
 * Fetches the stories clapped by the user.
 *
 * @async
 * @function getUserClappedStories
 * @param {Object} params - The parameters for the query.
 * @param {string} params.after - The cursor for pagination.
 * @param {number} params.limit - The number of stories to fetch.
 */
const getUserClappedStories = async ({ after, limit }) => {
    let res = { success: false, data: null, errors: [] };
    try {
        let { data, errors } = await query({
            query: GET_USER_CLAPPED_STORIES,
        })

        if (await data) {
            res.data = await data?.MySavedStories?.edges;
            res.success = true;
        }

        if (errors) {
            res.errors = errors;
        }
    } catch (error) {
        console.error(error);
        res.errors.push({ message: error.message });
    }
    return res;
};

export { getUserClappedStories };