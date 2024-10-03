"use client";

import { useState } from "react";
import { Button, MenuItem, Tooltip } from "../rui";
import { BiSolidUserCircle } from "react-icons/bi";
import Link from "next/link";
import { Box, ListItemIcon, Typography } from "@mui/material";

const AnonymousActionWrapper = ({ children, isAnonymous, text, action }) => {
    return (
        isAnonymous ? <AnonymousActionTip children={children} text={text} action={action} /> : children
    )
}

const AnonymousActionTip = ({ children, text, action }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const ActionView = () => {
        return (
            <>
                <div className='max-w-56 p-1'>
                    <p className='italic text-xs cheltenham-small dark:text-zinc-800 text-gray-100 mb-5 px-3 py-1'>
                        {text}
                    </p>
                    <div className='flex justify-between items-center w-full'>
                        <Button
                            variant='outlined'
                            color="head"
                            size="small"
                            onClick={
                                () => {
                                    setOpen(false);
                                }
                            }
                        >
                            <BiSolidUserCircle className='w-5 h-5 mr-2' />
                            <span >Sign In</span>
                        </Button>
                        {action ? <Button
                            variant='text'
                            color="head"
                            size="small"
                            onClick={
                                () => {
                                    setOpen(false);
                                }
                            }
                        >
                            <span >Learn More</span>
                        </Button> : null}
                    </div>
                </div>
            </>
        )
    }

    return (
        <Tooltip
            disableHoverListener
            disableTouchListener
            open={open} onClose={handleClose} onOpen={handleOpen}
            title={<ActionView />}
            placement='top'>
            <span onClick={handleOpen}>
                {children}
            </span>
        </Tooltip>
    );
}


const MenuListItem = ({ item, options }) => {
    return (
        <MenuItem key={item.name} onClick={options?.onClick} >
            <Tooltip title={options?.helpText || item.name} placement="left" slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 20],
                            },
                        },
                    ],
                },
            }} >
                {item?.href ? <Link className='w-full' href={item?.href || '#'}>
                    <Box component="a" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <ListItemIcon>
                            <item.icon fontSize='small' />
                        </ListItemIcon>
                        <Typography variant="inherit">{item?.name}</Typography>
                    </Box>
                </Link> :
                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                        <ListItemIcon>
                            <item.icon fontSize='small' />
                        </ListItemIcon>
                        <Typography variant="inherit">{item?.name}</Typography>
                    </Box>}
            </Tooltip>
        </MenuItem>
    )
}



export {
    AnonymousActionWrapper,
    MenuListItem
}