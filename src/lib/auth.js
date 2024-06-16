import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Auth0 from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Google,
        Auth0({
            clientId: process.env.AUTH_AUTH0_ID,
            clientSecret: process.env.AUTH_AUTH0_SECRET,
            issuer: process.env.AUTH_AUTH0_DOMAIN
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await prisma.user.findUnique({
                        where: {
                            email: credentials.identifier,
                        },
                    });
                    if (response) {
                        return { ...response, password: undefined };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error(error); //TODO: Will be removed in production
                    return null;
                }
                // return Promise.resolve(credentials)
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

    pages: {
        signIn: `/auth/v2/login`,
    },
    secret: process.env.NEXTAUTH_SECRET
});