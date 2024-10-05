"use client";

import { styled, Menu } from "@mui/material";

const _Menu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '12px',
        color: theme.palette.grey[200],
        backgroundColor: theme.palette?.background?.default,
        ...theme.applyStyles("light", {
            color: theme.palette.grey[800]
        })
    },
}));

export default _Menu;