'use server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadImage } from "./upload";
import { followAuthor } from "../resolver";
import { api, query } from "../client";
import { gql } from "@apollo/client";


const updateAuthorAction = async (obj) => {
    let res = { data: null, status: 500, errors: null };
    const session = await auth();;
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor($key: String!, $social: [SocialLinkInput], $name: String = "", $description: String = "", $contactEmail: String = "", $handle: String = "") {
      updateCreator(
        data: {
          contactEmail: $contactEmail
          description: $description
          handle: $handle
          name: $name
          social: $social
        }
        key: $key
      ) {
        creator {
          social {
            id
            name
            url
          }
          updatedAt
          name
          key
          handle
          description
          contactEmail
        }
      }
    }`;

    let social = (obj.data?.social || [])?.map((item, index) => ({
        id: item?.id || index + 1,
        name: item?.name,
        url: item?.url,
    }))

    try {
        let client = await api()
        let { data: author, errors } = await client.mutate({
            mutation: UPDATE_AUTHOR,
            variables: {
                key: obj.key,
                social: social,
                name: obj.data?.name,
                description: obj.data?.description,
                contactEmail: obj.data?.contactEmail || null,
                handle: obj.data.handle
            },
        });
        if (author?.updateCreator?.creator) {
            author = author?.updateCreator?.creator;
            res = { ...res, data: author, status: 200 };
        }
        if (errors) {
            res = { ...res, errors: errors };
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        res = { ...res, errors: [{ message: error.message }] };
    }
    return res;
}

const updateAuthorImagesAction = async (data, files, actions) => {
    try {
        let res = { data: null, status: 500, errors: [] };
        const session = await auth();
        if (!session || !session.user) {
            res = { ...res, errors: [{ message: 'Unauthorized' }] };
            return res;
        }

        let logo = files.get('logo')
        logo = logo == 'undefined' ? null : logo == 'null' ? null : logo;
        let banner = files.get('banner') ? files.get('banner') : null;
        banner = banner == 'undefined' ? null : banner == 'null' ? null : banner;

        let lgData = null;
        let bnData = null;
        let imageDeleted, bannerDeleted;

        const IMAGE_ACTION = gql`
        mutation CreatorImageAction($action: ImageActionEnum = CREATE, $provider: String = "", $url: String = "", $key: String = "", $id: String = "") {
          updateCreator(
            data: { image: { url: $url, provider: $provider, action: $action, id: $id } }
            key: $key
          ) {
            creator {
              image {
                id
                url
              }
              key
            }
          }
        }`;

        let client = await api();

        if (!!logo && actions?.image !== 'DELETE') {
            try {
                let logoData = await uploadImage(logo);
                if (logoData?.success) {
                    lgData = await cloudinaryProvider(logoData?.data);
                    let res = await client.mutate({
                        mutation: IMAGE_ACTION,
                        variables: {
                            action: actions?.image,
                            provider: lgData.provider,
                            url: lgData.url,
                            key: data?.key,
                            id: data?.media?.image?.id || null
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        lgData = res?.data?.updateCreator?.creator?.image;
                    } else {
                        throw new Error(res?.errors[0]?.message);
                    }
                } else {
                    throw new Error(logoData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading logo. Please try again later.' });
                lgData = null;
            }
        } else {
            if (data?.media?.image?.id && actions?.image === 'DELETE') {
                try {
                    let res = await client.mutate({
                        mutation: IMAGE_ACTION,
                        variables: {
                            action: 'DELETE',
                            id: data?.media?.image?.id,
                            url: data?.media?.image?.url,
                            provider: data?.media?.image?.provider || 'cloudinary'
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        lgData = null;
                        imageDeleted = true;
                    }
                } catch (error) {
                    lgData = null;
                    res.errors.push({ message: 'An error occurred while deleting logo. Please try again later.' });
                }
            }
        }

        const BANNER_ACTION = gql`
        mutation CreatorBannerAction($action: ImageActionEnum = CREATE, $provider: String = "", $url: String = "", $key: String = "", $id: String = "") {
          updateCreator(
            data: { banner: { url: $url, provider: $provider, action: $action, id: $id } }
            key: $key
          ) {
            creator {
              banner {
                id
                url
              }
              key
            }
          }
        }`;


        if (!!banner && actions?.banner !== 'DELETE') {
            try {
                let bannerData = await uploadImage(banner);
                if (bannerData?.success) {
                    bnData = await cloudinaryProvider(bannerData?.data);
                    let res = await client.mutate({
                        mutation: BANNER_ACTION,
                        variables: {
                            action: actions?.banner,
                            provider: bnData.provider,
                            url: bnData.url,
                            key: data?.key,
                            id: data?.media?.banner?.id || null
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        bnData = res?.data?.updateCreator?.creator?.banner;
                    }
                } else {
                    throw new Error(bannerData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading banner. Please try again later.' });
                bnData = null;
            }
        } else {
            if (data?.media?.banner?.id && actions?.banner === 'DELETE') {
                try {
                    let res = await client.mutate({
                        mutation: BANNER_ACTION,
                        variables: {
                            action: 'DELETE',
                            id: data?.media?.banner?.id,
                            url: data?.media?.banner?.url,
                            provider: data?.media?.banner?.provider || 'cloudinary',
                            key: data?.key
                        }
                    })
                    if (res?.data?.updateCreator?.creator) {
                        bnData = null;
                        bannerDeleted = true;
                    }
                } catch (error) {
                    bnData = null;
                    res.errors.push({ message: 'An error occurred while deleting banner. Please try again later.' });
                }
            }
        }

        let resdata = { image: lgData === undefined ? data?.media?.image : lgData, banner: bnData === undefined ? data?.media?.banner : bnData, imageDeleted, bannerDeleted };
        res = { ...res, data: resdata, status: 200 };
        return res;
    } catch (error) {
        res.errors.push({ message: 'An error occurred while updating images. Please try again later.' });
        return res;
    }
};

/**
 * @deprecated - Use new Api
 */
const followAuthorAction = async (authorId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let follow = await followAuthor(authorId);
    if (follow?.status) {
        res = { ...res, data: { status: true, id: follow?.id }, status: 200 };
    } else {
        res = { ...res, data: { status: false, id: null }, status: 200 };
    }
    return res;
}

/**
 * @deprecated - Use new Api
 */
const checkAuthorFollowAction = async (authorId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let follow = await prisma.follower.findFirst({
        where: {
            authorId: authorId,
            followerId: session.user.id,
        },
    });
    if (follow) {
        res = { ...res, data: { status: true, id: follow?.id }, status: 200 };
    } else {
        res = { ...res, data: { status: false, id: null }, status: 200 };
    }
    return res;
}

/**
 * @deprecated - Use new Api
 */
const articleCommentsListAction = async (articleId) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let comments = await prisma.comment.findMany({
            where: {
                postId: articleId,
                parent: null
            },
            include: {
                user: true,
                author: true,
                _count: {
                    select: { replies: true, claps: true },
                },
                claps: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                            }
                        },
                        comment: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        })

        res = { ...res, data: comments, status: 200 };
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const getArtcileComments = async (articleId, options = {}) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let comments = await prisma.comment.findMany({
            where: {
                postId: articleId,
                parent: null
            },
            include: {
                user: true,
                author: true,
                _count: {
                    select: { replies: true, claps: true },
                },
                claps: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                            }
                        },
                        comment: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: options.orderBy || 'desc'
            },
            take: options.take || 10,
            skip: options.cursor && options.cursor !== 'undefined' ? 1 : options.skip || 0,
            ...(options.cursor && {
                cursor: {
                    id: options.cursor,
                }
            }),
        })

        res = { ...res, data: comments, status: 200 };
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const articleCommentRepliesListAction = async (commentId, options) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let replies = await prisma.comment.findMany({
            where: {
                parentId: commentId
            },
            include: {
                user: true,
                author: true,
                _count: {
                    select: { replies: true, claps: true },
                },
                claps: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                            }
                        },
                        comment: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
        })
        res = { ...res, data: replies, status: 200 };
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const getArticleCommentReplies = async (commentId, options = {}) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let replies = await prisma.comment.findMany({
            where: {
                parentId: commentId
            },
            include: {
                user: true,
                author: true,
                _count: {
                    select: { replies: true, claps: true },
                },
                claps: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                            }
                        },
                        comment: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: options.orderBy || 'asc'
            },
            take: options.take || 10,
            skip: options.skip || 0,
        })
        res = { ...res, data: replies, status: 200 };
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const articleCommentAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    if (!data.body || data.body.trim() == '') {
        res.errors.push({ message: 'Comment body is required' });
        return res;
    }

    try {
        if (data?.id) {
            let comment = await prisma.comment.update({
                where: {
                    id: data.id
                },
                data: {
                    content: data.body
                },
            });
            res = { ...res, data: comment, status: 200 };
            return res;
        } else {
            let comment = await prisma.comment.create({
                data: {
                    content: data.body,
                    user: { connect: { id: session.user.id } },
                    post: { connect: { id: data.postId } },
                    ...(data.parentId && { parent: { connect: { id: data.parentId } } }),
                    ...(data.authorId && { author: { connect: { id: data.authorId } } })
                },
                include: {
                    user: true,
                    author: true,
                    _count: {
                        select: { replies: true, claps: true },
                    },
                    claps: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                }
                            },
                            comment: {
                                select: {
                                    id: true,
                                }
                            }
                        }
                    }
                }
            })
            res = { ...res, data: comment, status: 200 };
            return res;
        }
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const articleCommentClapAction = async (data, action) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user || !action) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        if (action == 'delete') {
            let clap = await prisma.commentClap.delete({
                where: {
                    id: data.id
                }
            });
            res = { ...res, data: clap, status: 200 };
            return res;
        } else if (action == 'create') {
            let clap = await prisma.commentClap.create({
                data: {
                    user: { connect: { id: session.user.id } },
                    comment: { connect: { id: data.id } }
                }
            })
            res = { ...res, data: clap, status: 200 };
            return res;
        }
        throw new Error('Invalid action');
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const articleCommentDeleteAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let comment = await prisma.comment.findUnique({
            where: {
                id: data.id
            },
            include: {
                user: true,
            }
        });
        if (!comment) {
            res.errors.push({ message: 'Comment not found' });
            return res;
        }
        if (comment.userId !== session.user.id) {
            res.errors.push({ message: 'Unauthorized' });
            return res;
        }
        await prisma.comment.deleteMany({
            where: {
                parentId: data.id
            }
        })
        let dt = await prisma.comment.delete({
            where: {
                id: data.id
            }
        });
        res = { ...res, data: dt, status: 200 };
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const articleClapsList = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let claps = await prisma.postClap.findMany({
            where: {
                postId: id
            },
        })
        res = { ...res, data: claps, status: 200 };
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const articleClapsAction = async (id, action) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user || !action) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        if (action == 'delete') {
            let clap = await prisma.postClap.delete({
                where: {
                    id: id
                }
            });
            res = { ...res, data: clap, status: 200 };
            return res;
        } else if (action == 'create') {
            let clap = await prisma.postClap.create({
                data: {
                    user: { connect: { id: session.user.id } },
                    post: { connect: { id: id } }
                }
            })
            res = { ...res, data: clap, status: 200 };
            return res;
        }
        throw new Error('Invalid action');
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const checkBookmarkAction = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let bookmark = await prisma.user.findFirst({
        where: {
            id: session.user.id,
            bookmarks: {
                some: {
                    shortId: id
                }
            }
        }
    });

    if (bookmark) {
        res = { ...res, data: { status: true }, status: 200 };
    } else {
        res = { ...res, data: { status: false }, status: 200 };
    }
    return res;
}

/**
 * @deprecated - Use new Api
 */
const bookmarkAction = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    let bookmark = await prisma.user.findFirst({
        where: {
            id: session.user.id,
            bookmarks: {
                some: {
                    shortId: id
                }
            }
        }
    });

    if (bookmark) {
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                bookmarks: {
                    disconnect: {
                        shortId: id
                    }
                }
            }
        });
        res = { ...res, data: { status: false }, status: 200 };
    } else {
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                bookmarks: {
                    connect: {
                        shortId: id
                    }
                }
            }
        });
        res = { ...res, data: { status: true }, status: 200 };
    }
    return res;
}

/**
 * @deprecated - Use new Api
 */
const isPostAuthor = async (postId, userId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let post = await prisma.post.findFirst({
            where: {
                id: postId,
                author: {
                    userId: userId || session.user.id
                }
            }
        });
        if (post) {
            res = { ...res, data: { status: true }, status: 200 };
        } else {
            res = { ...res, data: { status: false }, status: 200 };
        }
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

/**
 * @deprecated - Use new Api
 */
const getAuthorPosts = async (params) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let posts = await prisma.post.findMany({
            where: {
                author: {
                    handle: params.handle,
                },
                published: true,
                isDeleted: false,
                privacy: 'PUBLIC'
            },
            select: {
                title: true,
                slug: true,
                shortId: true,
                image: true,
                publishedAt: true,
                description: true,
                _count: {
                    select: {
                        claps: true,
                        comments: {
                            where: {
                                parent: null,
                                isDeleted: false,
                            }
                        }
                    }
                },
                tags: true,
            },
            orderBy: {
                createdAt: params.orderBy || 'desc'
            },
            take: params?.take || 12,
            skip: params?.skip || 0,
            ...(params?.cursor && {
                cursor: {
                    shortId: params.cursor,
                }
            }),
        });
        res.data = posts;
        res.status = 200;
    } catch (e) {
        res.errors.push({ message: JSON.stringify(e) });
    }
    return res;
}

/**
 * @deprecated - Use new Api
 */
const getAuthorForTip = async (params) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let author = await prisma.author.findFirst({
            where: {
                shortId: params.shortId,
            },
            select: {
                id: true,
                name: true,
                handle: true,
                shortId: true,
                image: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        Post: true,
                    }
                }
            }
        });
        res.data = author;
        res.status = 200;
        return res;
    } catch (e) {
        res.errors.push({ message: JSON.stringify(e) });
        return res;
    }
}

export const cloudinaryProvider = async (data) => {
    let provider = 'cloudinary';
    return { provider, url: await data.public_id }
}

export { followAuthorAction, checkAuthorFollowAction, articleCommentsListAction, articleCommentAction, articleCommentRepliesListAction, articleCommentClapAction, articleCommentDeleteAction, articleClapsList, articleClapsAction, checkBookmarkAction, bookmarkAction, isPostAuthor, getAuthorPosts, getAuthorForTip }

export { getArticleCommentReplies, getArtcileComments };

export { updateAuthorAction, updateAuthorImagesAction };