import { MicroPostViewPage } from "@/components/post/_micropost";
import { getMicroPost } from "@/lib/actions/getContent";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

const ViewPage = async ({ searchParams }) => {
    const query = searchParams;
    const session = await auth();

    if (!query) return notFound();

    if (query?.type === 'post' && query?.id) {
        const post = await getMicroPost(query.id);
        if (!post) return notFound();
        return (
            <MicroPostViewPage post={post} session={session} />
        )
    }
}

export default ViewPage;