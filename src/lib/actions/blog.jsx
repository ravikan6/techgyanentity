"use server";
import { prisma } from '@/lib/db';

export const getBlogs = async () => {

    const dt = await prisma.post.create({
        data: {
            slug: 'the-blog-post',
            title: "Blog Post 1",
            body: "This is the content of Blog Post 1"
        }})

    return dt;
};