'use client'
import React from 'react';

export const StudioContext = React.createContext();
export const StCommunityContext = React.createContext();
export const AccountEditContext = React.createContext();

export const StudioWriterContext = React.createContext({});

export const CreatorPageContext = React.createContext({});

export const CommentContext = React.createContext({
    form: {
        data: {
            text: '',
            show: false,
            action: 'CREATE', // "UPDATE", "REPLY"
            parentId: null,
            meta: {
                update: {
                    username: null
                }
            },
        },
        set: () => { },
    },
    state: {
        loading: false,
        sending: false,
        setLoading: () => { },
        setSending: () => { },
        lastItemRef: null,
        hasMore: true,
    },
    content: {
        key: null,
        authorKey: null,
    },
    onSend: () => { },
    comment: {
        data: [],
        set: () => { },
        count: 0,
    },
    re: {
        query: null,
        resolver: (d) => { },
        reply: null,
        setReply: () => { },
    },
    onVote: async (i) => { },
});

export const CommentMetaContext = React.createContext({
    reply: {
        show: false,
        set: () => { },
        parentId: null,
        lastItemRef: null
    }
})