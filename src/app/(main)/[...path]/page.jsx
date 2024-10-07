import { auth } from '@/lib/auth';
import { query } from '@/lib/client';
import { notFound } from 'next/navigation';
import { StoryView } from '@/components/story';
import { GET_CREATOR_STORY } from '@/lib/types/story';
import { GET_CREATOR_FOR_OG, VERIFY_GET_AUTHOR } from '@/lib/types/creator';
import { getPostBykey } from '@/lib/actions/getters/content';
import { CreatorAboutView } from '@/components/creator';
import { PostView } from '@/components/post';
import { getUserClappedStories } from '@/lib/actions/getters/user';
import { ClappedStoriesPageView } from '@/components/user/lists';

export async function generateMetadata({ params, searchParams }) {
    const route = params.path;
    const path = decodeURIComponent(params?.path[0]);
    const session = await auth();

    if (path.startsWith('story') && route?.length === 2) {
        const meta = await articleMeta(route[1]);
        return meta;
    } else if (path === 'list') {
        if ((searchParams?.type === 'bookmarks') && session?.user?.id) {
            return {
                title: 'Bookmarks',
                description: 'Your bookmarked posts',
            }
        } else if ((searchParams?.type === 'clapped') && session?.user?.id) {
            return {
                title: 'Clapped Posts',
                description: 'Posts you clapped',
            }
        }
    } else {
        let creator = await getCreatorForOg(path);

        if (creator) {
            if (route?.length === 1) {
                return {
                    title: creator?.name,
                    description: creator?.description,
                    openGraph: {
                        title: creator?.name,
                        description: creator?.description,
                        siteName: process.env.APP_NAME,
                        ...creator?.image && {
                            images: [
                                {
                                    url: creator?.image?.url,
                                    width: 800,
                                    height: 600,
                                },
                            ]
                        },
                        locale: 'en_US',
                        type: 'profile',
                    }
                }
            } else if (route?.length === 2) {
                return await articleMeta(route[1]);
            }
        } else {
            return { title: 'Not Found', description: 'Page not found' }
        }
    }
}

async function getCreatorForOg(path) {
    let handle = await path.startsWith('@') ? path.slice(1) : path
    try {
        let { data, error } = await query({
            query: GET_CREATOR_FOR_OG,
            variables: {
                handle: String(handle),
            }
        })
        if (await data && data.Creators?.edges?.at(0)?.node) {
            return data.Creators?.edges?.at(0)?.node;
        }
        return null
        // ..
    } catch (e) {
        console.log(e, '___while getting author og.')
        return null;
    }
}

const DynamicPages = async ({ params, searchParams }) => {
    const session = await auth();
    const route = params.path;
    const path = decodeURIComponent(params?.path[0]);

    if (path.startsWith('story') && route?.length === 2) {
        const story = await getArticle(decodeURIComponent(route[1]))
        if (story) {
            return (
                <StoryView story={story} />
            )
        }
    } else if (path === 'list') {
        if ((searchParams?.type === 'bookmarks') && session?.user?.id) {
            // --- Stories saved by User
        } else if ((searchParams?.type === 'clapped') && session?.user?.id) {
            let stories = await getUserClappedStories({ after: null, limit: 10 });
            return <ClappedStoriesPageView clappedStories={stories.data} />
        }
    } else {
        const creator = await getCreator(path)
        if (creator) {
            if (route?.length === 1) {
                return (
                    <span>This is Creators Home Page</span>
                )
            } else if (route?.length === 3 && route[1] === 'post') {
                const post = await getPostBykey(route[2]);
                if (!post.success) return notFound();
                return (
                    <PostView post={post.data} />
                )
            } else if (route?.length === 2 && route[1] === 'about') {
                return <CreatorAboutView />
            } else if (route?.length === 2 && route[1] === 'posts') {
                // Creator Posts
            }
            else if (route?.length === 2) {
                const story = await getArticle(decodeURIComponent(route[1]), creator.key)
                if (story) {
                    return (
                        <StoryView story={story} />
                    )
                }
            }
        }
        return notFound();
    }
};

const getArticle = async (slug, key) => {
    try {
        let { data, errors } = await query({
            query: GET_CREATOR_STORY,
            variables: {
                slug: slug,
                author_Key: key
            }
        })

        if (await data && data.Stories?.edges[0]?.node) {
            let story = await data.Stories?.edges[0]?.node
            return story;
        }
    } catch (error) {
        console.error(error);
        return null
    }
}

const getCreator = async ([path]) => {
    let handle = path?.startsWith('@') ? path.slice(1) : path;

    try {
        let { data, errors } = await query({
            query: VERIFY_GET_AUTHOR,
            variables: {
                handle: handle
            }
        })

        if (await data && data.Creators?.edges[0]?.node) {
            let res = await data.Creators?.edges[0]?.node;
            console.log('Getting Creator in Page', data.Creators?.edges)
            return res;
        }
    } catch (e) {
        return null;
    }
}

const articleMeta = async (slug) => {
    const story = await getArticle(decodeURIComponent(slug))
    return {
        title: story?.title,
        description: story?.description,
        openGraph: {
            title: story?.title,
            description: story?.description,
            siteName: process.env.APP_NAME,
            ...(story?.image && {
                images: [
                    {
                        url: story.image.url,
                        width: 800,
                        height: 600,
                    },
                ]
            }),
            locale: 'en_US',
            type: 'article',
            publishedTime: story?.publishedAt,
            authors: [story?.author?.name]
        }
    };
}

export default DynamicPages;