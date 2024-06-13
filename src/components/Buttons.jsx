// @/components/Button.js
'use client'
import Link from 'next/link';
import React, { useState, useContext } from 'react';
import { CgLink, CgMenuLeft } from 'react-icons/cg';
import { IoMdPeople } from 'react-icons/io';
import { PiDotsThreeOutline, PiShareFat } from 'react-icons/pi';
import { TbHeartHandshake, TbLockCheck } from 'react-icons/tb';
import { BiChevronDown } from 'react-icons/bi';
import { HiOutlineGlobe } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { IoCreateOutline } from 'react-icons/io5';
import { ArticleReportModal } from '@/components/popup';
import { MdBookmarkAdd, MdBookmarkAdded, MdNavigateNext, MdOutlineKeyboardArrowLeft, MdOutlineReport } from 'react-icons/md';
import { MenuList, Zoom, ListItemIcon, alpha } from '@mui/material';
import { AccountCircleOutlined, Add, DrawOutlined, NotificationsOutlined, Menu as MenuIcon } from '@mui/icons-material';
import { Btn } from './rui/_components';
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@/components/rui';
import { DrawerContext } from './mainlayout';
import { useRouter } from 'next/navigation';
import { BsPatchQuestion } from 'react-icons/bs';

const btnClass = 'rounded-full z-0 mx-2 justify-center cursor-pointer border border-transparent active:border-gray-400 active:bg-stone-300 hover:bg-zinc-200 bg-zinc-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:active:bg-stone-800 chetlnam h-8 active:border flex items-center transition-all text-sm text-gray-800 dark:text-gray-200 duration-300';
const btnSx = { typography: 'rbBtns', height: '2rem', FontFace: 'rb-styime', borderRadius: '100rem', fontSize: '0.9rem', fontWeight: 'semibold', textTransform: 'none', };

export const DrawerBtn = (props) => {
  const drawer = useContext(DrawerContext);

  const handleDrawerOpen = () => {
    drawer.setOpen(!drawer.open);
  }

  return (
    <Button
      onClick={handleDrawerOpen}
      sx={{ minWidth: '2rem', minHeight: '2rem', borderRadius: '100rem', p: 0 }}
      disabled={props.disabled ? props.disabled : false}
    >
      <CgMenuLeft className='w-5 h-5 ' />
    </Button>
  )
}

const LgBtn = (props) => {
  return (
    <a href="/auth/v2/login">
      <button className={`${props.class} gt-btn font-bold dark:to-blue-500 to-blue-400 dark:focus:outline-white dark:border-zinc-700 dark:hover:border-slate-400 dark:from-blue-950 from-blue-800 bg-gradient-to-r h-10 focus:outline-black text-base text-white rounded-full`}>{props.name}</button>
    </a>
  )
}

const SgBtn = (props) => {
  return (
    <Link href="/auth/v2/login">
      <Button sx={{ px: 4, }} variant='outlined' className={`${props.class} dark:!bg-darkHead !bg-lightButton `} >
        <AccountCircleOutlined className='mr-1.5' />
        {props.name ? props.name : 'Sign In'}
      </Button>
    </Link>
  )
}

const TransBtn = (props) => {
  return (
    <Button variant='outlined' onClick={props.onclick} className={`gt-btn !font-bold dark:!bg-dark dark:!border-zinc-600 dark:!focus:outline-white dark:!text-white !h-10 !text-base !border-slate-300  focus:!outline-black hover:!border-blue-200 !shadow-sm !px-9 !bg-white !text-black !rounded-full ${props.CssClass}`}>{props.Text} <BiChevronDown /> </Button>
  )
}

const CloseBtn = (props) => {
  return (
    <div className={`${props.class}`}>
      <IconButton
        onClick={props.onClick}
        // color='icon'
        className='bg-white/40 dark:bg-dark/40 dark:text-gray-100 text-gray-900 '
        sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.9), p: 1 }}
      >
        <AiOutlineClose />
      </IconButton>
    </div>
  )
}

const NextBtn = (props) => {
  return (
    <div className={`${props.class}`}>
      <Button
        onClick={props.onClick}
        sx={{ minWidth: '2rem', minHeight: '2rem', borderRadius: '100rem', p: 0 }}
        color={props.color ? props.color : 'icon'}
        disabled={props.disabled ? props.disabled : false}
      >
        <MdNavigateNext className='w-6 h-6' />
      </Button>
    </div>
  )
}

const BackBtn = (props) => {
  return (
    <div className={`${props.class}`}>
      <IconButton
        onClick={props.onClick}
        // color={props.color ? props.color : 'icon'}
        disabled={props.disabled ? props.disabled : false}
      >
        <MdOutlineKeyboardArrowLeft className='w-5 h-5' />
      </IconButton>
    </div>
  )
}

const ShareBtn = (props) => {
  const clasS = props.class ? props.class : '';
  const cliCk = props.onClick ? props.onClick : () => { };
  return (
    <div className={`${btnClass} ${clasS}`}>
      <Button size='small' sx={{ ...btnSx, px: '16px' }} onClick={cliCk}>
        <PiShareFat className='text-gray-900 dark:text-gray-100 mr-1.5' />
        <span className='text-gray-900 dark:text-gray-100'>Share</span>
      </Button>
    </div>
  )
}

const PrivacyHandlerBtn = (props) => {
  const privacy = props.privacy
  if (privacy === 'public') {
    return (
      <Tooltip followCursor arrow TransitionComponent={Zoom} title="Public">
        <span>
          <HiOutlineGlobe className='text-2xl h-5 w-5 ml-1 mr-1' />
        </span>
      </Tooltip>
    )
  } else if (privacy === 'private') {
    return (
      <TbLockCheck className='text-2xl h-5 w-5 ml-1 mr-1' />
    )
  } else if (privacy === 'unlisted') {
    return (
      <Tooltip title="This tooltip works great">
        <div>
          <CgLink className='text-2xl h-5 w-5 ml-1 mr-1' /></div>
      </Tooltip>
    )
  } else if (privacy === 'followers') {
    return (
      <IoMdPeople className='text-2xl h-5 w-5 ml-1 mr-1' />
    )
  } else {
    return null;
  }
}

const BookmarkBtn = (props) => {
  const bookMarked = props.bookmarked ? props.bookmarked : false;
  const clasS = props.class ? props.class : '';
  const cliCk = props.onClick ? props.onClick : () => { };
  return (
    <div className={`${btnClass} ${clasS} w-8`}>
      <Button size='small' sx={{ ...btnSx, minWidth: '32px' }} onClick={cliCk}>
        {bookMarked ? <MdBookmarkAdded className='text-gray-800 dark:text-gray-200 text-xl' /> : <MdBookmarkAdd className='text-gray-800 dark:text-gray-200 text-xl' />}
      </Button>
    </div>
  )
}


const BtnWithMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isReportModal, setIsReportModal] = useState(false);

  const handleReportClick = () => {
    setIsReportModal(true);
  }

  const handleReportClose = () => {
    setIsReportModal(false);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={`${btnClass} w-8`}>
        <Button size='small' sx={{ ...btnSx, minWidth: 32 }} onClick={handleClick}>
          <PiDotsThreeOutline className="w-5 h-5" />
        </Button>
      </div>
      <div className='absolute z-[999]'>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{ zIndex: '999' }} >
          <MenuList>
            <div className='py-0.5 w-36'>
              <MenuItem>
                <ListItemIcon />
                <span className='stymie text-base'>Report</span>
              </MenuItem>
              <MenuItem>
                <ListItemIcon >
                  <TbHeartHandshake className='w-6 h-6' />
                </ListItemIcon>
                <span className='stymie text-base'>Send Love</span>
              </MenuItem>
              <MenuItem onClick={handleReportClick} >
                <ListItemIcon >
                  <MdOutlineReport className='w-6 h-6' />
                </ListItemIcon>
                <span className='stymie text-base'>Report</span>
              </MenuItem>
            </div>
          </MenuList>
        </Menu>
      </div>
      {isReportModal && <ArticleReportModal open={isReportModal} articleId={props.id} chID={props.channelID} onClose={handleReportClose} />}
    </>
  );
};

const CreateBtn = ({ classes, iconColor, sx }) => {
  return (
    <Link href="#" className={`rounded-full justify-center cursor-pointer border border-transparent chetlnam active:border flex items-center transition-all text-sm duration-300 ${classes}`}>
      <IconButton size='small' sx={{ ...sx }} >
        <DrawOutlined htmlColor={iconColor} />
      </IconButton>
    </Link>
  )
}

const NotificationBtn = ({ classes, iconColor, sx }) => {
  return (
    <IconButton size='small' sx={{ ...sx }} onClick={() => { }} className={`${classes}`} >
      <NotificationsOutlined htmlColor={iconColor} />
    </IconButton>
  )
}

const RouterBackBtn = (props) => {
  const router = useRouter();
  return (
    <IconButton size='small' className="bg-white dark:bg-dark" sx={{ ...btnSx }} onClick={() => {
      setTimeout(() => {
        router.back()
      }, 300);
    }}>
      <AiOutlineClose />
    </IconButton>
  )
}

const LearnMoreBtn = ({ url, show = 'full', onClick, tooltip, target = '_self', accent = false }) => {

  const IconContent = () => {
    return (
      <Tooltip hidden={!tooltip} title={<p className='p-1 text-[12px] max-w-[200px]'>{tooltip}</p>} placement="bottom">
        <span className='ml-1'><BsPatchQuestion /></span>
      </Tooltip>
    )
  }

  const Content = () => {
    switch (show) {
      case 'full':
        return <span>Learn More <IconContent /> </span>
      case 'icon':
        return <IconContent />
      case 'text':
        return 'Learn More'
      default:
        return 'Learn More'
    }
  }

  return (
    <span onClick={onClick ? onClick : () => { }} className={accent ? 'text-accent dark:text-accentDarker' : ''} >
      {url ? <Link target={target} href={url}> {Content()} </Link> : Content()}
    </span>
  )
}

export { NotificationBtn, LgBtn, SgBtn, TransBtn, CloseBtn, ShareBtn, BookmarkBtn, PrivacyHandlerBtn, BtnWithMenu, CreateBtn, NextBtn, BackBtn, RouterBackBtn, LearnMoreBtn };

