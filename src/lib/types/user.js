import { gql } from "@apollo/client"

const GET_USER_FOR_UPDATE = gql`
query MyQuery {
  Me {
    dob
    firstName
    key
    lastName
    name
    sex
    username
    image {
      id
      provider
      url
      alt
    }
  }
}`;

const UPDATE_USER_IMAGE = gql`
mutation UpdateMyAccount($image: ImageInput!) {
  updateMe(input: { image: $image }) {
    user {
      image {
        id
        url
        provider
      }
      key
    }
  }
}`;

const UPDATE_USER = gql`
mutation UpdateMyAccount($dob: Date = "", $firstName: String = "", $lastName: String = "", $sex: String = "", $username: String = "") {
  updateMe(
    input: {
      firstName: $firstName
      lastName: $lastName
      username: $username
      sex: $sex
      dob: $dob
    }
  ) {
    user {
      key
      name
      sex
      username
      dob
    }
  }
}`;

/**
 * GraphQL query to fetch the stories clapped by the current user.
 *
 * @constant {Object} GET_USER_CLAPPED_STORIES
 * @type {import('graphql').DocumentNode}
 * @default
 *
 * @param {number} [first=10] - The number of stories to fetch.
 * @param {string} [after=""] - The cursor to fetch the next set of stories.
 *
 * @returns {Object} The stories clapped by the current user along with pagination info.
 * @returns {Object[]} returns.edges - The edges of the stories.
 * @returns {Object} returns.edges.node - The node containing story details.
 * @returns {Object} returns.edges.node.story - The story details.
 * @returns {number} returns.edges.node.story.clapsCount - The number of claps the story has received.
 * @returns {number} returns.edges.node.story.commentsCount - The number of comments on the story.
 * @returns {string} returns.edges.node.story.description - The description of the story.
 * @returns {string} returns.edges.node.story.key - The unique key of the story.
 * @returns {string} returns.edges.node.story.privacy - The privacy setting of the story.
 * @returns {string} returns.edges.node.story.publishedAt - The publication date of the story.
 * @returns {boolean} returns.edges.node.story.savedByMe - Whether the story is saved by the current user.
 * @returns {string} returns.edges.node.story.slug - The slug of the story.
 * @returns {string} returns.edges.node.story.state - The state of the story.
 * @returns {string} returns.edges.node.story.title - The title of the story.
 * @returns {Object} returns.edges.node.story.author - The author of the story.
 * @returns {string} returns.edges.node.story.author.handle - The handle of the author.
 * @returns {Object} returns.edges.node.story.author.image - The image of the author.
 * @returns {string} returns.edges.node.story.author.image.url - The URL of the author's image.
 * @returns {string} returns.edges.node.story.author.key - The unique key of the author.
 * @returns {string} returns.edges.node.story.author.name - The name of the author.
 * @returns {Object} returns.pageInfo - The pagination information.
 * @returns {string} returns.pageInfo.endCursor - The end cursor for pagination.
 * @returns {boolean} returns.pageInfo.hasNextPage - Whether there is a next page.
 * @returns {boolean} returns.pageInfo.hasPreviousPage - Whether there is a previous page.
 * @returns {string} returns.pageInfo.startCursor - The start cursor for pagination.
 */
const GET_USER_CLAPPED_STORIES = gql`
query MyQuery {
  MySavedStories {
    edges {
      node {
        clapsCount
        commentsCount
        description
        key
        privacy
        publishedAt
        savedByMe
        slug
        state
        title
        author {
          handle
          image {
            url
          }
          key
          name
        }
      }
    }
  }
}`;

export { GET_USER_FOR_UPDATE }; // QUERY: Me
export { GET_USER_CLAPPED_STORIES }; // QUERY: Me -> Stories -> Clapped

export { UPDATE_USER_IMAGE }; // MUTATE: User -> Image
export { UPDATE_USER }; // MUTATE: User -> Update