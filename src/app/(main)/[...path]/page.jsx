import { AuthorSingleViewPage } from '@/components/author/view';
import { PostView } from '@/components/post/view';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCImageUrl } from '@/lib/helpers';
import { Skeleton } from '@mui/material';
import { getCldOgImageUrl } from 'next-cloudinary';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params, searchParams }) {
    const route = params.path;
    const path = decodeURIComponent(params?.path[0]);
    const query = searchParams;


    if (path.startsWith('post') && route?.length === 2) {
        const article = await getArticle(decodeURIComponent(route[1]))
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
    else if (path?.startsWith('@')) {
        if (route?.length === 1) {
            return { title: 'Author' }
        }

    } else if (route?.length === 2) {
        const article = await getArticle(decodeURIComponent(route[1]), path)
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
    else return { title: 'Page Not Found.' }

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
    }
    else if (path?.startsWith('@')) {
        if (route?.length === 1) {
            const author = await getAuthor(path.slice(1))
            return <AuthorSingleViewPage author={author} />
        }

    } else if (route?.length === 2) {
        const article = await getArticle(decodeURIComponent(route[1]), path)
        if (article) {
            return (
                <PostView article={article} />
            )
        }
        else return notFound();
    }
    return (
        <>
        </>
    )
};

const FallBackPOst = () => {
    return (
        <>
            <div className="mx-auto max-w-xl">
                <Skeleton animation="wave" variant="rounded" width={'100%'} height={300} />
                <Skeleton animation="wave" variant="text" width={'100%'} className="!mt-10" height={40} />
                <div className="flex items-center justify-between mt-10">
                    <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                    <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                    <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                    <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                </div>
            </div>
        </>
    )
}

const getArticle = async (slug, handle) => {
    let reHandle;
    if (handle) {
        if (handle.startsWith('@')) {
            reHandle = handle.slice(1)
        } else reHandle = handle;
    }
    try {
        const post = await prisma.post.findFirst({
            where: {
                slug: slug,
                ...reHandle && {
                    author: {
                        handle: reHandle,
                    }
                },
                isDeleted: false
            },
            include: {
                author: true,
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });
        if (post?.author?.image?.url)
            post.author.image.url = await getCImageUrl(post?.author?.image?.url);
        return post
    } catch (error) {
        console.error(error);
        return null
    }
}

const getAuthor = async (handle) => {
    try {
        let author = await prisma.author.findUnique({
            where: {
                handle: handle,
                isDeleted: false,
            },
            select: {
                handle: true,
                name: true,
                bio: true,
                social: true,
                image: true,
                banner: true,
            }
        })
        if (author) {
            (author?.image?.provider === 'cloudinary' && author?.image?.url) && (author.image.url = await getCImageUrl(author.image.url));
            (author?.banner?.provider === 'cloudinary' && author?.banner?.url) && (author.banner.url = await getCImageUrl(author.banner.url));
        }
        return author;
    } catch (e) {
        console.log(e, '_________________errror_while_fetching_author')
        return null;
    }
}

export default DynamicPages;