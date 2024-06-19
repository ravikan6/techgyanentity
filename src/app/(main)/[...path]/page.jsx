import { ArticleWrapper } from '@/components/post/_client';
import { PostView } from '@/components/post/view';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCldOgImageUrl } from 'next-cloudinary';

export async function generateMetadata({ params, searchParams }) {
    const route = params.path;
    const path = params.path[0];
    const query = searchParams;
    if (route?.length === 1) {
        return {
            title: 'The Dynamic Page',
        }
    } else if (route?.length === 2) {
        const article = await getArticle(route[1], route[0])
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

    } else return { title: 'Page Not Found.' }

}

const getArticle = async (slug, handle) => {
    try {
        const author = await prisma.author.findUnique({
            where: {
                handle: handle  // 'raviblog'
            }
        });
        if (author) {
            const post = await prisma.post.findFirst({
                where: {
                    slug: slug,  // 'what-are-signals-in-tailwind-how-do-they-work-and-use-1cf97929f540'
                    authorId: author?.id  // Use author's ID
                },
                include: {
                    author: true  // Including the related author information
                }
            });
            return post
        }
        throw Error("No matching author found!")
    } catch (error) {
        console.error(error);
        return null
    }
}



const DynamicPages = async ({ params, searchParams }) => {
    const session = await auth();
    const route = params.path;
    const path = params.path[0];
    const query = searchParams;


    if (path && route?.length === 1) {
        const post = await prisma.post.findUnique({
            where: {
                slug: path,
            },
            include: {
                author: true,
            },
        });
        if (post)
            return (
                <ArticleWrapper>
                    <PostView article={post} />
                </ArticleWrapper>
            );
        else return <></>
    } else if (route?.length === 2) {
        const article = await getArticle(route[1], route[0])

        if (article)
            return (
                <ArticleWrapper>
                    <PostView article={article} />
                </ArticleWrapper>
            );
        else return <>Sorry, we lost in space. or maybe in blackhole. my signals are disconne........</>
    }

    return (
        <>
        </>
    )
};

export default DynamicPages;