import { StudioWriteEditorWrapper, StudioWriteLayoutWrapper } from "@/components/studio/wrappers";
import { WriteHeader } from "@/components/studio/write/_header_focus";
import { DecryptAuthorIdStudioCookie } from "@/lib/actions/studio";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCImageUrl } from "@/lib/helpers";
import { redirect } from 'next/navigation';

const WriteLayout = async ({ children, params }) => {
    const { path } = params;

    if (path?.length === 2) {
        const author = DecryptAuthorIdStudioCookie();
        if (!author) {
            redirect('/studio/content')
        }

        const article = await getArticle(path[0], author.id);

        if (!article) {
            redirect('/studio/content')
        }

        return (
            <StudioWriteLayoutWrapper article={article} >
                {path[1] === 'editor' ? <StudioWriteEditorWrapper> <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[1000] bg-light dark:bg-dark">
                    <WriteHeader />
                    <div className="w-full h-full overflow-y-auto">
                        <div className="max-w-[640px] w-full px-2 sm:px-0 mx-auto mt-[56px]">
                            {children}
                        </div>
                    </div>
                </div> </StudioWriteEditorWrapper> : <div className="max-w-7xl py-4 w-full mx-auto">
                    {children}
                </div>}
            </StudioWriteLayoutWrapper>
        )
    }

    return (
        <div>
            <h1>Write Page</h1>
        </div>
    )
}

const getArticle = async (id, authorId) => {
    try {
        const article = await prisma.post.findUnique({
            where: {
                shortId: id,
                isDeleted: false,
                author: {
                    id: authorId
                }
            },
            select: {
                shortId: true,
                title: true,
                description: true,
                image: {
                    select: {
                        url: true,
                        alt: true,
                        provider: true
                    }
                },
                published: true,
                author: {
                    select: {
                        id: true,
                        handle: true,
                    }
                }
            }
        });

        if (article) {
            if (article?.image?.provider === 'cloudinary') {
                article.image = await getCImageUrl(article?.image?.url, { width: 640, height: 360, crop: 'fill', quality: 'auto' });
            }
        }
        return article;
    } catch {
        return null;
    }
}

export default WriteLayout;