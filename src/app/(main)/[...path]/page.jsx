import { AuthorSingleViewPage } from '@/components/author/view';
import { PostView } from '@/components/post/view';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCImageUrl } from '@/lib/helpers';
import { getCldOgImageUrl } from 'next-cloudinary';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params, searchParams }) {
    const route = params.path;
    const path = decodeURIComponent(params?.path[0]);
    const query = searchParams;

    if (path.startsWith('post') && route?.length === 2) {
        const meta = await articleMeta(route[1]);
        return meta;
    }
    else {
        const author = await getAuthor(path)
        if (author) {
            if (route?.length === 1) {
                return {
                    title: author.name,
                    description: author.bio,
                    openGraph: {
                        title: author.name,
                        description: author.bio,
                        siteName: process.env.APP_NAME,
                        images: [
                            {
                                url: author?.image?.url ? getCldOgImageUrl({ src: author?.image?.url }) : null,
                                width: 800,
                                height: 600,
                            },
                        ],
                        locale: 'en_US',
                        type: 'profile',
                    }
                }
            } else if (route?.length === 2) {
                return await articleMeta(route[1]);
            }
        }
    }
}

const DynamicPages = async ({ params, searchParams }) => {
    const session = await auth();
    const route = params.path;
    const path = decodeURIComponent(params?.path[0]);
    const query = searchParams;

    if (path.startsWith('post') && route?.length === 2) {
        const article = await getArticle(decodeURIComponent(route[1]))
        if (article) {
            return (
                <PostView article={article} />
            )
        }
    } else {
        const author = await getAuthor(path)
        if (author) {
            if (route?.length === 1) {
                return (
                    <span>This is Author Home Page</span>
                )
            } else if (route?.length === 2) {
                const article = await getArticle(decodeURIComponent(route[1]), author.id)
                if (article) {
                    return (
                        <PostView article={article} />
                    )
                }
            }
        }
        return notFound();
    }
};

const getArticle = async (slug, id) => {
    try {
        const post = await prisma.post.findFirst({
            where: {
                slug: slug,
                ...id && {
                    authorId: id,
                },
            },
            include: {
                author: true,
                _count: {
                    select: {
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
            }
        });
        if (post?.isDeleted && !post.published) return null;
        if (post?.author?.image?.url)
            post.author.image.url = await getCImageUrl(post?.author?.image?.url);
        return post
    } catch (error) {
        console.error(error);
        return null
    }
}

const getAuthor = async (handle) => {
    handle = await handle?.startsWith('@') ? handle.slice(1) : handle;

    try {
        let author = await prisma.author.findFirst({
            where: {
                handle: handle,
            },
            select: {
                handle: true,
                name: true,
                bio: true,
                social: true,
                image: true,
                banner: true,
                isDeleted: true,
                _count: {
                    select: {
                        followers: true,
                        Post: {
                            where: {
                                isDeleted: false,
                                published: true,
                                privacy: {
                                    equals: 'PUBLIC',
                                }
                            }
                        }
                    }
                }
            }
        })

        if (author && !author.isDeleted) {
            (author?.image?.provider === 'cloudinary' && author?.image?.url) && (author.image.url = await getCImageUrl(author.image.url));
            (author?.banner?.provider === 'cloudinary' && author?.banner?.url) && (author.banner.url = await getCImageUrl(author.banner.url));
            return author;
        }
    } catch (e) {
        return null;
    }
}

const articleMeta = async (slug) => {
    const article = await getArticle(decodeURIComponent(slug))
    const url = article?.image?.url ? getCldOgImageUrl({ src: article?.image?.url }) : null
    return {
        title: article?.title,
        description: article?.description,
        openGraph: {
            title: article?.title,
            description: article?.description,
            siteName: process.env.APP_NAME,
            ...url && {
                images: [
                    {
                        url,
                        width: 800,
                        height: 600,
                    },
                ]
            },
            locale: 'en_US',
            type: 'article',
            publishedTime: article?.publishedAt,
            authors: [article?.author?.name]
        }
    }
}

export default DynamicPages;