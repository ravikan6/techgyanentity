// import { PrismaClient } from '@prisma/client/edge'
import { PrismaClient as PrismaClientCore } from '@prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClientCore({
    datasourceUrl: process.env.DATABASE_URL,
})


// export const prismaEdge = new PrismaClient({
//     datasourceUrl: process.env.EDGE_DATABASE_URL,
// }).$extends(withAccelerate())