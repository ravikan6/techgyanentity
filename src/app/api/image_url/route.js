import { v2 as cloudinary } from 'cloudinary';

export async function GET(request) {
    try {

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id')
        let res = await cloudinary.api.resource(id, { colors: true });
        const data = await res;

        return Response.json({ data })
    }
    catch (error) {
        return Response.error({})
    }
}