import { gql } from "@apollo/client";


/**
 * @param slug
 * @param author_Key
 */
const GET_CREATOR_STORY = gql`
query GetAuthorStory($author_Key: String = "", $slug: String!) {
  Stories(author_Key: $author_Key, slug: $slug, first: 1) {
    edges {
      node {
        commentsCount
        content
        description
        key
        isDeleted
        privacy
        publishedAt
        title
        tags {
          name
          id
        }
        updatedAt
        image {
          alt
          caption
          url
        }
        state
        slug
        author {
          name
          key
          isFollowed
          image {
            url
            alt
          }
          handle
        }
      }
    }
  }
}`;

const GET_STORY_CLIENT_INFO = gql`
query GetStoryClientSide($key: String!) {
  Stories(first: 1, key: $key) {
    edges {
      node {
        key
        description
        publishedAt
        title
        tags {
          name
          id
        }
        updatedAt
        slug
        author {
          name
          key
          isFollowed
          image {
            url
            alt
          }
          handle
        }
        commentsCount
        clapsCount
        clappedByMe
        bookmarkedByMe
      }
    }
  }
}`;

const UPDATE_STORY_CONTENT = gql`
mutation UpdateStoryContent($key: String = "", $content: String = "", $title: String = "") {
  updateStory(data: { title: $title, content: $content }, key: $key) {
    story {
      content
      title
    }
  }
}`;


const UPDATE_STORY_DETAILS = gql`
mutation UpdateStoryDetails($key: String = "", $category: String = "", $description: String = "", $privacy: PrivacyEnum = PUBLIC, $state: StateEnum = DRAFT, $tags: [String] = "", $title: String = "", $slug: String = "", $doPublish: Boolean = false, $image: ImageInput) {
  updateStory(
    data: {
      category: $category
      description: $description
      doPublish: $doPublish
      privacy: $privacy
      state: $state
      tags: $tags
      title: $title
      slug: $slug
      image: $image
    }
    key: $key
  ) {
    story {
      title
      updatedAt
      state
      slug
      scheduledAt
      publishedAt
      privacy
      key
      isDeleted
      id
      description
      deletedAt
      createdAt
      content
      image {
        id
        url
        caption
      }
      category {
        name
        id
      }
      tags {
        name
        id
      }
    }
  }
}`;

const GET_STORY_COMMENTS = gql`
query GetStoryComments($key: String!, $parent_Id: ID = "") {
  StoryComments(story_Key: $key, parent_Id: $parent_Id) {
    edges {
      node {
        content
        createdAt
        updatedAt
        id
        myVote
        author {
          image {
            url
            alt
          }
          handle
          name
          key
        }
        user {
          username
          name
          image {
            alt
            url
          }
        }
        votes
      }
      cursor
    }
    pageInfo {
      startCursor
      hasPreviousPage
      hasNextPage
      endCursor
    }
  }
}`;

const ADD_STORY_COMMENT = gql`
mutation AddComment($storyKey: String!, $text: String!, $parentId: String, $authorKey: String = "") {
  createStoryComment(storyKey: $storyKey, text: $text, parentId: $parentId, authorKey: $authorKey) {
    comment {
      content
      createdAt
      updatedAt
      id
      myVote
      replyCount
      author {
        image {
          url
          alt
        }
        handle
        name
        key
      }
      user {
        username
        name
        image {
          alt
          url
        }
      }
      votes
    }
  }
}`;

const UPDATE_STORY_COMMENT = gql`
mutation UpdateComment($commentId: String!, $text: String!) {
  updateStoryComment(commentId: $commentId, text: $text) {
    comment {
      id
      content
      updatedAt
      replyCount
      myVote
      votes
    }
  }
}`;

const VOTE_ON_STORY_COMMENT = gql`
mutation StoryCommentVote($id: String!) {
  voteOnStoryComment(commentId: $id) {
    comment {
      id
      myVote
      votes
    }
  }
}`;

const UPDATE_STORY_CLAP = gql`
mutation StoryClap($storyKey: String!) {
  clapOnStory(storyKey: $storyKey) {
    story {
      key
      clapsCount
      clappedByMe
    }
  }
}`;

export { GET_CREATOR_STORY, GET_STORY_CLIENT_INFO }; // QUERY: Story
export { GET_STORY_COMMENTS }; // QUERY: Story -> Comment

export { UPDATE_STORY_CONTENT, UPDATE_STORY_DETAILS }; // MUTATE: Story
export { UPDATE_STORY_CLAP }; // MUTATE: Story -> Clap
export { ADD_STORY_COMMENT, VOTE_ON_STORY_COMMENT, UPDATE_STORY_COMMENT }; // MUTATE: Story -> Comment