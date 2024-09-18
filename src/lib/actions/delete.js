"use server";

import { prisma } from "../db";
import { deleteCloudinaryImage } from "./upload";

const deleteMicroPost = async (shortId) => {
    let res = { data: null, status: 500, errors: [] };
    if (!shortId) {
        res.errors.push({ message: 'No id provided' })
        return res
    }

    let post = await prisma.microPost.findUnique({
        where: {
            shortId: shortId,
        }
    })

    if (post) {
        switch (post.type) {
            case 'TEXT':
                break;
            case 'POLL':
                await prisma.vote.deleteMany({
                    where: {
                        poll: {
                            id: post.typeContent
                        }
                    }
                })
                await prisma.poll.delete({
                    where: {
                        id: post.typeContent
                    }
                })
                break;
            case 'IMAGE':
                let imagePost = await prisma.imagePost.findUnique({
                    where: {
                        id: post.typeContent
                    }
                })
                if (imagePost) {
                    try {
                        imagePost.list.forEach(async (image) => {
                            if (image.url) deleteCloudinaryImage(image.url);
                        });
                    } catch (e) {
                        console.log(e) // TODO: Log error
                    }
                    await prisma.imagePost.delete({
                        where: {
                            id: post.typeContent
                        }
                    })
                }
                break;
            default:
                break;
        }

        post = await prisma.microPost.delete({
            where: {
                shortId: shortId,
            }
        })

        res.data = post;
        res.status = 200;
        return res;
    }


}

export { deleteMicroPost };