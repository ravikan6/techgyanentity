"use server";
import { prisma } from "../db";
import { auth } from "../auth";
import { hashPassword } from "../helpers";
import { getCldImageUrl } from "next-cloudinary";
import { deleteCloudinaryImage, uploadImage } from "./upload";
import { cloudinaryProvider } from "./author";

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
        ...(data.username && { username: data.username })
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

  if (!data?.name) {
    res = { ...res, errors: "Missing required fields", status: 400 };
    return res;
  }

  let handle = data.handle ? data.handle : data.name.toLowerCase().replace(/\s/g, '-') + Math.random().toString(36).substring(2, 7);

  const handleGen = async (handle) => {
    while (true) {
      let author = await prisma.author.findUnique({
        where: {
          handle: handle
        },
        select: {
          id: true
        }
      });
      if (!author) {
        return handle;
      }
      handle = data.name.toLowerCase().replace(/\s/g, '-') + Math.random().toString(36).substring(2, 7);
    }
  }

  handle = await handleGen(handle);

  try {
    let author = await prisma.author.create({
      data: {
        name: data.name,
        handle: handle,
        user: {
          connect: {
            id: session.user.id
          }
        },
      },
      select: {
        handle: true,
        id: true,
        name: true,
      }
    });

    res = { ...res, data: author, status: 200 };
    return res;
  } catch (e) {
    res = { ...res, errors: e.messaage, status: 400 };
    return res;
  }
}

const getUserAuthors = async () => {
  let res = { data: null, status: 500, errors: null };
  const session = await auth();
  const id = session?.user?.id;
  let authors = await prisma.author.findMany({
    where: {
      userId: id,
    },
  });

  authors = authors.map((author) => {
    return {
      ...author,
      image: author?.image?.url && getCldImageUrl({ src: author?.image?.url }),
    };
  });

  res = { ...res, data: authors };
  return res;
}

const userImage = async (files) => {
  let res = { data: null, status: 500, errors: [] };
  try {
    const session = await auth();
    if (!session || !session.user) {
      res = { ...res, errors: [{ message: 'Unauthorized' }] };
      return res;
    }

    let user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        image: true
      }
    });

    let logo = files.get('image')
    logo = logo == 'undefined' ? null : logo == 'null' ? null : logo;

    let rmLogo = files.get('rm') ? files.get('rm') : 'false';

    let imageData = null;

    if (!!logo && (rmLogo == 'false')) {
      try {
        let logoData = await uploadImage(logo);
        if (logoData?.success) {
          imageData = await cloudinaryProvider(logoData.data);
          if (user?.image?.url) {
            let rmData = await deleteCloudinaryImage(user?.image?.url);
            if (!rmData?.success) {
              throw new Error(rmData?.message);
            }
          }
        } else {
          throw new Error(logoData?.message);
        }
      } catch (error) {
        console.log('Error in user Image upload:', error);
        res.errors.push({ message: 'An error occurred while uploading Image. Please try again later.' });
        imageData = null;
      }
    } else {
      if (user?.image?.url && rmLogo == 'true') {
        try {
          let logoData = await deleteCloudinaryImage(user?.image?.url);
          if (logoData?.success) {
            imageData = 'rm';
          } else {
            throw new Error(logoData?.message);
          }
        } catch (error) {
          console.log({ message: 'An error occurred while removeing image. Please try again later.' });
          imageData = null;
        }
      }
    }

    if (imageData) {
      user = await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          ...(imageData ? (imageData == 'rm' ? { image: null } : { image: { set: imageData } }) : null),
        }
      });

      user.image = user?.image?.url && getCldImageUrl({ src: user?.image?.url });
      res = { ...res, data: user, status: 200 };
    }
    return res;
  } catch (error) {
    console.error('Error in updateAuthorImagesAction:', error);
    res.errors.push({ message: 'An error occurred while updating profile picture. Please try again later.' });
    return res;
  }

}

const updateUserBasic = async (data) => {
  let res = { data: null, status: 500, errors: [] };
  try {
    const session = await auth();
    if (!session || !session.user) {
      res = { ...res, errors: [{ message: 'Unauthorized' }] };
      return res;
    }

    let user = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name: data?.name,
        username: data?.username,
        dob: data?.dob,
        sex: data?.sex
      }, select: {
        id: true,
        name: true,
        username: true,
        dob: true,
        sex: true
      }
    });

    res = { ...res, data: user, status: 200 };
    return res;
  } catch (error) {
    console.error('Error in updateUserBasic:', error);
    res.errors.push({ message: 'An error occurred while updating profile. Please try again later.' });
    return res;
  }
}

const getUserBookmarks = async (params) => {
  let res = { data: null, status: 500, errors: [] };
  try {
    let posts = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        bookmarks: {
          where: {
            isDeleted: false,
            privacy: 'PUBLIC',
            published: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: params?.take || 5,
          skip: params?.skip || 0,
          ...(params?.cursor && {
            cursor: {
              shortId: params.cursor,
            }
          }),
          select: {
            title: true,
            slug: true,
            shortId: true,
            image: true,
            publishedAt: true,
            description: true,
            author: {
              select: {
                name: true,
                handle: true,
                image: true,
              }
            },
            _count: {
              select: {
                claps: true,
                comments: {
                  where: {
                    parent: null,
                    isDeleted: false,
                  }
                }
              }
            },
            tags: true,
          }
        }
      }
    })
    res.data = posts;
    res.status = 200;
  } catch (e) {
    res.errors.push({ message: JSON.stringify(e) });
  }
  return res;
}


const getUserClappedPost = async (params) => {
  let res = { data: null, status: 500, errors: [] };
  try {
    let posts = await prisma.postClap.findMany({
      where: {
        userId: params.userId,
        post: {
          isDeleted: false,
          privacy: 'PUBLIC',
          published: true,
        }
      },
      orderBy: {
        createdAt: params?.order || 'desc',
      },
      take: params?.take || 5,
      skip: params?.skip || 0,
      ...(params?.cursor && {
        cursor: {
          postId: params.cursor,
        }
      }),
      select: {
        post: {
          select: {
            title: true,
            slug: true,
            shortId: true,
            image: true,
            publishedAt: true,
            description: true,
            author: {
              select: {
                name: true,
                handle: true,
                image: true,
              }
            },
            _count: {
              select: {
                claps: true,
                comments: {
                  where: {
                    parent: null,
                    isDeleted: false,
                  }
                }
              }
            },
            tags: true,
          }
        }
      }
    })

    res.data = posts;
    res.status = 200;
  } catch (e) {
    res.errors.push({ message: JSON.stringify(e) });
  }
  return res;
}

export { createUser, getUser, createAuthor, getUserAuthors, userImage, updateUserBasic, getUserBookmarks, getUserClappedPost };