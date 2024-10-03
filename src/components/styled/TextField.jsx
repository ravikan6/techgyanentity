"use client";

import { styled, TextField } from "@mui/material";

const _TextField = styled(TextField)(() => ({
    '& .MuiInputBase-root': {
        borderRadius: '20px',
        '& textarea': {
            margin: '5px 0',
            padding: '0 !important',
        },
        '& .MuiInputBase-input': {
            paddingLeft: '20px',
            paddingRight: '20px',
        },
    },
    '& .MuiTextField-root': {
        borderRadius: '20px',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        '& legend': {
            marginLeft: '12.5px',
            borderRadius: '999px',
            '& span': {
                fontFamily: 'rb-cheltenham, sans-serif',
            },
        },
    },
    '& .MuiInputLabel-outlined': {
        marginLeft: '12px',
    },
}));


export default _TextField;