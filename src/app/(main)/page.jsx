import { auth } from "@/lib/auth";
import { TestToastify } from "@/components/Home/_client";
import { PostView_TIA } from "@/components/post/_struct";
import { MicroPostView } from "@/components/post/_micropost";
import { PostCardView } from "@/components/post";
import { query } from "@/lib/client";
import { GET_POSTS } from "@/lib/types/post";

export default async function Home() {
  const session = await auth();
  const blogPosts = []
  let communityPosts = [];

  try {
    let dt = await query({
      query: GET_POSTS
    })
    if (dt.data) {
      communityPosts = dt.data.Posts.edges;
    }
  } catch (e) {
    console.log(e, '___while getting posts')
  }

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        {/* <PostView_TIA data={{ list: blogPosts, loading: false, ref: null, hasMore: false, }}
          className={'2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1'}
        /> */}
        <CommunityPosts posts={communityPosts} />
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
      <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
        {
          posts.map((post, _) => (
            <PostCardView post={post?.node} key={_} />
          ))
        }
      </div>
    </div>
  )
}