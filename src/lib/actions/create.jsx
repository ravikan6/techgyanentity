"use server";
import { nanoid } from "nanoid";
import { prisma } from "../db";

const createMicroPost = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    if (!data) {
        res.errors.push({ message: 'No data provided' })
        return res
    }
    let objectId, shortId = nanoid(25)

    try {
        switch (data.type) {
            case "IMAGE": {
                if (!data.content?.image) {
                    res.errors.push({ message: 'No image provided' })
                    return res
                }
                break;
            } case "POLL": {
                if (!data.content?.options) {
                    res.errors.push({ message: 'No options provided' })
                    return res
                }
                let options = data.content.options.map((o, i) => {
                    return {
                        id: i,
                        text: o
                    }
                })
                const poll = await prisma.poll.create({
                    data: {
                        question: data.content.title,
                        options: options,
                    }
                })
                objectId = poll.id
                break;
            } case "LINK": {
                if (!data.content?.link) {
                    res.errors.push({ message: 'No link provided' })
                    return res
                }
                break;
            } case "ARTICLE": {
                if (!data.content?.article) {
                    res.errors.push({ message: 'No article provided' })
                    return res
                }
                break;
            } default: {
                if (!data.content?.title) {
                    res.errors.push({ message: 'No title provided' })
                    return res
                }
            }
        }
    } catch (e) {
        console.log(e)
        res.errors.push({ message: JSON.stringify(e) })
        return res
    }

    try {
        const post = await prisma.microPost.create({
            data: {
                ...(data.type == 'TEXT') && { content: data?.title },
                type: data.type,
                author: {
                    connect: {
                        id: data.authorId
                    }
                },
                published: true,
                shortId: shortId,
                ...(objectId) && { typeContent: objectId }
            }
        })
        res.data = post
        res.status = 200
    } catch (e) {
        console.log(e)
        res.errors.push({ message: JSON.stringify(e) })
    }
    return res;
}

export { createMicroPost }