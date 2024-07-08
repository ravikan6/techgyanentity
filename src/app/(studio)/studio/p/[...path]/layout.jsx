import { StudioWriteEditorWrapper, StudioWriteLayoutWrapper } from "@/components/studio/wrappers";
import { WriteHeader } from "@/components/studio/write/_header_focus";
import { prisma } from "@/lib/db";
import { getCldImageUrl } from "next-cloudinary";

const WriteLayout = async ({ children, params }) => {
    const { path } = params;

    if (path?.length === 2) {
        const id = path[0];
        let article = null
        try {
            article = await prisma.post.findUnique({
                where: {
                    shortId: id
                },
                select: {
                    shortId: true,
                    title: true,
                    description: true,
                    image: {
                        select: {
                            url: true,
                            alt: true
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
                if (article?.image?.url) {
                    article.image = getCldImageUrl({ src: article.image.url, width: 640, height: 360, crop: 'fill', quality: 'auto' })
                }
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
                    </div> </StudioWriteEditorWrapper> : children}
                </StudioWriteLayoutWrapper>
            )

        } catch { }
    }

    return (
        <div>
            <h1>Write Page</h1>
        </div>
    )
}

export default WriteLayout;