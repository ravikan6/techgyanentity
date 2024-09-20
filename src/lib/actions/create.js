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
                    return {
                        url: url.data.public_id,
                        caption: i?.caption,
                        location: i?.location,
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
                // for next version
                break;
            } case "ARTICLE": {
                if (!data.content?.article) {
                    res.errors.push({ message: 'No article provided' })
                    return res
                }
                // for next version
                break;
            } default: {
                if (!data.content?.title) {
                    res.errors.push({ message: 'No title provided' })
                    return res
                }
            }
        }
    } catch (e) {
        res.errors.push({ message: 'Something went wrong' })
        return res
    }

    if (data.type !== 'TEXT' && !objectId) {
        res.errors.push({ message: 'Something went wrong' })
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
        res.errors.push({ message: 'An error occurred' })
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


const getPostComments = async (postId, options = {}) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let comments = await prisma.microPostComment.findMany({
            where: {
                postId: postId,
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


const getPostCommentReplies = async (commentId, options = {}) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let replies = await prisma.microPostComment.findMany({
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

const postCommentAction = async (data) => {
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
            let comment = await prisma.microPostComment.update({
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
            let comment = await prisma.microPostComment.create({
                data: {
                    content: data.body,
                    user: { connect: { id: session.user.id } },
                    post: { connect: { shortId: data.postId } },
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

const postCommentClapAction = async (data, action) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user || !action) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        if (action == 'delete') {
            let clap = await prisma.microPostCommentClap.delete({
                where: {
                    id: data.id
                }
            });
            res = { ...res, data: clap, status: 200 };
            return res;
        } else if (action == 'create') {
            let clap = await prisma.microPostCommentClap.create({
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

const postCommentDeleteAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let comment = await prisma.microPostComment.findUnique({
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
        await prisma.microPostComment.deleteMany({
            where: {
                parentId: data.id
            }
        })
        let dt = await prisma.microPostComment.delete({
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


export { createMicroPost, pollAnsSubmit }

export { getPostComments, getPostCommentReplies, postCommentAction, postCommentClapAction, postCommentDeleteAction }