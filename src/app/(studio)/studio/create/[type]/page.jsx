import { MicroPostCreate } from "@/components/studio/create";

const CreatePage = ({ params }) => {
    const type = params?.type;
    return (
        <div className="mx-auto max-w-3xl">
            {type}
            <br className="my-2"></br>
            <MicroPostCreate />
        </div>
    );
}

export default CreatePage;