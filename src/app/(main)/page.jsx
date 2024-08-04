import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArticleImage } from "@/components/post/_client";
import { VariantPermanent } from "@/lib/client";
import { AuthorAvatar } from "@/components/author/_client";
import { TestToastify } from "@/components/Home/_client";

export default async function Home() {
  const session = await auth();
  const blogPosts = await prisma.post.findMany({
    where: {
      published: true,
      isDeleted: false,
      privacy: "PUBLIC",
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
          image: true
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="py-2">
        <VariantPermanent />
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 max-w-5xl mx-auto gap-6 sm:w-full">
          {
            blogPosts.map((post) => (
              <div key={post?.slug} className="text-left">
                <Link href={`/${post?.author?.handle}/${post.slug}`}>
                  <ArticleImage classes="rounded-lg" image={post?.image} />
                  <h2 className="text-xl mt-2 font-bold cheltenham">{post.title}</h2>
                </Link>
                <span className="flex mt-2 space-x-3 items-center">
                  <Link href={`/@${post?.author?.handle}`} className="flex items-center space-x-3">
                    <AuthorAvatar data={{ url: post?.author?.image?.url }} className={'!w-10 !h-10'} />
                    <p className="text-base flex flex-col font-semibold">
                      {post?.author?.name}
                      <span className="text-sm -mt-1.5 font-medium">{post?.author?.handle}</span>
                    </p>
                  </Link>
                </span>
              </div>
            ))
          }
        </div>
        <div className="mt-5">
          <TestToastify />
        </div>
      </div>
    </>
  );
}
