import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArticleImage } from "@/components/post/_client";
import { VariantPermanent } from "@/lib/client";

export default async function Home() {
  const session = await auth();
  const blogPosts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      title: true,
      slug: true,
      image: true,
      author: {
        select: {
          id: true,
          handle: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(blogPosts, 'blogPosts');

  const arr = [0]

  return (
    <>
      <div className="py-2">
        <VariantPermanent />
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 max-w-5xl mx-auto gap-6 sm:w-full">
          {
            arr.map(() => {
              return (blogPosts.map((post) => (
                <Link href={`/${post.author.handle}/${post.slug}`} key={post.slug} className="text-left">
                  <ArticleImage classes={'rounded-lg'} image={post.image} />
                  <h2 className="text-xl mt-2 font-bold cheltenham">{post.title}</h2>
                  <div className="flex ">
                    <Link className="flex mt-2 space-x-3 items-center" href={`/@${post?.author?.handle}`}>
                      <span className="w-10 h-10 rounded-3xl bg-black/20 dark:bg-white/20 animate-pulse" />
                      <p className="text-base flex flex-col font-semibold">
                        {post?.author?.name}
                        <span className="text-sm -mt-1.5 font-medium">{post?.author?.handle}</span>
                      </p>
                    </Link>
                  </div>
                </Link>)
              ))
            })
          }

        </div>
      </div>
    </>
  );
}
