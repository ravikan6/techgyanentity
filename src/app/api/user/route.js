import { prisma } from "@/lib/db";
import { getCImageUrl } from "@/lib/helpers";

export async function POST(request) {
    try {
        const formData = await request.formData()
        const id = await formData.get('id')
        const response = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                Author: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (response?.image?.url) {
            response.image = await getCImageUrl(response?.image?.url)
        }
        const data = { ...response, password: null };

        return Response.json({ data })
    } catch (error) {
        console.error(error); //TODO: Will be removed in production
        return Response.json({})
    }
}


// const url = headers().get('origin') || process.env.APP_URL;
// let fdata = new FormData();
// fdata.append('id', token.id);
// const res = await fetch(`${url}/api/user`, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//     },
//     body: fdata,
//     next: {
//         revalidate: 10,
//     }
// });
// const response = await res.json();