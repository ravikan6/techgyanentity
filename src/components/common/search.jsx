"use client";

import { useEffect, useState } from "react";
import { TextField } from "../styled";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "@mui/icons-material";
import { IconButton, List } from "@mui/material";
import { GET_STORY_SEARCH_RESULTS } from "@/lib/types/story";
import { useLazyQuery } from "@apollo/client";
import { StoryListItemSkeletons, StoryListItemView } from "../story";

const Box = () => {
    const [text, setText] = useState('');
    const { replace, push } = useRouter();

    const onSearch = () => {
        let np = new URLSearchParams()
        np.set('q', text)
        push(`/search?${np.toString()}`);
    }

    return (
        <>
            <TextField
                placeholder="Search..."
                type="text"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                variant="outlined"
                size="small"
                slotProps={{
                    input: {
                        endAdornment: <IconButton
                            color="primary"
                            onClick={onSearch}
                        ><Search /></IconButton>
                    }
                }}
            />
        </>
    );
}

const PageView = () => {
    const sp = useSearchParams();

    const [getStories, { data, loading, error, called }] = useLazyQuery(GET_STORY_SEARCH_RESULTS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        let q = sp.get('q');
        if (q) {
            getStories({
                variables: {
                    title: q
                }
            })
        }
    }, [sp])

    return (
        <div className="mx-auto max-w-3xl my-4">
            <h3 className="text-lg stymie-small">
                Search Results for "{sp.get('q')}"
            </h3>
            {data ? (
                <List>
                    {data?.Stories?.edges.map(({ node }) => (
                        <div key={node.key}>
                            <StoryListItemView story={node} />
                        </div>
                    ))}
                </List>
            ) : (!loading && !error) ? (
                <div>No results found for your search</div>
            ) : (loading) ? (
                <StoryListItemSkeletons count={5} />
            ) : (called && error) ? (
                <div>Error loading search results</div>
            ) : null}
        </div>
    )

}

export { Box, PageView };