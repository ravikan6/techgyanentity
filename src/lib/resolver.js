"use server";
import { auth } from "./auth";

const followAuthor = async (authorId) => {
    const session = await auth();
    try {
        return { status: true, id: null };
    } catch (error) {
        return { status: null, error: error, message: "An error occurred while following author. Please try again later." };
    }
}

async function apiGql(query, headers = {}) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://techgyan.collegejaankaar.in/api/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({ query }),
        });

        let res = { status: response.status, data: null, errors: null };
        const data = await response.json();
        if (data?.data) {
            apiGql
            res = { ...res, data: data.data };
        }
        if (data?.errors) {
            res = { ...res, errors: [...data.errors] };
        }
        return res;
    } catch (error) {
        console.error(`Something went Wrong (RK-HACKER)=> `, error);
        return {
            status: 500,
            data: null,
            errors: [{ message: 'Something went wrong. Please try again.' }]
        };
    };
};

export { followAuthor, apiGql };











function get_Article_image(data) {
    const image_data = { sizes: {} }
    if (data?.image) {
        const url = data.image;
        if (url.startsWith('http') || url.startsWith('//')) {
            image_data["main_url"] = url
        } else {
            image_data["main_url"] = `${process.env.MEDIA_URL}/${url}`
        }
    }
    if (data?.formates) {
        const formates = JSON.parse(JSON.parse(data.formates))
        for (let key in formates) {
            if (formates[key].startsWith('http') || formates[key].startsWith('//')) {
                image_data.sizes[key] = formates[key]
            } else {
                image_data.sizes[key] = `${process.env.MEDIA_URL}/${formates[key]}`
            }
        }
    }
    if (data?.alt) {
        image_data["alt"] = data.alt
    }
    if (data?.caption) {
        image_data["caption"] = data.caption
    }
    if (data?.id) {
        image_data["id"] = data.id
    }
    if (data?.uuid) {
        image_data["uuid"] = data.uuid
    }

    return image_data
}

/**
 * Returns the media URL.
 * @param {string} url - The URL of the media.
 * @returns {string|null} - The media URL or null if the URL is invalid.
 */
function media_URL_v2(url) {
    if (typeof url !== 'string' || url == null) {
        return null;
    }
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    return `${process.env.MEDIA_URL}/${url}`;
}

function image_URL_v2(url, query = null) {
    if (typeof url !== 'string' || url == null) {
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYThRPnGjAvcFS19x-5vXINgIe3g2aP4Cp5A&s';
    }
    // if (url?.startsWith('http') || url?.startsWith('//')) {
    //     return `${url}?${QueryString.stringify(query)}`;
    // }
    // if (query != null) {
    //     return `${process.env.IMAGE_URL}/${url}?${QueryString.stringify(query)}`;
    // }
    return `${process.env.IMAGE_URL}/${url}`;
}

export { get_Article_image, media_URL_v2, image_URL_v2 };