import { gql } from "@apollo/client";

const GET_POST_BY_KEY = gql`
query GetPostByKey($key: String!) {
  Posts(key: $key) {
    edges {
      node {
        createdAt
        deletedAt
        id
        isDeleted
        key
        privacy
        publishedAt
        scheduledAt
        state
        text
        typePoll {
          id
          question
          options {
            id
            text
            votes
          }
          votesCount
          myVote
        }
        typeImage {
          id
          images {
            caption
            url
            alt
          }
          caption
        }
        typeOf
        updatedAt
        author {
          key
          name
          handle
          image {
            url
            alt
          }
        }
      }
    }
  }
}`;

const GET_POST_COMMENTS = gql`
query GetPostComments($key: String!, $parent_Id: ID = "") {
  PostComments(post_Key: $key, parent_Id: $parent_Id) {
    edges {
      node {
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

const GET_POSTS = gql`
query GetPosts {
  Posts {
    edges {
      node {
        createdAt
        deletedAt
        id
        isDeleted
        key
        privacy
        publishedAt
        scheduledAt
        state
        text
        typePoll {
          id
          question
          options {
            __typename @skip(if: true)
            id
            text
            votes
          }
          votesCount
          myVote
        }
        typeImage {
          id
          images {
            caption
            url
            alt
          }
          caption
        }
        typeOf
        updatedAt
        author {
          key
          name
          handle
          image {
            url
            alt
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
    }
  }
}`;

const CREATE_POST = gql`
mutation CreatePost($authorKey: String!, $data: PostInput!) {
  createPost(authorKey: $authorKey, data: $data) {
    post {
      id
      key
    }
  }
}`;

const CREATE_POST_POLL = gql`
mutation CreatePostPoll($question: String!, $options: [PostPollOptionInput]!) {
  createPostPoll(question: $question, options: $options) {
    poll {
      id
    }
  }
}`;

const CREATE_POST_IMAGE = gql`
mutation CreatePostImage($images: [ImageInput]!, $caption: String = "") {
  createPostImage(images: $images, caption: $caption) {
    postImage {
      id
    }
  }
}`;

const ADD_POST_COMMENT = gql`
mutation AddComment($postKey: String!, $text: String!, $parentId: String, $authorKey: String = "") {
  createPostComment(
    postKey: $postKey
    text: $text
    parentId: $parentId
    authorKey: $authorKey
  ) {
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

const UPDATE_POST_COMMENT = gql`
mutation UpdateComment($commentId: String!, $text: String!) {
  updatePostComment(commentId: $commentId, text: $text) {
    comment {
      id
      content
      replyCount
      updatedAt
      myVote
      votes
    }
  }
}`;

const VOTE_ON_POST_COMMENT = gql`
mutation PostCommentVote($id: String!) {
  voteOnPostComment(commentId: $id) {
    comment {
      id
      myVote
      votes
    }
  }
}`;

const VOTE_ON_POST_POLL = gql`
mutation PostPollVote($postKey: String!, $optionId: Int!) {
  doVotePostPoll(postKey: $postKey, optionId: $optionId) {
    poll {
      id
      options {
        votes
        id
        text
      }
      myVote
      votesCount
    }
  }
}`;

export { GET_POST_BY_KEY, GET_POST_COMMENTS, GET_POSTS };

export { ADD_POST_COMMENT, UPDATE_POST_COMMENT, VOTE_ON_POST_COMMENT } // MUTATE: Post -> Comment

export { CREATE_POST } // MUTATE: Post

export { CREATE_POST_IMAGE } // MUTATE: Post -> Image

export { CREATE_POST_POLL, VOTE_ON_POST_POLL }; // MUTATE: Post -> Poll