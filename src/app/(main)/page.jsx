import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TestToastify } from "@/components/Home/_client";
import { PostView_TIA } from "@/components/post/_struct";
import { AuthorAvatar } from "@/components/author/_client";

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
      shortId: true,
      image: true,
      publishedAt: true,
      description: true,
      author: {
        select: {
          shortId: true,
          name: true,
          handle: true,
          image: true,
        }
      },
      _count: {
        select: {
          claps: true,
          comments: {
            where: {
              parent: null,
              isDeleted: false,
            }
          }
        }
      },
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const communityPosts = await prisma.microPost.findMany({
    include: {
      author: {
        select: {
          name: true,
          handle: true,
          image: true,
        }
      }
    }
  });

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        <PostView_TIA data={{ list: blogPosts, loading: false, ref: null, hasMore: false, }}
          className={'2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1'}
        />
        <div className="mt-3">
          {
            communityPosts.map((post, index) => (
              <div key={index} className="bg-light dark:bg-dark p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AuthorAvatar data={{ url: post.author?.image?.url }} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{post.author.name}</div>
                    <div className="text-sm text-gray-500">{post.author.handle}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-900">{post.content}</p>
                </div>
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
