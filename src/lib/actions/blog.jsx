"use server";
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { generateUniqueId } from '../helpers';

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
        if (p.id)
            redirect(`/${process.env.STUDIO_URL_PREFIX}/p/${p.id}/edit`);
    } catch (error) {
        console.error("Error creating post:", error);
        redirect('/');
    }
}

export const updatePostAction = async (data) => {
    const session = await auth();

    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                content: data.content,
            },
        });
        return updatedPost;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
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