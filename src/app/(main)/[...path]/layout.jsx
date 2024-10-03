import { CreatorSingleViewPage } from "@/components/creator/view";
import { gql } from "@apollo/client";
import { query } from "@/lib/client";
import { VERIFY_GET_AUTHOR } from "@/lib/types/creator";

export const authorPageRoutes = ['about', 'followers', 'following', 'posts',];

const DynamicMainLayout = async ({ params, searchParams, children }) => {
  const route = params.path;
  const path = decodeURIComponent(params?.path[0]);

  if (route?.length <= 2 && route?.length > 0) {
    let author = await verfyAuthorExistence(path)
    if (author) {
      if ((route?.length === 1) || (route?.length === 2 && authorPageRoutes.includes(route[1]))) {
        let creator = await getCreatorInfo(author?.key)
        return <CreatorSingleViewPage creator={{ ...author, ...creator }} >
          {children}
        </CreatorSingleViewPage>
      } else {
        return children;
      }
    } else return children;
  } else {
    return children;
  }

};

async function verfyAuthorExistence(path) {
  let handle = await path.startsWith('@') ? path.slice(1) : path
  try {
    let { data, error } = await query({
      query: VERIFY_GET_AUTHOR,
      variables: {
        handle: String(handle),
      }
    })
    console.log(data, '__while checking author existence.');
    if (await data && data.Creators?.edges?.at(0)?.node) {
      return data.Creators?.edges?.at(0)?.node;
    }
    return null
    // ..
  } catch (e) {
    console.log(e, '___while checking author existence.')
    return null;
  }
}

async function getCreatorInfo(aKey) {
  try {
    let { data, error } = await query({
      query: GET_CREATOR_INFO,
      variables: {
        key: aKey
      }
    })
    console.log(data, 'while getting info')
    if (await data && data.Creators?.edges.at(0)?.node) {
      return data.Creators?.edges.at(0)?.node;
    }
    return null;
    // ..
  } catch (e) {
    console.log(e)
    return null
  }
}

const GET_CREATOR_INFO = gql`
query GetCreatorInfo($key: String!) {
  Creators(first: 1, key: $key) {
    edges {
      node {
        key
        name
        isFollowed
        handle
        social {
          name
          url
        }
        user {
          key
        }
        createdAt
        description
        image {
          url
          alt
        }
        banner {
          url
          alt
        }
      }
    }
  }
}`;

export default DynamicMainLayout;