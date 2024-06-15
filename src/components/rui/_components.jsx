'use client'
import React, { forwardRef, useState } from 'react'
import { Menu, alpha, styled, Button, MenuItem, Tooltip, Zoom, tooltipClasses, Dialog, TextField, Box, Snackbar, IconButton, ToggleButtonGroup, ToggleButton, Switch } from "@mui/material";


const RuiMenu = styled(React.forwardRef((props, ref) => (
    <Menu
        elevation={1}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        ref={ref}
        {...props}
    />
)))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '24px',
        marginTop: theme.spacing(1),
        color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],
        backgroundColor: theme.palette.modelBg,
        py: 20,
    },
}));

const RuiIcoBtn = styled(IconButton)(({ theme }) => ({
    border: 'none',
    borderRadius: 20,
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px',
    // minWidth: '30px',
    // minHeight: '30px',
    // maxWidth: '30px',
    // maxHeight: '30px',
    cursor: 'pointer',
}));

const RuiMenuItem = styled((props) => (
    <MenuItem
        sx={{
            borderRadius: 20,
        }}
        {...props}
    />
))(({ theme }) => ({
    typography: 'body1',
    color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],
}));

const RuiButton = styled(Button)(({ theme }) => ({
    typography: 'body1',
    borderRadius: 999,
    '& .MuiButton-contained': {
        boxShadow: theme.shadows[2],
        backgroundColor: `${theme.palette.accent.main} !important`,
    },
}));

const RuiToolTip = styled(({ className, ...props }) =>
    <Tooltip
        TransitionComponent={Zoom}
        {...props}
        classes={{ popper: className }}
        enterTouchDelay={0}
    />
)(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
        borderRadius: 12,
        backgroundColor: theme.palette.bgSP.main,
        color: theme.palette.grey[100],
        fontFamily: 'rb-cheltenham',
        fontWeight: 'bold',
        fontSize: '0.6rem',
        px: '10px',
        letterSpacing: '0.02em',
        boxShadow: theme.shadows[1],
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: alpha(theme.palette.bgSP.main, 0.9),
    },
}));


const Transition = forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const RuiDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
        borderColor: theme.palette.icon.main,
        borderRadius: '24px',
    },
    '& .MuiBackdrop-root': {
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
        backdropFilter: theme.palette.mode === 'light' ? 'blur(4px)' : 'blur(4px)',
    },
}));


const UnstyledTextField = ({ counter, ...props }) => {
    let { inputProps, value, size, InputProps } = props;
    inputProps = inputProps || InputProps;
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    let condition = counter && (isFocused && value?.length > 0);
    return (
        <>

            <TextField
                {...props}
                onFocus={handleFocus}
                onBlur={handleBlur}
                InputProps={{
                    ...InputProps,
                    ...inputProps,
                    endAdornment: (
                        condition && <p className={`absolute right-1 mr-5 backdrop-blur-sm px-1 rounded-sm font-semibold ${size == 'small' ? `text-[8px] -bottom-0.5` : `text-[10px] bottom-1`} ${value?.length >= inputProps?.maxLength ? 'text-red-800 dark:text-red-600' : 'text-slate-700 dark:text-slate-300'} cheltenham text-right`}>{value?.length}{inputProps?.maxLength && `/${inputProps?.maxLength}`}</p>
                    ),
                }}
            />
        </>
    );
};


const RuiTextField = styled(UnstyledTextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: '20px',
        '& textarea': {
            // fontFamily: 'rb-cheltenham, sans-serif',
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
                // padding: '0 7px !important',
            },
        },
    },
    '& .MuiInputLabel-outlined': {
        marginLeft: '12px',
    },
}));

const RuiSnakBar = styled(Snackbar)(({ theme }) => ({
    '& .MuiSnackbarContent-root': {
        borderRadius: '999px',
        backgroundColor: theme.palette.bgSP.main,
        color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[200],
        fontFamily: 'rb-cheltenham, sans-serif',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
}));


const RuiToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-firstButton': {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    '& .MuiToggleButtonGroup-middleButton': {
        borderRadius: 0,
    },
    '& .MuiToggleButtonGroup-lastButton': {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
}));

const RuiToggleButton = styled(ToggleButton)(({ theme }) => ({

}));

const RuiSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-switchBase': {
        '&:hover': {
            '& .MuiSwitch-thumb': {
                width: 18,
                height: 18,
                margin: 1,
            }
        }
    },
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
        backgroundColor: theme.palette?.switch?.main,
    },
    '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
        backgroundColor: theme.palette?.switch?.contrastText,
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette?.switch?.accent,
    }
}))

export { RuiMenu, RuiIcoBtn, RuiMenuItem, RuiButton, RuiTextField, RuiDialog, RuiToolTip, RuiSnakBar, RuiToggleButtonGroup, RuiToggleButton, RuiSwitch };
export { RuiButton as Button };
export { RuiIcoBtn as Btn };
export { RuiToolTip as Tooltip };
export { RuiMenu as Menu };
export { RuiMenuItem as MenuItem };
export { RuiIcoBtn as IconButton };
export { RuiDialog as Dialog };
