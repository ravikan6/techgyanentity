import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Auth0 from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Auth0({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_DOMAIN
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                return Promise.resolve(credentials)
                // try {
                //   const mutation_query = `mutation {
                //     UserAuthentication(
                //       identifier: "${credentials.identifier}"
                //       password: "${credentials.password}"
                //     ) {
                //       jwt
                //       user {
                //         email
                //         id
                //         username
                //         dateJoined
                //         name
                //         lastLogin
                //         isActive
                //         name
                //         image
                //       }
                //     }
                //   }`;
                //   const options = { Authorization: `${process.env.API_TOKEN_V2}` }
                //   const response = await ApiGql_V2(mutation_query, options);

                //   if (response?.data && response?.data?.UserAuthentication) {
                //     const data = response.data.UserAuthentication;
                //     console.log(data, '-- data from backend login');
                //     return {
                //       id: data.user.id,
                //       username: data.user.username,
                //       email: data.user.email,
                //       last_login: data.user?.lastLogin,
                //       joined: data.user.dateJoined,
                //       name: data.user?.name,
                //       is_active: data.user.isActive,
                //       picture: data.user?.image,
                //       image: data.user?.image,
                //       jwt: data.jwt
                //     };
                //   } else {
                //     return null;
                //   }
                // } catch (error) {
                //   console.error(error); //TODO: Will be removed in production
                //   return null;
                // }
            }
        }),
    ],
    cookies: {
        sessionToken: {
            name: `__Secure-RSSID`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        callbackUrl: {
            name: `__Secure-RSCBURL`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        csrfToken: {
            name: `__Host-RHCSRF`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
    },
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user, account }) {
            const isSignIn = user ? true : false
            if (isSignIn && account) {
                if (account.provider === "credentials") {
                    try {
                        token = { ...token, ...user }
                    } catch (error) {
                        console.error("Server Error:", error) //TODO: Will be removed in production
                    }
                } else {
                    // TODO: Add other providers (Google, Auth0, etc. {Using V2 API})
                }
            }
            //   if (token.id) {
            //     let query = `query userSessionData {
            //       User(id: "${token.id}") {
            //         isActive
            //         username
            //         name
            //         image
            //       }
            //     }`

            //     let data = await ApiGql_V2(query, { 'Authorization': `${process.env.API_TOKEN_V2}` })
            //     let userData = await data?.data?.User || null;
            //     if (userData) {
            //       token = {
            //         ...token,
            //         name: userData?.fullName,
            //         ...userData
            //       }
            //     }
            //   }
            return Promise.resolve(token)
        },
        async session({ session, token }) {
            session.user = token
            return Promise.resolve(session)
        },
    },

    // pages: {
    //     signIn: `/auth/v2/login`,
    // },
    secret: process.env.NEXTAUTH_SECRET
});