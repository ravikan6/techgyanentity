import { blogModel } from "@/models/blog";

export const getBlogs = async () => {

    const vq = await blogModel.create({
        title: "Blog Post 1",
        author: "John Doe",
        body: "This is the content of Blog Post 1",
        meta: {
            slug: "blog-post-1",
            description: "This is the description of Blog Post 1",
        },
        image: {
            url: "https://via.placeholder.com/150",
            alt: "Placeholder Image",
            storage: "cloudinary",
        },
    });

    return vq;
};