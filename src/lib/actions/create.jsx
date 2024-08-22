"use server";
import { nanoid } from "nanoid";
import { prisma } from "../db";

const createMicroPost = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    if (!data) {
        res.errors.push({ message: 'No data provided' })
        return res
    }
    let shortId = nanoid(25)
    try {
        const post = await prisma.microPost.create({
            data: {
                content: data?.title,
                type: data.type,
                author: {
                    connect: {
                        id: data.authorId
                    }
                },
                published: true,
                shortId: shortId
            }
        })
        console.log(post)
        res.data = post
        res.status = 200
    } catch (e) {
        console.log(e)
        res.errors.push({ message: JSON.stringify(e) })
    }
    return res;
}

export { createMicroPost }