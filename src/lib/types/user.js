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

export { GET_USER_FOR_UPDATE }; // QUERY: Me

export { UPDATE_USER_IMAGE }; // MUTATE: User -> Image
export { UPDATE_USER }; // MUTATE: User -> Update