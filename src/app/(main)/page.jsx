import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TestToastify } from "@/components/Home/_client";
import { ImagePostView, PollView, PostView_TIA } from "@/components/post/_struct";
import { AuthorAvatar } from "@/components/author/_client";
import { getMicoPosts } from "@/lib/actions/getContent";

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
          posts.map((post, index) => (
            <div key={index} className="p-3 rounded-xl bg-lightHead/40 dark:bg-darkHead/40">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AuthorAvatar data={{ url: post.author?.image?.url }} sx={{ width: '32px', height: '32px' }} />
                </div>
                <div className="ml-4">
                  <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{post.author.name}</div>
                  <div className="text-xs text-zinc-600 -mt-px dark:text-slate-400">{post.author.handle}</div>
                </div>
              </div>
              <div className="mt-2.5">
                <CommunityPostContent post={post} session={session} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

const CommunityPostContent = ({ post, session }) => {
  switch (post.type) {
    case 'TEXT':
      return <p className="text-base text-gray-900 dark:text-gray-100">{post.content}</p>;
    case 'IMAGE':
      return <ImagePostView post={post.typeContent} url={`view?type=post&id=${post.shortId}`} />;
    case 'LINK':
      return <a href={post.content} target="_blank" rel="noreferrer">{post.content}</a>;
    case 'POLL':
      return <PollView post={post} session={session} />;
    case 'ARTICLE':
      return <div>Article</div>;
    default:
      return <div>Unknown</div>;
  }
}
