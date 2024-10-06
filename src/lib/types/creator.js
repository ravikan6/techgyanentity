import { gql } from "@apollo/client";

const CREATE_CREATOR_PROFILE = gql`
mutation CreateCreatorProfile($handle: String!, $name: String!) {
  createCreator(handle: $handle, name: $name) {
    creator {
      key
      name
      handle
    }
  }
}`;

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

const UPDATE_CREATOR = gql`
mutation UpdateAuthor($key: String!, $social: [SocialLinkInput], $name: String = "", $description: String = "", $contactEmail: String = "", $handle: String = "") {
  updateCreator(
    data: {
      contactEmail: $contactEmail
      description: $description
      handle: $handle
      name: $name
      social: $social
    }
    key: $key
  ) {
    creator {
      social {
        id
        name
        url
      }
      updatedAt
      name
      key
      handle
      description
      contactEmail
    }
  }
}`;


const UPDATE_CREATOR_IMAGE = gql`
mutation CreatorImageAction($action: ImageActionEnum = CREATE, $provider: String = "", $url: String = "", $key: String = "", $id: String = "") {
  updateCreator(
    data: { image: { url: $url, provider: $provider, action: $action, id: $id } }
    key: $key
  ) {
    creator {
      image {
        id
        url
      }
      key
    }
  }
}`;

const UPDATE_CREATOR_BANNER = gql`
mutation CreatorBannerAction($action: ImageActionEnum = CREATE, $provider: String = "", $url: String = "", $key: String = "", $id: String = "") {
  updateCreator(
    data: { banner: { url: $url, provider: $provider, action: $action, id: $id } }
    key: $key
  ) {
    creator {
      banner {
        id
        url
      }
      key
    }
  }
}`;

export { CREATE_CREATOR_PROFILE }; // MUTATE: Creator -> Create
export { UPDATE_CREATOR, UPDATE_CREATOR_IMAGE, UPDATE_CREATOR_BANNER }; // MUTATE: Creator -> Update

export { VERIFY_GET_AUTHOR, GET_CREATOR_FOR_OG }