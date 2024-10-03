"use client";

import { Button, IconButton } from "@/components/rui";


const _Button = ({ children, options }) => {

    return (
        <Button disabled={options?.disabled} size='small' variant={options?.variant || 'outlined'} sx={{ minWidth: '32px', minHeight: '32px', p: 0, ...options?.sx }} onClick={options?.onClick} {...options?.Props}>
            {children}
        </Button>
    )
}

const _IconButton = ({ children, options }) => {
    return (
        <IconButton
            onClick={options?.onClick}
            disabled={options?.disabled}
            sx={options?.sx}
            size="small"
            {...options?.Props}
        >
            {children}
        </IconButton>
    )
}

export { _Button, _IconButton };