"use server";
import { HttpLink } from "@apollo/client";
import {
    registerApolloClient,
    ApolloClient,
    InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { auth } from "./auth";

const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://techgyan.collegejaankaar.in/api/";

const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
    const session = await auth();
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: url,
            // fetchOptions: { cache: "no-store" },
            credentials: 'include',
            headers: {
                Cookie: session.user ? `sessionid=${session.user.sessionId}` : null,
                'Access-Control-Allow-Origin': '*',
            }
        }),
    });
});

export { getClient as api, query, PreloadQuery };