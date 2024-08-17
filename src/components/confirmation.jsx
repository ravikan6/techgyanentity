import React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Dialog, SwipeableDrawer } from './rui';
import { confirmable } from 'react-confirm';
import { Experimental_CssVarsProvider as CssVarsProvider, useMediaQuery } from '@mui/material';
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
    const isMinWidth = useMediaQuery('(max-width:600px)');
    return (
        <CssVarsProvider disableTransitionOnChange theme={mui} defaultMode='system'>
            {isMinWidth ? <>
                <SwipeableDrawer
                    anchor="bottom"
                    open={show}
                    onClose={dismiss}
                    onOpen={() => { }}
                    sx={{ zIndex: 1900 }}
                    keepMounted={false}
                    showClose={false}
                    puller={false}
                >
                    {title && <h2 className="text-lg cheltenham font-bold mb-3">
                        {title}
                    </h2>}
                    <div className='opacity-90 mb-5'>
                        {confirmation}
                    </div>
                    <div className='flex gap-10 p-4 justify-end'>
                        <Button
                            variant="text"
                            size="small"
                            onClick={cancel}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="button"
                            onClick={proceed}
                            className='dark:!text-black'
                        >
                            {okLabel}
                        </Button>
                    </div>
                </SwipeableDrawer>
            </> :
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
                </Dialog>}
        </CssVarsProvider>

    );
}

export default confirmable(Confirmation);