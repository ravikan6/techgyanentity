import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Auth0 from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";
import { apiGql } from "./resolver";
import { cookies } from "next/headers";

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
                    const response = await apiGql(`
                            mutation UserLogin {
                                login(email: "${credentials.identifier}", password: "${credentials.password}") {
                                  user {
                                    image
                                    key
                                    name
                                    username
                                    email
                                  }
                                  sessionId
                                  success
                                }
                        }`
                    );
                    if (response.data && response.data.login.success) {
                        cookies().set('sessionid', response.data.login.sessionId, {
                            httpOnly: true,
                            sameSite: 'None',
                            secure: true,
                        });
                        return {
                            ...response.data.login.user,
                            sessionId: response.data.login.sessionId
                        }
                    } else {
                        throw new Error("Invalid credentials");
                    }
                } catch (error) {
                    console.log(error?.message, '_________________________error_from_auth_creditainls'); //TODO: Will be removed in production
                    return null;
                }
            }
        }),
    ],
    // cookies: {
    //     sessionToken: {
    //         name: `__Secure-RSSID`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: true
    //         }
    //     },
    //     callbackUrl: {
    //         name: `__Secure-RSCBURL`,
    //         options: {
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: true
    //         }
    //     },
    //     csrfToken: {
    //         name: `__Host-RHCSRF`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: true
    //         }
    //     },
    // },
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
            if (token.id) {
                try {
                    const response = await apiGql(`
                        query Me {
                            Me {
                                name
                                image {
                                    url
                                }
                                username
                                email
                                creatorSet {
                                  edges {
                                    node {
                                      key
                                    }
                                  }
                                }
                            }
                        }`,
                        {
                            'Cookie': `sessionid=${token.sessionId}`
                        }
                    );
                    if (response.data && response.data.Me) {
                        response.data.Me.image = response.data.Me.image?.url || null;
                        if (response.data.Me.creatorSet.edges.length > 0) {
                            response.data.Me.creators = response.data.Me.creatorSet.edges.map(({ node }) => ({ key: node.key }));
                        } else {
                            response.data.Me.creators = [];
                        }

                        token = {
                            ...token,
                            name: response.data.Me.name,
                            image: response.data.Me.image,
                            username: response.data.Me.username,
                            email: response.data.Me.email,
                            creators: response.data.Me.creators,
                            authors: response.data.Me.creators
                        }
                    }
                } catch (error) {
                    console.log("Error from auth callback:", JSON.stringify(error)) //TODO: Will be removed in production
                }
            }
            return Promise.resolve(token)
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                name: token.name,
                image: token.image,
                username: token.username,
                email: token.email,
                creators: token.creators,
                authors: token.authors,
                sessionId: token.sessionId
            }
            return Promise.resolve(session)
        },
    },
    pages: {
        signIn: `/auth/v2/login`,
    },
    secret: process.env.NEXTAUTH_SECRET
});

