// import { PrismaClient } from '@prisma/client/edge'
import { PrismaClient as PrismaClientCore } from '@prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'

export const prismaNon = new PrismaClientCore({
    datasourceUrl: process.env.DATABASE_URL,
})


// export const prisma = new PrismaClient().$extends(withAccelerate())