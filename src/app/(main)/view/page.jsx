import { MicorPostAuthor, MicroPostActions, MicroPostCommentsView, MicroPostPageContent } from "@/components/post/_micropost";
import { getMicroPost } from "@/lib/actions/getContent";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

const ViewPage = async ({ searchParams }) => {
    const query = searchParams;
    const session = await auth();

    if (!query) notFound();

    if (query?.type === 'post' && query?.id) {
        const post = await getMicroPost(query.id);
        if (!post) notFound();
        return (
            <>
                <section className="max-w-3xl mx-auto my-5">
                    <div className="bg-lightHead/40 dark:bg-darkHead/40 rounded-xl w-full md:p-4 p-2">
                        <div className="flex justify-between items-center">
                            <MicorPostAuthor post={post} />
                            <MicroPostActions id={post?.shortId} />
                        </div>
                        <div className="mt-2 px-2">
                            <p>
                                {post.type === 'IMAGE' ? <p className="text-base text-gray-900 dark:text-gray-100 mb-3">{post?.content}</p> : null}
                            </p>
                            <div className="">
                                <MicroPostPageContent post={post} session={session} imgRounded addPad={false} />
                            </div>
                        </div>
                    </div>
                    <MicroPostCommentsView post={post} />
                </section>
            </>
        )
    }
}

export default ViewPage;