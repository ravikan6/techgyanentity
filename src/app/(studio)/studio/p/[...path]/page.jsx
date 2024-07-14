import { CreatePost } from '@/components/post/create'
import PostDetailsEditor from '@/components/studio/write/_post-details';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

const PostEditPage = async ({ params }) => {
    const session = await auth();
    const { path } = params;

    if (path?.length === 2) {
        if (path[1] === 'editor') {
            const id = path[0];
            try {
                let data = await prisma.post.findUnique({
                    where: {
                        shortId: id,
                        isDeleted: false,
                    },
                    select: {
                        title: true,
                        content: true,
                        shortId: true,
                    },
                })
                if (data) {
                    return (
                        <div className='pt-10'>
                            <CreatePost data={data} />
                        </div>
                    )
                } else {
                    throw new Error('Post not found')
                }
            } catch (error) {
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

export default PostEditPage;