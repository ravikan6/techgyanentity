import { CreatePost } from "@/components/post";

const CreatePage = ({ params }) => {
    const type = params?.type;
    if (type === 'post') {
        return (
            <div className="mx-auto max-w-3xl my-5">
                <CreatePost />
            </div>
        );
    }
    return (
        <div className="mx-auto max-w-3xl">
            {type}
        </div>
    )
}

export default CreatePage;