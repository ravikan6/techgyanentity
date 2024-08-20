import { prisma } from "@/lib/db";
import { getCImageUrl } from "@/lib/helpers";
import { AuthorSingleViewPage } from "@/components/author/view";

export const authorPageRoutes = ['about', 'followers', 'following', 'posts',];

const DynamicMainLayout = async ({ params, searchParams, children }) => {
    const route = params.path;
    const path = decodeURIComponent(params?.path[0]);
    const query = searchParams;


    if (route?.length <= 2 && route?.length > 0) {
        const author = await getAuthor(path)
        if (author) {
            if ((route?.length === 1) || (route?.length === 2 && authorPageRoutes.includes(route[1]))) {
                return <AuthorSingleViewPage author={author} >
                    {children}
                </AuthorSingleViewPage>
            } else {
                return children;
            }
        } else return children;
    } else {
        return children;
    }

};


const getAuthor = async (handle) => {
    handle = await handle?.startsWith('@') ? handle.slice(1) : handle;

    try {
        let author = await prisma.author.findFirst({
            where: {
                handle: handle,
            },
            select: {
                id: true,
                shortId: true,
                handle: true,
                name: true,
                bio: true,
                social: true,
                image: true,
                banner: true,
                isDeleted: true,
                _count: {
                    select: {
                        followers: true,
                        Post: {
                            where: {
                                isDeleted: false,
                                published: true,
                                privacy: {
                                    equals: 'PUBLIC',
                                }
                            }
                        }
                    }
                }
            }
        })

        if (author && !author.isDeleted) {
            (author?.image?.provider === 'cloudinary' && author?.image?.url) && (author.image.url = await getCImageUrl(author.image.url));
            (author?.banner?.provider === 'cloudinary' && author?.banner?.url) && (author.banner.url = await getCImageUrl(author.banner.url));
            return author;
        }
    } catch (e) {
        return null;
    }
}


export default DynamicMainLayout;