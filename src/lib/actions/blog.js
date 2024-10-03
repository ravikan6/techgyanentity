"use server";
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { generateUniqueId } from '../helpers';
import { deleteCloudinaryImage, uploadImage } from './upload';
import { cloudinaryProvider } from './author';
import { gql } from '@apollo/client';
import { api, query } from '../client';

import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

export const getBlogs = async () => {

    // const dt = await prisma.post.create({
    //     data: {
    //         slug: 'the-blog-post',
    //         title: "Blog Post 1",
    //         body: "This is the content of Blog Post 1"
    //     }})

    return {};
};

export const createPostAction = async (data) => {
    const session = await auth();
    const author = await prisma.author.findFirst({
        where: {
            userId: session.user.id,
        },
    });
    const tags = data.tags ? data.tags.split(',') : [];
    try {
        const newPost = await prisma.post.create({
            data: {
                slug: data.slug,
                title: data.title,
                content: data.content,
                authorId: author.id,
                published: data.published,
                privacy: data.privacy,
                tags: tags,
                image: {
                    set: {
                        url: data.imageUrl,
                        alt: data.imageAlt,
                    },
                },
            },
        });
        console.log(newPost)
        return newPost;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }

}

export const handleCreatePostRedirectAction = async (authorId) => {
    const session = await auth();
    if (!session.user) {
        redirect('/auth/v2/signin');
    }
    if (!authorId) {
        redirect('/setup/author');
    }
    try {
        if (session?.user?.Author?.find((a) => a.id === authorId)) {
            let sId = generateUniqueId(12);
            const p = await prisma.post.create({
                data: {
                    title: 'Untitled',
                    author: {
                        connect: {
                            id: authorId,
                        },
                    },
                    slug: `post-${sId}`,
                    published: false,
                    content: [],
                    shortId: sId,
                }
            });
            if (p.shortId)
                return { status: 200, url: `/${process.env.STUDIO_URL_PREFIX}/p/${p.shortId}/editor` };
            else throw new Error('An error occurred while creating the post. Please try again later.');
        } else {
            throw new Error('Unauthorized');
        }
    } catch (error) {
        console.error("Error creating post:", error);
        return { status: 500, message: error.message };
    }
}

export const updatePostAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    const UPDATE_POST = gql`
    mutation MyMutation($key: String = "", $content: String = "", $title: String = "") {
      updateStory(data: { title: $title, content: $content }, key: $key) {
        story {
          content
          title
        }
      }
    }`;

    try {
        let client = await api();
        const { data: updatedPost, errors } = await client.mutate({
            mutation: UPDATE_POST,
            variables: {
                key: data.key,
                content: data.content,
                title: data.title,
            },
            errorPolicy: 'all',
        });
        if (updatedPost?.updateStory?.story) {
            res = { ...res, data: updatedPost?.updateStory?.story, status: 200 };
        }

        res = { ...res, errors: errors || [] };

        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

const UPDATE_POST = gql`
mutation MyMutation($key: String = "", $category: String = "", $description: String = "", $privacy: PrivacyEnum = PUBLIC, $state: StateEnum = DRAFT, $tags: [String] = "", $title: String = "", $slug: String = "", $doPublish: Boolean = false, $image: ImageInput) {
  updateStory(
    data: {
      category: $category
      description: $description
      doPublish: $doPublish
      privacy: $privacy
      state: $state
      tags: $tags
      title: $title
      slug: $slug
      image: $image
    }
    key: $key
  ) {
    story {
      title
      updatedAt
      state
      slug
      scheduledAt
      publishedAt
      privacy
      key
      isDeleted
      id
      description
      deletedAt
      createdAt
      content
      image {
        id
        url
        caption
      }
      category {
        name
        id
      }
      tags {
        name
        id
      }
    }
  }
}`;

export const updatePostDetailsAction = async (data) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    let setter = { ...data?.data };
    let file = data?.file ? data?.file : new FormData();
    let cat = setter?.category?.id;
    let tags = setter?.tags.map((t) => t.name);
    delete setter.category;
    if (setter?.doPublish) {
        setter.state = 'PUBLISHED';
    }

    if (file.has('image') && setter?.image?.provider === 'file') {
        let image = file.get('image')
        try {
            let ftImage = await uploadImage(image);
            if (ftImage.success) {
                ftImage = await cloudinaryProvider(ftImage?.data);
                setter.image = { ...data?.data?.image, ...ftImage }
            } else {
                throw new Error(ftImage?.message);
            }
        } catch (error) {
            res.errors.push({ message: 'An error occurred while uploading post Image. Please try again later.' });
            setter?.image?.url && delete setter.image.url;
            setter?.image?.provider && delete setter.image.provider;
            setter?.image?.action && delete setter.image.action;
        }
    }

    try {
        let vars = {
            key: data.key,
            category: cat || null,
            description: setter?.description,
            privacy: setter?.privacy,
            state: setter?.state,
            tags: tags,
            title: setter?.title,
            slug: setter?.slug,
            doPublish: setter?.doPublish || false,
            image: setter?.image?.url ? {
                url: setter?.image?.url,
                provider: setter?.image?.provider,
                action: setter?.image?.action || 'UPDATE',
                id: setter?.image?.id,
            } : null,
        }
        let client = await api();
        const { data: updatedPost, errors } = await client.mutate({
            mutation: UPDATE_POST,
            variables: vars,
            errorPolicy: 'all',
        });
        if (updatedPost?.updateStory?.story) {
            res = { ...res, data: updatedPost?.updateStory?.story, status: 200 };
        }

        res = { ...res, errors: errors || [] };

        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

export const deletePostAction = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }
    try {
        const deletedPost = await prisma.post.update({
            where: {
                shortId: id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })
        res = { ...res, data: deletedPost.isDeleted, status: 200 };
        return res;
    } catch (error) {
        res.errors.push({ message: error.message });
        return res;
    }
}

export const getDrafts = async (authorId) => {
    const session = await auth();

    const drafts = await prisma.post.findMany({
        where: {
            authorId: authorId,
            published: false,
        },
    });
    return drafts;
}

const getAuthorPosts = async (authorId) => {
    let res = { data: null, status: 500, errors: [] };
    const session = await auth();
    if (!session || !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let posts = await prisma.post.findMany({
            where: {
                authorId: authorId,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: false,
                title: true,
                description: true,
                shortId: true,
                slug: true,
                image: {
                    select: {
                        url: true,
                        alt: true,
                    }
                },
                published: true,
                privacy: true,
                publishedAt: true,
                createdAt: true,
                _count: {
                    select: {
                        claps: true,
                        comments: {
                            where: {
                                parent: {
                                    is: null,
                                },
                                isDeleted: false,
                            }
                        }
                    }
                }
            },

        });
        if (posts) {
            res = { ...res, data: posts, status: 200 };
        }
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

const getArticleContent = async (id) => {
    let res = { data: null, status: 500, errors: [] };
    try {
        let content = await prisma.post.findUnique({
            where: {
                shortId: id,
            },
            select: {
                content: true,
            },
        });
        if (content) {
            res = { ...res, data: content.content, status: 200 };
        }
        return res;
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

const GET_ARTICLE_WITH_CATEGORIES = gql`
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
  Categories {
    id
    name
  }
}`;

const getArticledetails = async (key, authorKey, alsoCat) => {
    let res = { data: null, status: 500, errors: [], categories: [] };

    try {
        let article = await query({ query: GET_ARTICLE_WITH_CATEGORIES, variables: { key: key, author_Key: authorKey } });
        if (article?.data?.Stories?.edges[0]?.node) {
            res = { ...res, data: article?.data?.Stories?.edges[0]?.node, status: 200 };
            if (alsoCat && article?.data?.Categories) {
                res = { ...res, categories: article?.data?.Categories };
            }
            return res;
        } else {
            throw new Error('Post not found');
        }
    } catch (e) {
        res.errors.push({ message: e.message });
        return res;
    }
}

export { getAuthorPosts, getArticleContent, getArticledetails }