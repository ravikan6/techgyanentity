"use server";
import { auth } from "./auth";
import { prisma } from "./db";

const followAuthor = async (authorId) => {
    const session = await auth();
    try {
        if (!session && !session?.user && !session?.user?.id && !authorId) return throwError("Unauthorized or Invalid Request");

        const isFollowing = await prisma.follower.findFirst({
            where: {
                authorId: authorId,
                followerId: session.user.id,
            },
        });

        if (isFollowing) {
            await prisma.follower.delete({
                where: {
                    id: isFollowing.id,
                },
            });
            return { status: "unfollowed" };
        } else {
            await prisma.follower.create({
                data: {
                    author: { connect: { id: authorId } },
                    follower: { connect: { id: session.user.id } },
                },
            });
            return { status: "followed" };
        }
    } catch (error) {
        return { status: "error" };
    }
}

export { followAuthor };











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