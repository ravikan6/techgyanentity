'use client';
import { Fragment, useState, useContext } from 'react';
import { Button, IconButton, Menu, Tooltip } from '@/components/rui'
import { Divider, Box, LinearProgress } from '@mui/material';
import { ListItemRdX } from '@/components/Home/_profile-model';
import { CreateOutlined, DraftsOutlined, FeedbackOutlined, HelpOutlineOutlined, MoreVert } from '@mui/icons-material';
import { StudioContext, StudioWriterContext } from '@/lib/context';
import { useRouter } from 'next/navigation';
import confirm from '@/lib/confirm';

export const WriteMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [insiderOpen, setInsiderOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [insiderData, setInsiderData] = useState(null);

    const handleClick = (event) => {
        setMenuOpen(event.currentTarget);
    };

    const handleClose = () => {
        setMenuOpen(null);
    };

    const handleInsiderOpen = (event) => {
        setInsiderOpen(event.currentTarget);
        handleClose(); // Close the first menu when the second menu is opened
    };

    const handleInsiderClose = () => {
        setInsiderOpen(false);
    };
    const handleBack = () => {
        setInsiderOpen(false);
        setMenuOpen(true);
    }

    const insiderRun = (value) => {
        setInsiderData({ ...insiderData, selected: value });
    }

    const state = {
        insiderOpen: insiderOpen,
        insiderData: insiderData,
        setInsiderData: setInsiderData,
        handleInsiderOpen: handleInsiderOpen,
    }

    return (
        <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Menu">
                    <IconButton
                        onClick={(e) => { handleClick(e); setAnchorEl(e.currentTarget) }}
                        size="small"
                        aria-controls={menuOpen ? 'editor-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    >
                        <MoreVert fontSize='small' />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="main-menu"
                open={menuOpen}
                onClose={handleClose}
                sx={{
                    minWidth: '260px',
                    height: 'calc(100%-80px)',
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="rb_sss rb_ss overflow-y-auto"
            >
                <Box elevation={0} className="bg-lightHead dark:bg-darkHead" sx={{ borderRadius: '24px', py: 2, px: 1, mx: '4px', boxShadow: null }}>

                    <ListItemRdX link={{
                        name: 'New Post',
                        url: '/studio/write/new',
                        icon: CreateOutlined,
                    }} />

                    <ListItemRdX link={{
                        name: 'Drafts',
                        url: '/studio/drafts',
                        icon: DraftsOutlined,
                    }} />

                    <Divider sx={{ my: 1 }} />

                    <ListItemRdX link={{
                        name: 'Help',
                        url: '/help',
                        icon: HelpOutlineOutlined,
                    }} />
                    <ListItemRdX link={{
                        name: 'Send Feedback',
                        url: '/feedback',
                        icon: FeedbackOutlined,
                    }} />
                </Box>
            </Menu>
            {/* <Menu
                anchorEl={anchorEl}
                id="account-menu-inside"
                open={insiderOpen}
                onClose={handleInsiderClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            width: '260px',
                            mt: 1.5,
                            pt: '0 !important',
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className="rb_sss"
            >
                <SecondaryMenu insiderData={insiderData} insiderRun={insiderRun} handleBack={handleBack} />
            </Menu> */}

        </Fragment>
    );
}

export const UpdateEditorArticle = () => {
    const { state, setState, loading, setLoading } = useContext(StudioWriterContext);
    const { save, cancle, runner, onCancle } = state;

    const onClickHandler = async () => {
        if (runner && typeof runner === 'function' && !loading && save) {
            setLoading(true);
            await runner();
            setState({ ...state, save: false, runner: null, cancle: false });
            setLoading(false);
        }
    }

    const onCancleHandler = () => {
        if (!loading && cancle && onCancle && typeof onCancle === 'function') {
            setLoading(true);
            onCancle();
            setState({ ...state, cancle: false, save: false });
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    return (
        <>
            <div className='flex space-x-6 items-center justify-end'>
                <Tooltip title="Discard Changes">
                    <Button
                        onClick={onCancleHandler}
                        size="small"
                        disabled={loading || !cancle}
                        variant="outlined"
                        color="primary"
                        className="!text-nowrap"
                    >
                        Undo Changes
                    </Button>
                </Tooltip>
                <Tooltip title="Save or Update the Post">
                    <Button
                        onClick={onClickHandler}
                        size="small"
                        disabled={loading || !save}
                        variant="contained"
                        color="button"
                        className={`${loading || !save ? '' : 'dark:!text-black'}`}
                    >
                        Save
                    </Button>
                </Tooltip>
            </div>
        </>
    );

}

export const BackToContent = () => {
    const { state, loading, setLoading } = useContext(StudioWriterContext);
    const { data } = useContext(StudioContext)
    const { save } = state;
    const router = useRouter();

    const onClickHandler = async () => {
        try {
            if (save || loading) {
                if (await confirm('Are you sure you want to leave this page?')) {
                    router.push(`/${process.env?.NEXT_PUBLIC_STUDIO_PATH}/p/${data?.article?.shortId}/edit`);
                    setLoading(true);
                } else null;
            } else {
                setLoading(true);
                router.push(`/${process.env?.NEXT_PUBLIC_STUDIO_PATH}/p/${data?.article?.shortId}/edit`);
            }
        } catch { }
    }

    return (
        <Tooltip title="Back to Post Details">
            <Button
                onClick={onClickHandler}
                size="small"
                disabled={loading}
                variant="outlined"
                color="button"
                className="!text-nowrap"
            >
                Post Details
            </Button>
        </Tooltip>
    )
}

export const HeaderLoader = () => {
    const { loading } = useContext(StudioWriterContext);
    return (
        <>
            <LinearProgress className="!h-0.5 !absolute !top-[0] !z-[999] w-full" hidden={!loading} color="button" />
        </>
    )
}