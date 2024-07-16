import React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Dialog } from './rui';
import { confirmable } from 'react-confirm';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';
import mui from '@/styles/mui';

const Confirmation = ({
    okLabel = 'OK',
    cancelLabel = 'Cancel',
    title,
    confirmation,
    show,
    proceed,
    dismiss,
    cancel,
    modal,
}) => {
    return (
        <CssVarsProvider disableTransitionOnChange theme={mui} defaultMode='system'>
            <Dialog
                modal={modal}
                open={show}
                onClose={dismiss}
                sx={{
                    '& .MuiPaper-root': {
                        boxShadow: (theme) => theme.shadows[4],
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette?.button.main : theme.palette?.head.main,
                    },
                    maxWidth: 'sm',
                    mx: 'auto',
                }}
            >
                {title && <DialogTitle className='!font-bold !text-black'>
                    {title}
                </DialogTitle>}
                <DialogContent className='text-gray-900'>
                    {confirmation}
                </DialogContent>
                <DialogActions className='flex space-x-4'>
                    <Button
                        variant="text"
                        size="small"
                        color='accent'
                        onClick={cancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="accent"
                        onClick={proceed}
                    >
                        {okLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </CssVarsProvider>

    );
}

export default confirmable(Confirmation);