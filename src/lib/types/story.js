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
          followed {
            byMe
            notifPref
          }
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
          followed {
            byMe
            notifPref
          }
          image {
            url
            alt
          }
          handle
        }
        commentsCount
        clapsCount
        clappedByMe
        savedByMe
      }
    }
  }
}`;

const GET_STORY_WITH_CATEGORIES = gql`
query GetAuthorStory($key: String!, $author_Key: String!) {
  Stories(key: $key, author_Key: $author_Key) {
    edges {
      node {
        createdAt
        deletedAt
        description
        id
        isDeleted
        key
        privacy
        publishedAt
        scheduledAt
        slug
        image {
          url
          id
        }
        state
        title
        updatedAt
        tags {
          name
        }
        author {
          key
          name
          handle
        }
      }
    }
  }
  Categories {
    id
    name
  }
}`;

/**
 * GraphQL mutation for creating a story.
 * 
 * This mutation takes an author's key as an input and returns the key of the created story.
 * 
 * @constant {Object} CREATE_STORY - The GraphQL mutation for creating a story.
 * @type {import('graphql').DocumentNode}
 * 
 * @example
 * import { useMutation } from '@apollo/client';
 * 
 * const [createStory] = useMutation(CREATE_STORY);
 * 
 * createStory({ variables: { authorKey: 'author123' } })
 *   .then(response => {
 *     console.log(response.data.createStory.story.key);
 *   })
 *   .catch(error => {
 *     console.error(error);
 *   });
 * 
 * @param {String} authorKey - The key of the author creating the story.
 * @returns {Object} story - The created story object.
 * @returns {String} story.key - The key of the created story.
 */
const CREATE_STORY = gql`
mutation CreateStory($authorKey: String!) {
  createStory(authorKey: $authorKey) {
    story {
      key
    }
  }
}`;

/**
 * GraphQL mutation for updating the content of a story.
 *
 * @constant {Object} UPDATE_STORY_CONTENT
 * @type {import('graphql').DocumentNode}
 * 
 * @param {String} key - The unique key identifying the story to update.
 * @param {String} content - The new content for the story.
 * @param {String} title - The new title for the story.
 * 
 * @returns {Object} updateStory - The updated story object.
 * @returns {String} updateStory.content - The updated content of the story.
 * @returns {String} updateStory.title - The updated title of the story.
 */
const UPDATE_STORY_CONTENT = gql`
mutation UpdateStoryContent($key: String = "", $content: String = "", $title: String = "") {
  updateStory(data: { title: $title, content: $content }, key: $key) {
    story {
      content
      title
    }
  }
}`;


/**
 * GraphQL mutation to update story details.
 * 
 * @constant {Object} UPDATE_STORY_DETAILS - The GraphQL mutation for updating story details.
 * @param {String} $key - The unique key of the story.
 * @param {String} $category - The category of the story.
 * @param {String} $description - The description of the story.
 * @param {PrivacyEnum} $privacy - The privacy setting of the story (default: PUBLIC).
 * @param {StateEnum} $state - The state of the story (default: DRAFT).
 * @param {String[]} $tags - The tags associated with the story.
 * @param {String} $title - The title of the story.
 * @param {String} $slug - The slug of the story.
 * @param {Boolean} $doPublish - Flag indicating whether to publish the story (default: false).
 * @param {ImageInput} $image - The image associated with the story.
 * 
 * @returns {Object} The updated story details.
 * @property {String} title - The title of the story.
 * @property {Date} updatedAt - The date when the story was last updated.
 * @property {StateEnum} state - The state of the story.
 * @property {String} slug - The slug of the story.
 * @property {Date} scheduledAt - The scheduled date for the story.
 * @property {Date} publishedAt - The publication date of the story.
 * @property {PrivacyEnum} privacy - The privacy setting of the story.
 * @property {String} key - The unique key of the story.
 * @property {Boolean} isDeleted - Flag indicating whether the story is deleted.
 * @property {String} id - The unique identifier of the story.
 * @property {String} description - The description of the story.
 * @property {Date} deletedAt - The date when the story was deleted.
 * @property {Date} createdAt - The creation date of the story.
 * @property {String} content - The content of the story.
 * @property {Object} image - The image associated with the story.
 * @property {String} image.id - The unique identifier of the image.
 * @property {String} image.url - The URL of the image.
 * @property {String} image.caption - The caption of the image.
 * @property {Object} category - The category of the story.
 * @property {String} category.name - The name of the category.
 * @property {String} category.id - The unique identifier of the category.
 * @property {Object[]} tags - The tags associated with the story.
 * @property {String} tags.name - The name of the tag.
 * @property {String} tags.id - The unique identifier of the tag.
 */
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
query GetStoryComments($key: String!, $parent_Id: ID = "", $offset: Int = 0, $first: Int = 10, $after: String = "", $orderBy: String) {
  StoryComments(story_Key: $key, parent_Id: $parent_Id, first: $first, offset: $offset, after: $after, orderBy: $orderBy) {
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

const UPDATE_STORY_SAVED = gql`
mutation StorySaved($storyKey: String!) {
  saveStory(storyKey: $storyKey) {
    story {
      key
      savedByMe
    }
  }
}`;

export { GET_CREATOR_STORY, GET_STORY_CLIENT_INFO }; // QUERY: Story
export { GET_STORY_COMMENTS }; // QUERY: Story -> Comment
export { GET_STORY_WITH_CATEGORIES }; // QUERY: Story -> _ Category

export { CREATE_STORY, UPDATE_STORY_CONTENT, UPDATE_STORY_DETAILS }; // MUTATE: Story
export { UPDATE_STORY_CLAP }; // MUTATE: Story -> Clap
export { UPDATE_STORY_SAVED }; // MUTATE: Story -> Save
export { ADD_STORY_COMMENT, VOTE_ON_STORY_COMMENT, UPDATE_STORY_COMMENT }; // MUTATE: Story -> Comment