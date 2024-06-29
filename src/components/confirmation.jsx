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
    title = 'Confirmation',
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
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {confirmation}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="text"
                        onClick={cancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="contained"
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