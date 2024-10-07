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
import { ArticleReportModal } from '@/components/popup';
import { MdBookmarkAdded, MdNavigateNext, MdOutlineBookmarkAdd, MdOutlineKeyboardArrowLeft, MdOutlineReport } from 'react-icons/md';
import { MenuList, Zoom, ListItemIcon } from '@mui/material';
import { AccountCircleOutlined, DrawOutlined, NotificationsOutlined, MoreVert } from '@mui/icons-material';
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@/components/rui';
import { DrawerContext } from './mainlayout';
import { useRouter } from 'next/navigation';
import { BsPatchQuestion, BsTrash } from 'react-icons/bs';
import { StudioContext } from '@/lib/context';
import { LuImagePlus } from "react-icons/lu";
import { FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import confirm from '@/lib/confirm';
import { StoryImage } from './story';
import { createStory } from '@/lib/actions/setters/story';

const btnClass = 'rounded-full z-0 mx-2 justify-center cursor-pointer border border-transparent active:border-gray-400 active:bg-stone-300 hover:bg-zinc-200 bg-zinc-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:active:bg-stone-800 chetlnam h-8 active:border flex items-center transition-all text-sm text-gray-800 dark:text-gray-200 duration-300';
const btnSx = { typography: 'rbBtns', height: '2rem', FontFace: 'rb-styime', borderRadius: '100rem', fontSize: '0.9rem', fontWeight: 'semibold', textTransform: 'none', };

export const DrawerBtn = (props) => {
  const drawer = useContext(DrawerContext);

  const handleDrawerOpen = () => {
    drawer.setOpen(!drawer.open);
    try {
      if (drawer?.variant === 'permanent') sessionStorage.setItem('drawer', `${!drawer.open}`);
    } catch { }
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
        disabled={props.disabled ? props.disabled : false}
      >
        <AiOutlineClose className='w-5 h-5' />
      </IconButton>
    </div>
  )
}

const NextBtn = (props) => {
  return (
    <div className={`${props.className}`}>
      <IconButton
        onClick={props.onClick}
        color={props.color ? props.color : 'icon'}
        disabled={props.disabled ? props.disabled : false}
      >
        <MdNavigateNext className='w-5 h-5' />
      </IconButton>
    </div>
  )
}

const BackBtn = (props) => {
  return (
    <div className={`${props.className}`}>
      <IconButton
        onClick={props.onClick}
        color={props.color ? props.color : 'icon'}
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
          <HiOutlineGlobe className={`text-2xl h-5 w-5 ml-1 mr-1`} />
        </span>
      </Tooltip>
    )
  } else if (privacy === 'private') {
    return (
      <Tooltip followCursor arrow TransitionComponent={Zoom} title="Private">
        <span>
          <TbLockCheck className='text-2xl h-5 w-5 ml-1 mr-1' />
        </span>
      </Tooltip>
    )
  } else if (privacy === 'unlisted') {
    return (
      <Tooltip followCursor arrow TransitionComponent={Zoom} title="Unlisted">
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
    <div className={` ${clasS}`}>
      <Button disabled={props.isLoading} size='small' variant={props?.variant || 'outlined'} sx={{ ...btnSx, minWidth: '32px', minHeight: '32px', p: 0 }} onClick={cliCk}>
        {bookMarked ? <MdBookmarkAdded className=' w-4 h-4' /> : <MdOutlineBookmarkAdd className='w-4 h-4' />}
      </Button>
    </div>
  )
}

const ShareButton = ({ onClick }) => {
  return (
    <Button variant="outlined" size='small' sx={{ ...btnSx, minWidth: '32px', minHeight: '32px', p: 0 }} onClick={onClick}>
      <PiShareFat className="w-4 h-4" />
    </Button>
  )
}

const PostEditButton = ({ classes, disabled, show = true, href }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(href);
  }
  return show ? (
    <div className={` ${classes}`}>
      <Button disabled={disabled} size='small' variant='outlined' sx={{ ...btnSx, minWidth: '32px', minHeight: '32px', p: 0 }} onClick={handleClick}>
        <DrawOutlined className='w-4 h-4' />
      </Button>
    </div>
  ) : null
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
      <div className={` w-8`}>
        <Button variant="outlined" size='small' sx={{ ...btnSx, minWidth: '32px', minHeight: '32px', p: 0 }} onClick={handleClick}>
          <PiDotsThreeOutline className="w-4 h-4" />
        </Button>
      </div>
      <div className='absolute z-[999]'>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
          open={!!anchorEl}
          MenuListProps={{
            'aria-labelledby': 'Post Actions',
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '12px !important',
                py: 0,
                minWidth: '180px'
              }
            }
          }}>
          <MenuList className=''>
            {/* <MenuItem>
              <ListItemIcon />
              <span className='stymie text-base'>Follow</span>
            </MenuItem> */}
            <MenuItem>
              <ListItemIcon >
                <TbHeartHandshake className='w-6 h-6' />
              </ListItemIcon>
              <span className='stymie text-base'>Say Thanks</span>
            </MenuItem>
            <MenuItem onClick={handleReportClick} >
              <ListItemIcon >
                <MdOutlineReport className='w-6 h-6' />
              </ListItemIcon>
              <span className='stymie text-base'>Report</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      {isReportModal && <ArticleReportModal open={isReportModal} articleId={props.id} chID={props.channelID} onClose={handleReportClose} />}
    </>
  );
};

const PostDetailsImageMenu = ({ onFistClick, disabled }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={` w-8`}>
        <Button disabled={disabled} variant="outlined" size='small' sx={{ ...btnSx, minWidth: '32px', minHeight: '32px', p: 0 }} className={`!bg-lightHead dark:!bg-darkHead ${disabled && 'opacity-40'}`} onClick={handleClick}>
          <PiDotsThreeOutline className="w-4 h-4" />
        </Button>
      </div>
      <div className=''>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{ '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '128px' } }} >
          <MenuList className=''>
            <MenuItem onClick={() => { onFistClick(), handleClose() }}>
              <ListItemIcon >
                <LuImagePlus className='w-5 h-5' />
              </ListItemIcon>
              <span className='text-base'>Change Image</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </>
  );
};
const PostDetailsTableViewMenu = ({ url, data, disabled, setPosts }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const context = useContext(StudioContext);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const View = () => (
    <>
      <div className='bg-light dark:bg-dark truncate rounded-xl p-2 flex space-x-4'>
        <StoryImage image={{ url: data?.img, alt: data?.title }} width={100} height={56} className={'!rounded-md'} />
        <div className='flex flex-col max-w-[300px]'>
          <h3 className='text-sm line-clamp-1 text-black dark:text-white truncate text-wrap font-semibold'>{data?.title}</h3>
          <p className='text-xs line-clamp-2 text-gray-600 dark:text-gray-400 truncate text-wrap mt-0.5'>{data?.description}</p>
        </div>
      </div>
      <p className='mt-2 opacity-70 cheltenham-small'> Please note that this action is irreversible. </p>
    </>
  )
  const onDelete = async () => {
    try {
      if (await confirm(<View />, { title: 'Are you sure you want to delete this post?', okLabel: 'Delete', cancelLabel: 'Cancel' })) {
        try {
          context?.setLoading(true)
          // Will be updated with the new route
        } catch (e) {
          toast.error(e.message)
        } finally {
          context?.setLoading(false)
        }
      }

    } catch (e) {
      console.error('Error navigating:', e);
    }
  }

  let list = [
    {
      label: 'Get Shareable Link',
      icon: FiShare2,
      onClick: () => {
        navigator.clipboard.writeText(`${window.location.origin}/${context?.data?.data?.handle ? `@${context?.data?.data?.handle}` : 'post'}/${url}`).then(() => {
          toast.success('Link copied to clipboard');
        });
      },
    },
    {
      label: 'Delete Forever',
      icon: BsTrash,
      onClick: onDelete,
    }
  ]

  return (
    <>
      <Tooltip disabled={disabled} title={'Manage Post'} placement='bottom'>
        <IconButton disabled={disabled} onClick={handleClick} >
          <MoreVert className="w-5 h-5" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'post_details_action',
        }}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '180px' } }} >
        <MenuList>
          {
            list.map((item, index) => {
              return (
                <MenuItem key={index} onClick={item.onClick}>
                  <ListItemIcon >
                    <item.icon className='w-5 h-5' />
                  </ListItemIcon>
                  <span className='text-base font-semibold mr-1.5'>{item.label}</span>
                </MenuItem>
              )
            })
          }
        </MenuList>
      </Menu>
    </>
  );
};

const PostDetailsActionMenu = ({ list = [], disabled }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton color="primary" size='small' disabled={disabled} onClick={handleClick}>
        <MoreVert className="w-4 h-4" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'post_details_action',
        }}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '128px' } }} >
        <MenuList>
          {
            list.map((item, index) => {
              return (
                <MenuItem key={index} onClick={item.onClick}>
                  <ListItemIcon >
                    <item.icon className='w-5 h-5' />
                  </ListItemIcon>
                  <span className='text-base font-semibold mr-1.5'>{item.label}</span>
                </MenuItem>
              )
            })
          }
        </MenuList>
      </Menu>
    </>
  );
};
const ActionMenu = ({ list = [], disabled }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton color="primary" size='small' disabled={disabled} onClick={handleClick}>
        <MoreVert className="w-4 h-4" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'post_details_action',
        }}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '128px' } }} >
        <MenuList>
          {
            list.map((item, index) => {
              return (
                <MenuItem key={index} onClick={() => {
                  item?.onClick()
                  handleClose()
                }}>
                  <ListItemIcon >
                    <item.icon className='w-5 h-5' />
                  </ListItemIcon>
                  <span className='text-base font-semibold mr-1.5'>{item.label}</span>
                </MenuItem>
              )
            })
          }
        </MenuList>
      </Menu>
    </>
  );
};

const CreateBtn = ({ classes, iconColor, sx }) => {
  const { creator } = useContext(StudioContext);
  if (!creator) return null;
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = async () => {
    try {
      if (loading) return;
      let res = await createStory(creator?.key)
    } catch (e) {
      toast.error('Something went wrong while creating post, Please try again.')
    } finally { setLoading(false) }
  }
  return (
    <>
      <div className={`rounded-full justify-center cursor-pointer border border-transparent chetlnam active:border flex items-center transition-all text-sm duration-300 ${classes}`}>
        <IconButton disabled={loading} onClick={handleOpen} size='small' sx={{ ...sx }} >
          <DrawOutlined htmlColor={iconColor} sx={{ width: '1.25rem', height: '1.25rem' }} />
        </IconButton>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', py: 0, minWidth: '128px' } }} >
        <MenuItem onClick={() => { handleClick(), handleClose() }}>
          <span className='text-base'>Story</span>
        </MenuItem>
        <MenuItem onClick={() => { router.push('/studio/create/post'), handleClose() }}>
          <span className='text-base'>Post</span>
        </MenuItem>
      </Menu>
    </>
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
    <IconButton size='small' className="bg-white dark:bg-dark" sx={{ width: 32, height: 32, ...btnSx }} onClick={() => {
      setTimeout(() => {
        router.back()
      }, 100);
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
export { NotificationBtn, LgBtn, SgBtn, TransBtn, CloseBtn, ShareBtn, BookmarkBtn, PrivacyHandlerBtn, BtnWithMenu, CreateBtn, NextBtn, BackBtn, RouterBackBtn, LearnMoreBtn, PostEditButton, PostDetailsImageMenu, PostDetailsActionMenu, PostDetailsTableViewMenu, ShareButton, ActionMenu };