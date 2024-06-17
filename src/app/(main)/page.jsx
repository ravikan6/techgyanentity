import { auth } from "@/lib/auth";
import { ImageBlock, TheImageBlock } from "@/components/Home/HomeBlocks";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArticleImage } from "@/components/post/_client";

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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(blogPosts, 'blogPosts');

  return (
    <>
      {/* <ImageBlock />
      <TheImageBlock /> */}
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-6xl font-bold">Welcome to Next.js!</h1>
        <p className="mt-3 text-2xl">Get started by editing{' '}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">pages/index.js</code>
        </p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          {blogPosts.map((post) => (
            <div key={post.slug} className="p-6 mt-6 text-left border w-96 rounded-xl">
              <ArticleImage image={post.image} />
              <h2 className="text-xl mt-2 font-bold cheltenham">{post.title}</h2>
              <Link href={`/${post.author.handle}/${post.slug}`} className="mt-4 text-sm font-bold text-blue-600">Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
