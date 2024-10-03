import { PostView } from "@/components/post";
import { getPostBykey } from "@/lib/actions/getters/content";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

const ViewPage = async ({ searchParams }) => {
    const query = searchParams;
    const session = await auth();

    if (!query) notFound();

    if (query?.type === 'post' && query?.id) {
        const post = await getPostBykey(query.id);
        if (!post.success) notFound();
        return (
            <>
                <PostView post={post.data} />
            </>
        )
    }
}

export default ViewPage;