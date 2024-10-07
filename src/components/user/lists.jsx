"use client";

import { List } from "@mui/material";
import { StoryListItemView } from "../story";

const ClappedStoriesPageView = ({ clappedStories }) => {

    return (
        <>
            <h1>Clapped Stories</h1>
            <div className="max-w-2xl">
                <List>
                    {clappedStories?.edges?.map((item, index) => (
                        <StoryListItemView key={index} story={item?.node?.story} />
                    ))}
                </List>
            </div>
        </>
    );
}

export { ClappedStoriesPageView };