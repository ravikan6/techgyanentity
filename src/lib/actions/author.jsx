import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";


const updateAuthorAction = async (id, data = {}) => {
    let res = { data: null, status: 500, errors: null };
    const session = await auth();;
    if (!session && !session.user) {
        res = { ...res, errors: [{ message: 'Unauthorized' }] };
        return res;
    }

    try {
        let author = await prisma.author.update({
            where: { id: id },
            data: {
                ...data,
            }
        });
        console.log(res, '______________res____________from______________updateAuthorAction')
        res = { ...res, data: author }
    } catch (error) {
        console.log(error, '______________error____________from______________updateAuthorAction')
        res = { ...res, errors: [{ message: error }] };
    }
    return res;
}

export { updateAuthorAction }