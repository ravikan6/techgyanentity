"use server";
import { prisma } from "../db";
import { auth } from "../auth";
import { hashPassword } from "../helpers";

const createUser = async (data) => {
  let res = { data: null, status: 500, errors: null };
  try {
    if (!data.email || !data.name) {
      res = { ...res, errors: "Missing required fields", status: 400 };
      return res;
    }

    let alUser = await prisma.user.findUnique({
      where: {
        email: data.email,
        ...data.username && { username: data.username }
      }
    });

    if (alUser) {
      res = { ...res, errors: "User already exists", status: 400 };
      return res;
    }

    if (data.password) {
      let password = await hashPassword(data.password);
      data.password = password
    }

    let user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
        password: data.password
      }
    });

    res = { ...res, data: user };
    console.log(res);
    return res;
  } catch (e) {
    res = { ...res, errors: e.messaage, status: 400 };
    console.log(res);
    return res;
  }
}

const getUser = async (id) => {
  let res = { data: null, status: 500, errors: null };
  let user = await prisma.user.findUnique({
    where: {
      id: id
    }
  });

  res = { ...res, data: user };
  return res;
}

const createAuthor = async (data) => {
  const session = await auth();
  let res = { data: null, status: 500, errors: null };

  if (!session) {
    res = { ...res, errors: "Unauthorized", status: 401 };
    return res
  }

  if (!data.name || !data.handle) {
    res = { ...res, errors: "Missing required fields", status: 400 };
    return res;
  }

  try {
    let author = await prisma.author.create({
      data: {
        name: data.name,
        handle: data.handle,
        bio: data.bio,
        contactEmail: data.contactEmail,
        user: {
          connect: {
            id: session.user.id
          }
        },
        ...data.links && { social: { set: data.links } }
      }
    });

    res = { ...res, data: author, status: 200 };
    console.log(res);
    return res;
  } catch (e) {
    res = { ...res, errors: e.messaage, status: 400 };
    console.log(res);
    return res;
  }
}

const getUserAuthors = async () => {
  let res = { data: null, status: 500, errors: null };
  const session = await auth();
  const id = session?.user?.id;
  let authors = await prisma.author.findMany({
    where: {
      userId: id
    }
  });

  res = { ...res, data: authors };
  console.log(res, 'res from getUserAuthors');
  return res;
}

export { createUser, getUser, createAuthor, getUserAuthors };