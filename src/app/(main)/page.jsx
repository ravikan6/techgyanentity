import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { VariantPermanent } from "@/lib/client";
import { TestToastify } from "@/components/Home/_client";
import { PostView_TIA } from "@/components/post/_struct";

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

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        <VariantPermanent />
        <PostView_TIA data={{ list: blogPosts, loading: false, ref: null, hasMore: false, }}
          className={'2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1'}
        />
        <div className="mt-5">
          <TestToastify />
        </div>
      </div>
    </>
  );
}
