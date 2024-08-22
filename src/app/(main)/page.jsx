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

  const communityPosts = await getCommunityPosts();

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        <PostView_TIA data={{ list: blogPosts, loading: false, ref: null, hasMore: false, }}
          className={'2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1'}
        />
        <CommunityPosts posts={communityPosts} />
        <div className="mt-5">
          <TestToastify />
        </div>
      </div>
    </>
  );
}


const CommunityPosts = ({ posts }) => {
  return (
    <div className="mt-3">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
        {
          posts.map((post, index) => (
            <div key={index} className="bg-light dark:bg-dark p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AuthorAvatar data={{ url: post.author?.image?.url }} />
                </div>
                <div className="ml-4">
                  <div className="text-sm karnak font-bold text-zinc-900 dark:text-slate-100">{post.author.name}</div>
                  <div className="text-xs text-zinc-600 dark:text-slate-400">{post.author.handle}</div>
                </div>
              </div>
              <div className="mt-4 px-3">
                <CommunityPostContent post={post} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

const getCommunityPosts = async () => {
  const posts = await prisma.microPost.findMany({
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
  for (let post of posts) {
    switch (post.type) {
      case 'TEXT':
        break;
      case 'IMAGE':
        break;
      case 'LINK':
        break;
      case 'POLL':
        let p = await prisma.poll.findUnique({
          where: {
            id: post.typeContent
          },
          include: {
            _count: {
              select: {
                votes: true
              }
            }
          },
        });
        post.content = p.question;
        post.typeContent = p;
        break;
      case 'ARTICLE':
        break;
      default:
        break;
    }
  }
  return posts;
}

const CommunityPostContent = ({ post }) => {
  switch (post.type) {
    case 'TEXT':
      return <p className="text-sm text-gray-900 dark:text-gray-100">{post.content}</p>;
    case 'IMAGE':
      return <img src={post.content} alt="Image" />;
    case 'LINK':
      return <a href={post.content} target="_blank" rel="noreferrer">{post.content}</a>;
    case 'POLL':
      return <Poll post={post} />;
    case 'ARTICLE':
      return <div>Article</div>;
    default:
      return <div>Unknown</div>;
  }
}

const Poll = ({ post }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm text-gray-900 dark:text-gray-100">{post?.typeContent?.question}</h3>
      <div className="mt-2">
        {
          post?.typeContent?.options?.map((option, index) => (
            <div key={index} className="flex items-center">
              <input type="radio" name={`poll-${post.id}`} id={`poll-${post.id}-${index}`} />
              <label htmlFor={`poll-${post.id}-${index}`} className="ml-2">{option}</label>
            </div>
          ))
        }
      </div>
    </div>
  )
}