// @app/components/Home/HomePage.js
import React from 'react'
import { HeroBlock, HomePopular } from './HomeBlocks'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ApiGql_V2 } from '@/lib/connect'

let token_v2 = process.env.API_TOKEN_V2

// const section_GET_Started = async () => {
//   try {
//     const options = { Authorization: token_v2 }
//     const query = `{
//       home_section(uuid: "RH_0000_SECTION_NLIHS") {
//         section_data
//         section_image
//         section_status
//         title
//         id
//       }
//     }`;
//     const response = await ApiGql_V2(query, options);
//     return response;
//   }
//   catch (error) {
//     throw new Error(`Server Error: ${error.message}`);
//   }
// }

const section_GET_Trending = async () => {
  try {
    const options = { Authorization: token_v2 }
    const query = `{
      Articles {
        edges {
          node {
            content
            description
            publication
            slug
            title
            tags {
              name
              slug
              id
            }
            author {
              name
              id
              isActive
              handle
              avatar
            }
            coverImage
            createdAt
            privacyStatus
            isPublished
            publishedAt
            readTime
            updatedAt
          }
        }
      }
    }`;
    const response = await ApiGql_V2(query, options);
    return response;
  }
  catch (error) {
    throw new Error(`Server Error: ${error.message}`);
  }
}

const HomePage = async () => {
  const session = await getServerSession(authOptions);
  const getSectionData = null //await section_GET_Started();
  const sectionDataJson = null //await getSectionData?.data?.home_section;
  const sectionNonLogin = {
    title: 'Welcome to the community!',
    data: { Description: 'Get started by creating an account and joining the community.', Heading: 'Welcome to the community!', SubHeading: 'Get started by creating an account and joining the community.' },
    image: null,
  }
  const getTrendingData = await section_GET_Trending();

  return (
    <>
      {(!session && !session?.user)
        ? <HeroBlock content={sectionNonLogin} />
        : null
      }
      <HomePopular data={getTrendingData} />
      <section className="py-10">
        {/* Add more sections here */}
      </section>
    </>
  );
};

export default HomePage;