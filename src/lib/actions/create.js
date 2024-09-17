"use server";
import { nanoid } from "nanoid";
import { prisma } from "../db";
import { auth } from "../auth";
import { uploadImage } from "./upload";

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
                if (!data.content?.images) {
                    res.errors.push({ message: 'No image provided' })
                    return res
                }
                let images = data.content.images.map((i, index) => {
                    let file = i.file?.has("data") ? i.file.get("data") : i.file;
                    console.log(file)
                    console.log(i, typeof i.file)
                    if (!file) {
                        res.errors.push({ message: `No file provided for image ${index + 1}` })
                        return res
                    }
                    return {
                        file: file,
                        caption: i.caption,
                        location: i.location,
                    }
                });

                let newImages = await Promise.all(images.map(async (i) => {
                    let url = await uploadImage(i.file, 'TechGyan');
                    console.log(url)
                    return {
                        url: url.data.public_id,
                        caption: i.caption,
                        location: i.location,
                    }
                }));

                let postImage = await prisma.imagePost.create({
                    data: {
                        list: newImages,
                    }
                })
                objectId = postImage.id
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

    if (data.type !== 'TEXT' && !objectId) {
        return res
    }

    try {
        const post = await prisma.microPost.create({
            data: {
                content: data?.content?.title,
                type: data.type,
                author: {
                    connect: {
                        id: data.authorId
                    }
                },
                published: true,
                shortId: shortId,
                ...(objectId && { typeContent: objectId })
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


const pollAnsSubmit = async (pollId, option) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();

    if (!session || !pollId || (option == null || option == undefined)) return res;

    const userVotes = await prisma.vote.findMany({
        where: {
            pollId: pollId,
            userId: session.user.id,
        },
        select: {
            id: true,
            option: true,
        }
    })

    if (userVotes.length > 1) {
        await prisma.vote.deleteMany({
            where: {
                poll: { id: pollId },
                userId: session.user.id,
            }
        });
    } else if (userVotes.length == 1) {
        if (userVotes[0].option == option) {
            await prisma.vote.delete({
                where: {
                    id: userVotes[0].id
                }
            });
        } else {
            await prisma.vote.update({
                where: {
                    id: userVotes[0].id
                },
                data: {
                    option: option
                }
            });
        }
    } else {
        await prisma.vote.create({
            data: {
                poll: {
                    connect: {
                        id: pollId,
                    }
                },
                option: option,
                userId: session.user.id,
            }
        });
    }


    let p = await prisma.poll.findUnique({
        where: {
            id: pollId
        },
        include: {
            votes: true,
            _count: {
                select: {
                    votes: true
                }
            },
        },
    });

    let votes = p.votes;

    const voteCounts = votes.reduce((acc, vote) => {
        acc[vote.option] = (acc[vote.option] || 0) + 1;
        return acc;
    }, {});

    const votePercentages = Object.keys(voteCounts).reduce((acc, option) => {
        acc[option] = (voteCounts[option] / p._count.votes) * 100;
        return acc;
    }, {});

    res.status = 200
    res.data = {
        poll: p,
        votes: voteCounts,
        percentages: votePercentages
    };

    return res;
}

export { createMicroPost, pollAnsSubmit }