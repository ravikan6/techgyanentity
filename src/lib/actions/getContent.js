'use server';
import { prisma } from "../db";

const getMicoPosts = async () => {
    const posts = await prisma.microPost.findMany({
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    handle: true,
                    image: true,
                }
            },
            _count: {
                select: {
                    comments: {
                        where: {
                            parent: null,
                            isDeleted: false,
                        }
                    }
                }
            }
        }
    });
    for (let post of posts) {
        switch (post.type) {
            case 'TEXT':
                break;
            case 'IMAGE':
                let i = await prisma.imagePost.findUnique({
                    where: {
                        id: post.typeContent
                    }
                });
                post.typeContent = i;
                break;
            case 'LINK':
                break;
            case 'POLL':
                let p = await prisma.poll.findUnique({
                    where: {
                        id: post.typeContent
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
                post.content = p.question;

                let votes = p.votes;

                const voteCounts = votes.reduce((acc, vote) => {
                    acc[vote.option] = (acc[vote.option] || 0) + 1;
                    return acc;
                }, {});

                const votePercentages = Object.keys(voteCounts).reduce((acc, option) => {
                    acc[option] = (voteCounts[option] / p._count.votes) * 100;
                    return acc;
                }, {});

                post.typeContent = {
                    poll: p,
                    votes: voteCounts,
                    percentages: votePercentages
                };
                break;
            case 'ARTICLE':
                break;
            default:
                break;
        }
    }
    return posts;
}

const getMicroPost = async (shortId) => {
    try {
        const post = await prisma.microPost.findUnique({
            where: {
                shortId: shortId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        handle: true,
                        image: true,
                    }
                },
                _count: {
                    select: {
                        comments: {
                            where: {
                                parent: null,
                                isDeleted: false,
                            }
                        }
                    }
                }
            }
        });
        if (!post) return null;
        switch (post?.type) {
            case 'TEXT':
                break;
            case 'IMAGE':
                let i = await prisma.imagePost.findUnique({
                    where: {
                        id: post.typeContent
                    }
                });
                post.typeContent = i;
                break;
            case 'LINK':
                break;
            case 'POLL':
                let p = await prisma.poll.findUnique({
                    where: {
                        id: post.typeContent
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
                post.content = p.question;

                let votes = p.votes;

                const voteCounts = votes.reduce((acc, vote) => {
                    acc[vote.option] = (acc[vote.option] || 0) + 1;
                    return acc;
                }, {});

                const votePercentages = Object.keys(voteCounts).reduce((acc, option) => {
                    acc[option] = (voteCounts[option] / p._count.votes) * 100;
                    return acc;
                }, {});

                post.typeContent = {
                    poll: p,
                    votes: voteCounts,
                    percentages: votePercentages
                };
                break;
            case 'ARTICLE':
                break;
            default:
                break;
        }

        return post;
    } catch (e) {
        console.error(e);
        return null;
    }
}


export { getMicoPosts, getMicroPost };