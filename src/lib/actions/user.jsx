"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ApiGql_V2 } from "../connect";

const getUserDetails = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  let query = `{
        User(username: "${session.user.username}") {
          email
          dateJoined
          firstName
          fullName
          id
          lastName
          picture
          profile {
            birthDate
            privacy
          }
          username
        }
    }`;

  let res = await ApiGql_V2(query, { "Authorization": process.env.API_TOKEN_V2 });
  return res;
}

const userNameSave = async (data) => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  let input_fields = []

  if (data.firstName) input_fields.push(`firstName: "${data.firstName}"`);
  if (data.lastName) input_fields.push(`lastName: "${data.lastName}"`);
  if (data.nickname && !data.removeNickname) input_fields.push(`nickname: "${data.nickname}"`);
  if (data.displayName) input_fields.push(`displayName: "${data.displayName}"`);
  if (data.removeNickname) input_fields.push(`nickname: "remove"`);

  input_fields = `{${input_fields.join(",")}}`;


  let query = `mutation {
    updateUser(id: "${session?.user?.id}", meta: ${input_fields || "{}"}) {
      user{
        firstName
        lastName
        fullName
      }
    }
  }`;

  console.log(query, input_fields);

  let res = await ApiGql_V2(query, { "Authorization": process.env.API_TOKEN_V2 });
  return res;
}

const userBirthDateSave = async (data) => {
  let res = { data: null, status: 500, errors: null };
  const session = await getServerSession(authOptions);
  if (!session && !session.user) {
    res = { ...res, errors: [{ message: 'Unauthorized' }] };
    return res;
  }

  let highlight = data?.privacy === 'own' ? false : data?.highlight;

  let query = `mutation BirthDayUpdate {
    userBirthday(id: "${session?.user?.id}",date: "${data?.date}", highlight: ${highlight}, privacy: "${data?.privacy}", showYear: ${data?.showYear}) {
      user{
        birthday {
          date
          highlight
          privacy
          showYear
        }
      }
    }
  }`;

  res = await ApiGql_V2(query, { "Authorization": process.env.API_TOKEN_V2 });
  let unpack_data = res?.data?.userBirthday?.user;
  res = { ...res, data: unpack_data };
  return res;
}


export { getUserDetails, userNameSave, userBirthDateSave };