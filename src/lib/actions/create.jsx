"use server";
import { prisma } from "../db";

const createMicroPost = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    if (!data) {
        res.errors.push({ message: 'No data provided' })
        return res
    }
    try {
        const post = await prisma.microPost.create({
            data: {
                title: data?.title,
                type: data.type,
                author: {
                    connect: {
                        id: data.authorId
                    }
                },
                published: true,
            }
        })

        res.data = post
        res.status = 200
    } catch (e) {
        res.errors.push({ message: JSON.stringify(e) })
    }
    return res;
}

export { createMicroPost }