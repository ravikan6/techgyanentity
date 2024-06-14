"use server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { ApiGql_V2 } from "../connect";

// const getUserDetails = async () => {
//   const session = await getServerSession(authOptions);
//   if (!session) return null;

//   let query = `{
//         User(username: "${session.user.username}") {
//           email
//           dateJoined
//           firstName
//           fullName
//           id
//           lastName
//           picture
//           profile {
//             birthDate
//             privacy
//           }
//           username
//         }
//     }`;

//   let res = await ApiGql_V2(query, { "Authorization": process.env.API_TOKEN_V2 });
//   return res;
// }

// const userNameSave = async (data) => {
//   const session = await getServerSession(authOptions);
//   if (!session) return null;

//   let input_fields = []

//   if (data.firstName) input_fields.push(`firstName: "${data.firstName}"`);
//   if (data.lastName) input_fields.push(`lastName: "${data.lastName}"`);
//   if (data.nickname && !data.removeNickname) input_fields.push(`nickname: "${data.nickname}"`);
//   if (data.displayName) input_fields.push(`displayName: "${data.displayName}"`);
//   if (data.removeNickname) input_fields.push(`nickname: "remove"`);

//   input_fields = `{${input_fields.join(",")}}`;


//   let query = `mutation {
//     updateUser(id: "${session?.user?.id}", meta: ${input_fields || "{}"}) {
//       user{
//         firstName
//         lastName
//         fullName
//       }
//     }
//   }`;

//   console.log(query, input_fields);

//   let res = await ApiGql_V2(query, { "Authorization": process.env.API_TOKEN_V2 });
//   return res;
// }

// const userBirthDateSave = async (data) => {
//   let res = { data: null, status: 500, errors: null };
//   const session = await getServerSession(authOptions);
//   if (!session && !session.user) {
//     res = { ...res, errors: [{ message: 'Unauthorized' }] };
//     return res;
//   }

//   let highlight = data?.privacy === 'own' ? false : data?.highlight;

//   let query = `mutation BirthDayUpdate {
//     userBirthday(id: "${session?.user?.id}",date: "${data?.date}", highlight: ${highlight}, privacy: "${data?.privacy}", showYear: ${data?.showYear}) {
//       user{
//         birthday {
//           date
//           highlight
//           privacy
//           showYear
//         }
//       }
//     }
//   }`;

//   res = await ApiGql_V2(query, { "Authorization": process.env.API_TOKEN_V2 });
//   let unpack_data = res?.data?.userBirthday?.user;
//   res = { ...res, data: unpack_data };
//   return res;
// }


// export { getUserDetails, userNameSave, userBirthDateSave };


import { prisma } from "../db";
import { auth } from "../auth";

const createUser = async (data) => {
  let res = { data: null, status: 500, errors: null };
  try {
    let user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        name: data.name,
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
  try {
    let author = await prisma.author.create({
      data: {
        bio: data.bio,
        user: {
          connect: {
            id: session.user.id
          }
        }
      }
    });

    res = { ...res, data: author, status: 200};
    console.log(res);
    return res;
  } catch (e) {
    res = { ...res, errors: e.messaage, status: 400 };
    console.log(res);
    return res;
  }
}

export { createUser, getUser, createAuthor};