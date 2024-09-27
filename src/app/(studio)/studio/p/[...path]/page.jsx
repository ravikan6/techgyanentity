import { CreatePost } from '@/components/post/create'
import PostDetailsEditor from '@/components/studio/write/_post-details';
import { auth } from '@/lib/auth';
import { query } from '@/lib/client';
import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';
import React from 'react'
import { cookies } from 'next/headers';
import { DecryptAuthorIdStudioCookie } from '@/lib/actions/studio';

const PostEditPage = async ({ params }) => {
    const session = await auth();
    const { path } = params;

    if (path?.length === 2) {
        if (path[1] === 'editor') {
            const id = path[0];
            let authorCookie = cookies().get('__Secure-RSUAUD');
            let author = DecryptAuthorIdStudioCookie(authorCookie);
            try {
                let data = await getArticle(id, author?.key);
                console.log(data, '----data')
                if (data && !data.isDeleted) {
                    data = { ...data }
                    delete data.isDeleted;
                    return (
                        <div className='pt-10'>
                            <CreatePost data={data} />
                        </div>
                    )
                } else {
                    throw new Error('Post not found')
                }
            } catch (error) {
                console.log(error)
                redirect(`/${process.env?.STUDIO_URL_PREFIX}/content`)
            }
        } else if (path[1] === 'edit') {
            return (
                <PostDetailsEditor />
            )
        }
    }

    return (
        <div>
            <h1>Post Edit</h1>
        </div>
    )
}

const getArticle = async (id, authorId) => {
    try {
        const GET_ARTICLE = gql`
        query MyQuery($key: String = "") {
          Stories(key: $key) {
            edges {
              node {
                deletedAt
                isDeleted
                key
                slug
                title
                content
              }
            }
          }
        }`;

        const { data } = await query({ query: GET_ARTICLE, variables: { key: id } });
        const article = data?.Stories?.edges[0]?.node;
        return article;
    } catch (e) {
        console.log(e, '-----errror-from')
        return null;
    }
}


export default PostEditPage;