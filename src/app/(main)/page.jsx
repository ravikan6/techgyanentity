import { auth } from "@/lib/auth";
import { PostCardView } from "@/components/post";
import { query } from "@/lib/client";
import { GET_POSTS } from "@/lib/types/post";
import React from "react";
import { StoryCardView } from "@/components/story";
import { gql } from "@apollo/client";

const THE_QUERY = gql`
query MyQuery {
  Stories {
    edges {
      node {
        author {
          handle
          key
          name
          image {
            url
            blurUrl
            provider
          }
        }
        title
        state
        slug
        privacy
        key
        image {
          blurUrl
          url
        }
        description
        publishedAt
        commentsCount
        clapsCount
        clappedByMe
        count {
          claps
          comments
        }
        me {
          isClapped
          isSaved
        }
      }
    }
  }
}`;

export default async function Home() {
  const session = await auth();
  let blogPosts = []
  let communityPosts = [];

  try {
    let dt = await query({
      query: GET_POSTS,
    })
    console.log(dt.data);
    if (dt.data) {
      communityPosts = dt.data.Posts.edges;
    }
  } catch (e) {
  }

  try {
    let dt = await query({
      query: THE_QUERY,
    })
    if (dt.data) {
      blogPosts = dt.data.Stories.edges;
    }
  } catch (e) { }

  return (
    <>
      <div className="py-2 max-w-5xl mx-auto">
        {
          blogPosts.length > 0 && (
            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
              {
                blogPosts.map((story, _) => (
                  <React.Fragment key={_}>
                    <StoryCardView story={story?.node} />
                  </React.Fragment>
                ))
              }
            </div>
          )
        }
        <span className="mt-20"></span>
        <h1 className="text-2xl font-bold Stymie">Community Posts</h1>
        <CommunityPosts posts={communityPosts} />
        <span className="mt-20"></span>

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
            <React.Fragment key={post?.cursor}>
              <PostCardView post={post?.node} />
            </React.Fragment>
          ))
        }
      </div>
    </div>
  )
}