"use server"
import { cookies } from 'next/headers';
import { decrypt, encrypt } from "../utils";
import { query } from '@/lib/client';
import { gql } from '@apollo/client';

const GET_AUTHOR = gql`
query GetAuthor($key: String!) {
  Creators(key: $key) {
    edges {
      node {
        id
        handle
        key
        name
        deletedAt
        image {
            id
            url
        }
        banner {
            id
            url
        }
        contactEmail
        description
        social {
            id
            name
            url
        }
      }
    }
  }
}`;

const DecryptAuthorStudioCookie = async () => {
    let cookieData = cookies().get('__Secure-RSUAUD');
    cookieData = await decrypt(cookieData?.value, process.env.COOKIE_SECRET);

    if (cookieData) {
        let author = await query({
            query: GET_AUTHOR,
            variables: {
                key: cookieData
            },
        });
        if (author) {
            author = author?.data?.Creators?.edges[0]?.node;
            return author;
        }
        else {
            return null;
        }
    }
    return null;
}

const DecryptAuthorIdStudioCookie = async (cookieData) => {
    cookieData = await decrypt(cookieData, process.env.COOKIE_SECRET);
    if (cookieData) {
        let author = await query({
            query: GET_AUTHOR,
            variables: {
                key: cookieData
            },
        });
        if (author) {
            author = author?.data?.Creators?.edges[0]?.node;
            return author;
        }
        else {
            return null;
        }
    }
    return null;
}

const SetAuthorStudioCookie = async (data) => {
    try {
        let encryptedData = encrypt(data, process.env.COOKIE_SECRET);
        cookies().set('__Secure-RSUAUD', encryptedData, {
            httpOnly: false,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
        });
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    };
}

export { SetAuthorStudioCookie, DecryptAuthorStudioCookie, DecryptAuthorIdStudioCookie };