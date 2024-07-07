import { StudioWriteLayoutWrapper } from "@/components/studio/wrappers";
import { WriteHeader } from "@/components/studio/write/_header_focus";
import { prisma } from "@/lib/db";

const WriteLayout = async ({ children, params }) => {
    const { path } = params;

    if (path?.length === 2) {
        const postId = path[0];
        let article = null
        try {
            article = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            });
            if (!article) {
                article = await prisma.post.findUnique({
                    where: {
                        shortId: postId
                    }
                });
            }
        } catch { }


        return (
            <StudioWriteLayoutWrapper article={article} >
                {path[1] === 'editor' ? <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[1000] bg-light dark:bg-dark">
                    <WriteHeader />
                    <div className="w-full h-full overflow-y-auto">
                        <div className="max-w-[640px] w-full px-2 sm:px-0 mx-auto mt-[56px]">
                            {children}
                        </div>
                    </div>
                </div> : children}
            </StudioWriteLayoutWrapper>
        )

    }

    return (
        <div>
            <h1>Write Page</h1>
        </div>
    )
}

export default WriteLayout;