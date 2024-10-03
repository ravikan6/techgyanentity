import { PostView2 } from "@/components/post";
import { getPostBykey } from "@/lib/actions/getters/content";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

const ViewPage = async ({ searchParams }) => {
    const query = searchParams;
    const session = await auth();

    if (!query) return notFound();

    if (query?.type === 'post' && query?.id) {
        const post = await getPostBykey(query.id);
        if (!post.success) return notFound();
        return (
            <PostView2 post={post.data} options={{
                meta: {
                    content: {
                        p4: true,
                    }
                }
            }} />
        )
    }
}

export default ViewPage;