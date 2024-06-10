// import QueryString from "qs";

function get_Article_url_by_id(id) {
    return `/view?s=${id}`
}
function genrate_Article_url(id, slug) {
    return `/view?s=${id}`
}

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
function media_URL_v2 (url) {
    if (typeof url !== 'string' || url == null) {
        return null;
    }
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    return `${process.env.MEDIA_URL}/${url}`;
}

function image_URL_v2 (url, query = null) {
    if (typeof url !== 'string' || url == null) {
        return 'o';
    }
    // if (url?.startsWith('http') || url?.startsWith('//')) {
    //     return `${url}?${QueryString.stringify(query)}`;
    // }
    // if (query != null) {
    //     return `${process.env.IMAGE_URL}/${url}?${QueryString.stringify(query)}`;
    // }
    return `${process.env.IMAGE_URL}/${url}`;
}

export { get_Article_url_by_id, get_Article_image, genrate_Article_url, media_URL_v2, image_URL_v2  };