"use server";
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { generateUniqueId } from '../helpers';
import { deleteCloudinaryImage, uploadImage } from './upload';
import { cloudinaryProvider } from './author';

export const getBlogs = async () => {

    // const dt = await prisma.post.create({
    //     data: {
    //         slug: 'the-blog-post',
    //         title: "Blog Post 1",
    //         body: "This is the content of Blog Post 1"
    //     }})

    return {};
};

export const createPostAction = async (data) => {
    const session = await auth();
    const author = await prisma.author.findFirst({
        where: {
            userId: session.user.id,
        },
    });
    const tags = data.tags ? data.tags.split(',') : [];
    try {
        const newPost = await prisma.post.create({
            data: {
                slug: data.slug,
                title: data.title,
                content: data.content,
                authorId: author.id,
                published: data.published,
                privacy: data.privacy,
                tags: tags,
                image: {
                    set: {
                        url: data.imageUrl,
                        alt: data.imageAlt,
                    },
                },
            },
        });
        console.log(newPost)
        return newPost;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }

}

export const handleCreatePostRedirectAction = async (authorId) => {
    const session = await auth();
    if (!session.user) {
        redirect('/auth/v2/signin');
    }
    if (!authorId) {
        redirect('/setup/author');
    }
    try {
        if (session?.user?.Author?.find((a) => a.id === authorId)) {
            let sId = generateUniqueId(12);
            const p = await prisma.post.create({
                data: {
                    title: 'Untitled',
                    author: {
                        connect: {
                            id: authorId,
                        },
                    },
                    slug: `post-${sId}`,
                    published: false,
                    content: [],
                    shortId: sId,
                }
            });
            if (p.shortId)
                return { status: 200, url: `/${process.env.STUDIO_URL_PREFIX}/p/${p.shortId}/editor` };
            else throw new Error('An error occurred while creating the post. Please try again later.');
        } else {
            throw new Error('Unauthorized');
        }
    } catch (error) {
        console.error("Error creating post:", error);
        return { status: 500, message: error.message };
    }
}

export const updatePostAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        const updatedPost = await prisma.post.update({
            where: {
                shortId: data.id,
                isDeleted: false,
            },
            data: {
                title: data.title,
                content: data.content,
            },
            select: {
                title: true,
                content: true,
            }
        });
        res = { ...res, data: updatedPost, status: 200 };
        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

export const updatePostDetailsAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let setter = { ...data?.data };
    let file = data?.file ? data?.file : new FormData();
    let cat = setter?.category;
    delete setter.category;
    if (setter?.doPublish) {
        setter.publishedAt = new Date();
        setter.published = true;
        delete setter.doPublish;
    }

    if (file.has('image') && setter?.image?.provider === 'file') {
        let image = file.get('image')
        try {
            let ftImage = await uploadImage(image);
            if (ftImage.success) {
                ftImage = await cloudinaryProvider(ftImage?.data);
                setter.image = { ...data?.data?.image, ...ftImage }
                if (data?.data?.image?.url) {
                    let rmImg = await deleteCloudinaryImage(data?.data?.image?.url);
                    if (!rmImg?.success) {
                        throw new Error(rmImg?.message);
                    }
                }
            } else {
                throw new Error(ftImage?.message);
            }
        } catch (error) {
            res.errors.push({ message: 'An error occurred while uploading post Image. Please try again later.' });
            setter?.image?.url && delete setter.image.url;
            setter?.image?.provider && delete setter.image.provider;
        }
    }

    try {
        const updatedPost = await prisma.post.update({
            where: {
                shortId: data.id,
                isDeleted: false,
            },
            data: {
                ...setter,
                ...cat?.slug && {
                    category: {
                        connect: {
                            slug: cat?.slug,
                        }
                    }
                }
            },
            select: {
                id: false,
                content: false,
                slug: true,
                shortId: true,
                title: true,
                description: true,
                published: true,
                privacy: true,
                publishedAt: true,
                createdAt: false,
                updatedAt: true,
                deletedAt: true,
                isDeleted: true,
                tags: true,
                image: true,
                category: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            },
        });
        res = { ...res, data: updatedPost, status: 200 };
        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

export const deletePostAction = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    try {
        const deletedPost = await prisma.post.update({
            where: {
                shortId: id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
        res = { ...res, data: deletedPost.isDeleted, status: 200 };
        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

export const getDrafts = async (authorId) => {
    const session = await auth();

    const drafts = await prisma.post.findMany({
        where: {
            authorId: authorId,
            published: false,
        },
    });
    return drafts;
}

const getAuthorPosts = async (authorId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let posts = await prisma.post.findMany({
            where: {
                authorId: authorId,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: false,
                title: true,
                description: true,
                shortId: true,
                slug: true,
                image: {
                    select: {
                        url: true,
                        alt: true,
                    }
                },
                published: true,
                privacy: true,
                publishedAt: true,
                createdAt: true,
                _count: {
                    select: {
                        claps: true,
                        comments: {
                            where: {
                                parent: {
                                    is: null,
                                },
                                isDeleted: false,
                            }
                        }
                    }
                }
            },

        });
        if (posts) {
            res = { ...res, data: posts, status: 200 };
        }
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

const getArticleContent = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let content = await prisma.post.findUnique({
            where: {
                shortId: id,
            },
            select: {
                content: true,
            },
        });
        if (content) {
            res = { ...res, data: content.content, status: 200 };
        }
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

const getArticledetails = async (id, authorId, alsoCat) => {
    let res = { data: null, status: 500, errors: [], categories: [] };
    try {
        const dt = await prisma.post.findFirst({
            where: {
                shortId: id,
                authorId: authorId,
            },
            select: {
                id: false,
                content: false,
                slug: true,
                shortId: true,
                title: true,
                description: true,
                published: true,
                privacy: true,
                publishedAt: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                isDeleted: true,
                tags: true,
                image: true,
                category: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            },
        });

        if (dt && !dt.isDeleted) {
            if (alsoCat) {
                const cats = await prisma.category.findMany({
                    select: {
                        name: true,
                        slug: true,
                    }
                });
                res = { ...res, categories: cats };
            }
            res = { ...res, data: dt, status: 200 };
        }
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

export { getAuthorPosts, getArticleContent, getArticledetails }