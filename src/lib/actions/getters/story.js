"use server";

import { query } from "@/lib/client";
import { GET_STORY_WITH_CATEGORIES } from "@/lib/types/story";

const getStoryDetailsForEdit = async (key, authorKey, options) => {
    let res = { data: null, success: false, errors: [], categories: [] };

    try {
        let article = await query({
            query: GET_STORY_WITH_CATEGORIES,
            variables: {
                key: key,
                author_Key: authorKey
            }
        });
        if (article?.data?.Stories?.edges[0]?.node) {
            res = { ...res, data: article?.data?.Stories?.edges[0]?.node, success: true };
            if (options?.include?.cat && article?.data?.Categories) {
                res = { ...res, categories: article?.data?.Categories };
            }
            return res;
        } else {
            throw new Error('Post not found');
        }
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

export { getStoryDetailsForEdit };