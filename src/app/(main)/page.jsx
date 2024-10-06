import { auth } from "@/lib/auth";
import { PostCardView } from "@/components/post";
import { query } from "@/lib/client";
import { GET_POSTS } from "@/lib/types/post";
import React from "react";

export default async function Home() {
  const session = await auth();
  const blogPosts = []
  let communityPosts = [];

  try {
    let dt = await query({
      query: GET_POSTS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    })
    if (dt.data) {
      communityPosts = dt.data.Posts.edges;
    }
  } catch (e) {
  }

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        <CommunityPosts posts={communityPosts} />
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
            <React.Fragment key={_}>
              <PostCardView post={post?.node} />
            </React.Fragment>
          ))
        }
      </div>
    </div>
  )
}