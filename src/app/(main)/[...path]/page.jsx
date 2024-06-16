import { ArticleWrapper } from '@/components/post/_client';
import { PostView } from '@/components/post/view';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function generateMetadata({ params, searchParams }) {
    const route = params.path;
    const path = params.path[0];
    const query = searchParams;

    return (
        <>
        </>
    );
}


const DynamicPages = async ({ params, searchParams }) => {
    const session = await auth();
    const route = params.path;
    const path = params.path[0];
    const query = searchParams;


    if (path) {
        const post = await prisma.post.findUnique({
            where: {
                slug: path,
            },
            include: {
                author: true, // Include related author information
            },
        });
        if (post)
            return (
                <ArticleWrapper>
                    <PostView article={post} />
                </ArticleWrapper>
            );
        else return <>THe post Not Found </>
    }

    return (
        <>
        </>
    )
};

export default DynamicPages;