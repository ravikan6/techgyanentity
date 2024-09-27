import { StudioWriteEditorWrapper, StudioWriteLayoutWrapper } from "@/components/studio/wrappers";
import { WriteHeader } from "@/components/studio/write/_header_focus";
import { DecryptAuthorIdStudioCookie } from "@/lib/actions/studio";
import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'
import { gql } from "@apollo/client";
import { query } from "@/lib/client";

const WriteLayout = async ({ children, params }) => {
    const { path } = params;

    try {

        if (path?.length === 2) {
            let cookies = headers().get('cookie');
            cookies = cookies?.split(';').find(c => c.trim().startsWith('__Secure-RSUAUD='));
            cookies = cookies?.split('=')[1];
            cookies = decodeURIComponent(cookies);
            const author = await DecryptAuthorIdStudioCookie(cookies);
            if (!author.key) {
                redirect('/studio/content')
            }
            const article = await getArticle(path[0], author?.key);
            console.log(article, '----article')
            if (!article) {
                redirect('/studio/content')
            }
            return (
                <StudioWriteLayoutWrapper article={article} >
                    {path[1] === 'editor' ? <StudioWriteEditorWrapper> <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[1000] bg-light dark:bg-dark">
                        <WriteHeader />
                        <div className="w-full h-full overflow-y-auto">
                            <div className="max-w-[640px] w-full px-2 sm:px-0 mx-auto mt-[56px]">
                                {children}
                            </div>
                        </div>
                    </div> </StudioWriteEditorWrapper> : <div className="max-w-7xl py-4 w-full mx-auto">
                        {children}
                    </div>}
                </StudioWriteLayoutWrapper>
            )
        }
    } catch (error) {
        console.log(error)
        redirect('/studio/content')
    }

    return (
        <div>
            <h1>Write Page</h1>
        </div>
    )
}

const GET_ARTICLE = gql`
query GetAuthorArticle($key: String!, $author_Key: String!) {
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
}`;

const getArticle = async (id, authorId) => {
    try {
        const { data } = await query({ query: GET_ARTICLE, variables: { key: id, author_Key: authorId } });
        const article = data?.Stories?.edges[0]?.node;
        return article;
    } catch (e) {
        return null;
    }
}

export default WriteLayout;