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
          blurUrl
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
        blurUrl
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
        blurUrl
      }
      key
    }
  }
}`;

const FOLLOW_CREATOR = gql`
mutation FollowCreator($notifications: CreatorNotificationEnum = ALL, $creatorKey: String!) {
  followCreator(creatorKey: $creatorKey, notifications: $notifications) {
    creator {
      followed {
        notifPref
        byMe
      }
      key
    }
  }
}`;

const UNFOLLOW_CREATOR = gql`
mutation UnfollowCreator($creatorKey: String!) {
  unfollowCreator(creatorKey: $creatorKey) {
    creator {
      followed {
        notifPref
        byMe
      }
      key
    }
  }
}`;

const GET_CREATOR_IN_TIP = gql`
query GetCreatorInTip($key: String!) {
  Creators(key: $key) {
    edges {
      node {
        key
        social {
          name
          url
        }
        image {
          url
          blurUrl
        }
        count {
          followers
          stories
        }
        name
        handle
        description
        followed {
          byMe
          notifPref
        }
      }
    }
  }
}`;

export { GET_CREATOR_IN_TIP }; // QUERY: Creator -> Get

export { CREATE_CREATOR_PROFILE }; // MUTATE: Creator -> Create
export { FOLLOW_CREATOR }; // MUTATE: Creator -> Follow
export { UNFOLLOW_CREATOR }; // MUTATE: Creator -> Unfollow
export { UPDATE_CREATOR, UPDATE_CREATOR_IMAGE, UPDATE_CREATOR_BANNER }; // MUTATE: Creator -> Update

export { VERIFY_GET_AUTHOR, GET_CREATOR_FOR_OG }