import { prisma } from "@/lib/db";
import { getCImageUrl } from "@/lib/helpers";

export async function POST(request) {
    try {
        const formData = await request.formData()
        const id = formData.get('id')
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