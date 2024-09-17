import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TestToastify } from "@/components/Home/_client";
import { PostView_TIA } from "@/components/post/_struct";
import { getMicoPosts } from "@/lib/actions/getContent";
import { MicroPostView } from "@/components/post/_micropost";

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

  const communityPosts = await getMicoPosts();

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        <PostView_TIA data={{ list: blogPosts, loading: false, ref: null, hasMore: false, }}
          className={'2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1'}
        />
        <CommunityPosts posts={communityPosts} session={session} />
        <div className="mt-5">
          <TestToastify />
        </div>
      </div>
    </>
  );
}


const CommunityPosts = ({ posts, session }) => {
  return (
    <div className="mt-3">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
        {
          posts.map((post, _) => (
            <MicroPostView key={_} post={post} session={session} />
          ))
        }
      </div>
    </div>
  )
}