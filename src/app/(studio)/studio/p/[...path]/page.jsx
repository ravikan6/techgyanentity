import { CreatePost } from '@/components/post/create'
import React from 'react'

const WritePage = ({ params }) => {
    const { path } = params;

    if (path?.length === 2) {
        if (path[1] === 'editor') {
            const id = path[0];
            return (
                <div className='pt-10'>
                    <CreatePost id={id} />
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

export default WritePage;