import { gql } from "@apollo/client";


const VERIFY_GET_AUTHOR = gql`
query VerifyGetAuthor($handle: String!) {
  Creators(first: 1, handle: $handle) {
    edges {
      node {
        key
        name
      }
    }
  }
}`;

const GET_CREATOR_FOR_OG = gql`
query GetCreatorForOg($handle: String!) {
  Creators(first: 1, handle: $handle) {
    edges {
      node {
        key
        name
        handle
        description
        image {
          url
          alt
        }
      }
    }
  }
}`;

export { VERIFY_GET_AUTHOR, GET_CREATOR_FOR_OG }