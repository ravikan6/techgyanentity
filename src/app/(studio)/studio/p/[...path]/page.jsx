import { CreatePost } from '@/components/post/create'
import React from 'react'

const PostEditPage = ({ params }) => {
    const { path } = params;

    if (path?.length === 2) {
        if (path[1] === 'editor') {
            const id = path[0];
            return (
                <div className='pt-10'>
                    <CreatePost id={id} />
                </div>
            )
        } else if (path[1] === 'edit') {
            return (
                <div>
                    Welocme to the post details page for editing, here you can edit the post
                </div>
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