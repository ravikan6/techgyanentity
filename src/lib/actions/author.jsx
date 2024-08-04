'use server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteCloudinaryImage, uploadImage } from "./upload";
import { getCImageUrl } from "../helpers";
import { followAuthor } from "../resolver";


const updateAuthorAction = async (obj) => {
    let res = { data: null, status: 500, errors: null };
    const session = await auth();;
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let author = await prisma.author.update({
            where: { id: obj.id },
            data: {
                ...obj.data,
            },
        });

        author.image = author?.image?.url ? await getCImageUrl(author?.image?.url) : null;
        author.banner = author?.banner?.url ? await getCImageUrl(author?.banner?.url) : null;

        res = { ...res, data: author }
    } catch (error) {
        res = { ...res, errors: [{ message: error.message }] };
    }
    return res;
}

const updateAuthorImagesAction = async (data, files) => {
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
        let rmLogo = files.get('rmLogo') ? files.get('rmLogo') : 'false';
        let rmBanner = files.get('rmBanner') ? files.get('rmBanner') : 'false';

        let lgData = null;
        let bnData = null;

        let author = await prisma.author.findUnique({
            where: { id: data?.id },
            select: { id: true, image: true, banner: true }
        });

        if (!!logo && (rmLogo == 'false')) {
            try {
                let logoData = await uploadImage(logo);
                if (logoData?.success) {
                    lgData = await cloudinaryProvider(logoData?.data);
                    if (author?.image?.url) {
                        let rmData = await deleteCloudinaryImage(author?.image?.url);
                        if (!rmData?.success) {
                            throw new Error(rmData?.message);
                        }
                    }
                } else {
                    throw new Error(logoData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading logo. Please try again later.' });
                lgData = null;
            }
        } else {
            if (author?.image?.url && rmLogo == 'true') {
                try {
                    let logoData = await deleteCloudinaryImage(author?.image?.url);
                    if (logoData?.success) {
                        lgData = 'rm';
                    } else {
                        throw new Error(logoData?.message);
                    }
                } catch (error) {
                    console.log({ message: 'An error occurred while deleting logo. Please try again later.' });
                    lgData = null;
                }
            }
        }

        if (!!banner && (rmBanner == 'false')) {
            try {
                let bannerData = await uploadImage(banner);
                if (bannerData?.success) {
                    bnData = await cloudinaryProvider(bannerData?.data);
                    if (author?.banner?.url) {
                        let rmData = await deleteCloudinaryImage(author?.banner?.url);
                        if (!rmData?.success) {
                            throw new Error(rmData?.message);
                        }
                    }
                } else {
                    throw new Error(bannerData?.message);
                }
            } catch (error) {
                res.errors.push({ message: 'An error occurred while uploading banner. Please try again later.' });
                bnData = null;
            }
        } else {
            if (author?.banner?.url && rmBanner == 'true') {
                try {
                    let bannerData = await deleteCloudinaryImage(author?.banner?.url);
                    if (bannerData?.success) {
                        bnData = 'rm';
                    } else {
                        throw new Error(bannerData?.message);
                    }
                } catch (error) {
                    bnData = null;
                    console.log({ message: 'An error occurred while deleting banner. Please try again later.' });
                }
            }
        }

        if (lgData || bnData) {
            let author = await prisma.author.update({
                where: { id: data?.id },
                data: {
                    ...lgData ? (lgData == 'rm' ? { image: null } : { image: { set: lgData } }) : null,
                    ...bnData ? (bnData == 'rm' ? { banner: null } : { banner: { set: bnData } }) : null,
                }
            });

            author.logo = author?.image?.url ? await getCImageUrl(author?.image?.url, { quality: 100 }) : null;
            author.banner = author?.banner?.url ? await getCImageUrl(author?.banner?.url, { quality: 100 }) : null;
            res = { ...res, data: author, status: 200 };
        }
        return res;
    } catch (error) {
        res.errors.push({ message: 'An error occurred while updating images. Please try again later.' });
        return res;
    }
};

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
                    ...data.parentId && { parent: { connect: { id: data.parentId } } },
                    ...data.authorId && { author: { connect: { id: data.authorId } } }
                },
                include: {
                    user: true,
                    author: true,
                    _count: {
                        select: {
                            replies: true,
                            claps: true
                        }
                    },
                    parent: {
                        include: {
                            _count: {
                                select: {
                                    replies: true,
                                    claps: true
                                }
                            },
                            user: true,
                            author: true,
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
                    comment: { connect: { id: data.commentId } }
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
            orderBy: {
                createdAt: params.orderBy || 'desc'
            },
            take: params?.take || 12,
            skip: params?.skip || 0,
            ...params?.cursor && {
                cursor: {
                    shortId: params.cursor,
                }
            },
        });
        res.data = posts;
        res.status = 200;
    } catch (e) {
        res.errors.push({ message: JSON.stringify(e) });
    }
    return res;
}

export const cloudinaryProvider = async (data) => {
    let provider = 'cloudinary';
    return { provider, url: await data.public_id }
}

export { updateAuthorAction, updateAuthorImagesAction, followAuthorAction, checkAuthorFollowAction, articleCommentsListAction, articleCommentAction, articleCommentRepliesListAction, articleCommentClapAction, articleCommentDeleteAction, articleClapsList, articleClapsAction, checkBookmarkAction, bookmarkAction, isPostAuthor, getAuthorPosts }