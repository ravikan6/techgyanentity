"use client";
import Link from "next/link";
import { formatDate, formatDateToString, formatNumber } from "@/lib/utils";
import { useCallback, useState } from "react";
import { Button, IconButton, Menu, Tooltip } from "../rui";
import { Box, Radio, RadioGroup, Skeleton } from "@mui/material";
import { ListItemRdX } from "../Home/_profile-model";
import { HeartBrokenOutlined, ShareOutlined } from "@mui/icons-material";
import { AuthorAvatar } from "../creator/_client";
import { BsNutFill, BsThreeDots } from "react-icons/bs";
import { PiHandsClappingLight } from "react-icons/pi";
import { AiOutlineComment } from "react-icons/ai";
import { CreatorWrapper } from "../creator/utils";
import { toast } from "react-toastify";
import { imageUrl } from "@/lib/helpers";
import { BackBtn, NextBtn } from "../Buttons";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { IoResize } from "react-icons/io5";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { StoryImage } from "../story";


const PostView_TIA = ({ data, hidden, className }) => {

    return (
        <>
            <div className={`grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full ${className}`}>
                {
                    data?.list?.map((post) => (
                        <article key={post?.slug}>
                            <div className="relative group/g_pst transition-opacity duration-300">
                                <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                    <StoryImage className="rounded-xl" image={post?.image} />
                                </Link>
                                <div className="mt-2 flex flex-nowrap items-start justify-between">
                                    <div className="grow">
                                        <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`} className="w-full">
                                            <h2 className="text-xl md:text-base font-bold karnak line-clamp-2 text-ellipsis">{post.title}</h2>
                                        </Link>
                                        {!hidden?.author && <div className="mt-1.5">
                                            <PostAuthorView author={post?.author} />
                                        </div>}
                                        <div className="flex text-sm justify-between mt-1 items-center opacity-100">
                                            <PostMetaView data={post} />
                                            <PostViewActions id={post?.id} post={post} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))
                }
                {
                    data?.loading && <PostGridLoadingSkelton count={12} />
                }
                <span ref={data?.ref} ></span>
            </div>
            {
                data?.list?.length === 0 && !data?.loading && (
                    <div className="w-full flex justify-center items-center h-48">
                        <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                )
            }
            {
                (!data?.hasMore && !data?.loading && data?.list?.length > 0) && (
                    <div className="w-full flex justify-center items-center h-10">
                        <p className="text-gray-500 dark:text-gray-400">...</p>
                    </div>
                )
            }
        </>
    )
}

const PostListView_TIA = ({ data }) => {

    return (
        <>
            <div className="w-full flex flex-col justify-start items-start flex-nowrap">
                {
                    data?.list?.map((post) => (
                        <div key={post?.slug} className="relative mb-4 flex items-start space-x-4 group/g_pst transition-opacity duration-300">
                            <Link className=" w-3/12" href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                <StoryImage className="rounded-lg" image={post?.image} />
                            </Link>
                            <div className="w-[calc(75%-16px)] flex flex-col ">
                                <div className="flex flex-nowrap items-start justify-between mb-3">
                                    <div className="w-[calc(100%-32px)] grow ">
                                        <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`} className="w-full">
                                            <h2 className="text-base font-bold cheltenham line-clamp-2 text-ellipsis">{post.title}</h2>
                                            <span className="mt-1.5 text-zinc-700 dark:text-zinc-300 text-sm imperial">
                                                <time dateTime={post?.publishedAt}>{formatDate(post?.publishedAt)}</time> • 0 Views
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="w-8 opacity-100">
                                        <PostViewActions id={post?.id} />
                                    </div>
                                </div>
                                <PostAuthorView author={post?.author} />
                            </div>
                        </div>
                    ))
                }
                {
                    data?.loading && <PostListLoadingSkelton count={12} />
                }
                <span ref={data?.ref} ></span>
            </div>
            {
                data?.list?.length === 0 && !data?.loading && (
                    <div className="w-full flex justify-center items-center h-48">
                        <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                )
            }
            {
                (!data?.hasMore && !data?.loading && data?.list?.length > 0) && (
                    <div className="w-full flex justify-center items-center h-10">
                        <p className="text-gray-500 dark:text-gray-400">Yah!, you reach the end.</p>
                    </div>
                )
            }
        </>
    )
}

const PostListView2 = ({ data, hidden }) => {

    return (
        <div className="flex flex-col gap-5 items-center max-w-2xl">
            {data?.list?.map((post) => (

                <article key={post?.slug} className="w-full flex flex-col gap-1.5 sm:gap-2">
                    <section className="flex flex-col gap-1.5 sm:gap-2">
                        <div className="flex justify-between items-center">
                            <Link href={`/@${post?.author?.handle || data?.author?.handle}`} className="">
                                <CreatorWrapper shortId={post?.author?.shortId}>
                                    <div className="flex items-center cursor-pointer space-x-3">
                                        <AuthorAvatar data={{ url: post?.author?.image?.url }} className={'!w-6 !h-6'} />
                                        <span className="font-semibold text-[14px] cheltenham-small text-slate-800 dark:text-slate-100">{post?.author?.name || data?.author?.name}</span>
                                    </div>
                                </CreatorWrapper>
                            </Link>
                            <PostViewActions id={post?.id} post={post} />
                        </div>

                        <div className="wauto-full flex flex-col-reverse md:flex-row gap-3 sm:gap-4 md:gap-6 justify-between">
                            <div>
                                <Link className="flex flex-col gap-1" href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                    <div>
                                        <Tooltip title={post?.title}>
                                            <h1 className="karnak text-xl font-semibold sm:font-bold  text-zinc-900 dark:text-slate-100 cursor-pointer line-clamp-2 text-ellipsis">{post?.title}</h1>
                                        </Tooltip>
                                    </div>
                                    <div className="hidden md:block">
                                        <span className="franklin text-[14px] leading-[18px] font-normal text-slate-500 dark:text-slate-400 cursor-pointer line-clamp-2">
                                            {post?.description}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                            <div className="rounded-md md:rounded-lg relative cursor-pointer w-full md:basis-[180px] md:h-[108px] shrink-0 self-center">
                                <Link className="block w-full h-full overflow-hidden rounded-md md:rounded-lg" href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                    <StoryImage image={post?.image} className="rounded-md md:rounded-lg" style={{ objectFit: "cover" }} />
                                </Link>
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-row items-center justify-between text-slate-600 dark:text-slate-300 text-sm">
                        <PostMetaView data={post} />
                        <div className="flex-row items-center flex gap-1">
                            {(post?.tags && post?.tags?.length > 0) && <div className="flex gap-2 items-center">
                                <Link href={`/tags/${post?.tags?.at(0)}?source=tags_feed_article`}>
                                    <div className="flex stymie justify-start items-center rounded-full px-2 py-1 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 bg-lightHead hover:bg-slate-200 dark:bg-darkHead dark:hover:bg-slate-700 w-min max-w-[126px] truncate text-left">
                                        <span className="truncate">{post?.tags?.at(0)}</span>
                                    </div>
                                </Link>
                                {!hidden?.bookmark && <div data-orientation="horizontal" role="separator" className="h-3 w-px bg-lightHead dark:bg-darkHead" />}
                            </div>}
                        </div>
                    </section>
                </article>
            ))
            }
            {data?.loading && <PostListLoadingSkelton count={12} />}
            <span ref={data?.ref}></span>
        </div>
    );
}

const PostMetaView = ({ data }) => {
    return (
        <div className="flex flex-row items-center justify-start gap-3">
            <Tooltip title={formatDateToString(data?.publishedAt).long}>
                <p>{formatDateToString(data?.publishedAt).short}</p>
            </Tooltip>
            {data?._count?.claps ?
                <Tooltip title={`${data?._count?.claps} Claps`}>
                    <div className="flex space-x-2 items-center">
                        <PiHandsClappingLight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <p>{data?._count?.claps}</p>
                    </div>
                </Tooltip> : null
            }
            {data?._count?.comments ?
                <Tooltip title={`${data?._count?.comments} Comments`}>
                    <div className="flex space-x-2 items-center">
                        <AiOutlineComment className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <p>{data?._count?.comments}</p>
                    </div>
                </Tooltip> : null
            }
        </div>
    )
}

const PostAuthorView = ({ author }) => {
    return (
        <CreatorWrapper shortId={author?.shortId}>
            <div className="flex items-center gap-3">
                <Link href={`/@${author?.handle}`}>
                    <AuthorAvatar data={{ url: author?.image?.url }} className={'!w-8 !h-8'} />
                </Link>
                <div>
                    <Link href={`/@${author?.handle}`}>
                        <h3 className="text-base font-bold cheltenham">{author?.name}</h3>
                    </Link>
                </div>
            </div>
        </CreatorWrapper>
    )
}


const PollView = ({ post, session, url }) => {
    const [pollData, setPollData] = useState(post?.typeContent);
    const [disabled, setDisabled] = useState(false);

    const onSubmit = async (option) => {
        setDisabled(true);
        try {
            //
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setDisabled(false)
        }
    }

    return (
        <div className="mb-1">
            <h3 className="text-base text-gray-900 dark:text-gray-100">{pollData?.poll?.question}</h3>
            <div className="mt-3 flex flex-col gap-2.5">
                {
                    pollData?.poll?.options?.map((option, index) => (
                        <Tooltip key={index} title={option?.text}>
                            <div className="relative h-auto rounded-[12px] overflow-hidden z-[1]">
                                <Button
                                    onClick={() => onSubmit(option?.id)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    disabled={disabled}
                                    sx={{
                                        justifyContent: 'space-between',
                                        px: 1.5,
                                        borderRadius: '12px',
                                        textAlign: 'start'
                                    }}
                                    endIcon={
                                        session?.user && pollData.percentages[option?.id] > 0 ? (
                                            <span className="!text-xs cheltenham">
                                                {pollData.percentages[option?.id].toFixed(2)}%
                                            </span>
                                        ) : null
                                    }
                                >
                                    <span className="mr-0.5">{option?.text}</span>
                                </Button>
                                <div
                                    className={`absolute h-full top-0 ${disabled ? 'bg-gray-200 dark:bg-gray-600' : 'bg-secondary dark:bg-secondaryDark'}`}
                                    style={{
                                        zIndex: '-1',
                                        width: `${pollData.percentages[index]?.toFixed(2) || 0}%`,
                                        opacity: session?.user ? pollData.poll.votes.some(v => v.option === option?.id && v.userId === session.user.id) ? 1 : 0.4 : 0,
                                    }}
                                />
                            </div>
                        </Tooltip>
                    ))
                }
            </div>
            <div className="mt-3 text-sm cheltenham text-gray-600 dark:text-gray-400 font-bold">
                <Link href={url || '#'}>
                    {formatNumber(pollData?.poll?._count.votes)} Votes
                </Link>
            </div>
        </div>
    )
}

const ImageSlider = ({ slides = [], url }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasNext, setHasNext] = useState(slides.length > 1);
    const [hasPrev, setHasPrev] = useState(false);

    const router = useRouter();

    const goToNextSlide = useCallback(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        if (nextIndex) {
            setCurrentIndex((currentIndex + 1));
            setHasPrev(true);
            if ((currentIndex + 1) === slides.length - 1) {
                setHasNext(false);
            } else {
                setHasNext(true);
            }
        } else {
            setCurrentIndex(0);
            setHasPrev(false);
        }
    }, [currentIndex, slides.length]);

    const radioBtnClick = useCallback((index) => {
        setCurrentIndex(index);
        if (index === 0) {
            setHasPrev(false);
        } else {
            setHasPrev(true);
        }
        if (index === slides.length - 1) {
            setHasNext(false);
        } else {
            setHasNext(true);
        }
    }, [currentIndex, slides.length]);

    const goToPrevSlide = useCallback(() => {
        const preIndex = (currentIndex - 1) === 0 || (currentIndex - 1) % slides.length;
        if (preIndex) {
            setCurrentIndex((currentIndex - 1));
            setHasNext(true);
            if ((currentIndex - 1) === 0) {
                setHasPrev(false);
            } else {
                setHasPrev(true);
            }
        };
    }, [currentIndex, slides.length]);

    return (
        <div className="group">
            <div className="relative">
                <div className="flex items-center justify-center">
                    <div className={`bg-cover overflow-hidden rounded-lg aspect-square`} style={{ backgroundImage: `url(${imageUrl(slides[currentIndex].url, slides[currentIndex].provider)})` }}
                    >
                        <div className="overflow-hidden aspect-square backdrop-blur-3xl items-center justify-center flex-nowrap flex">
                            {slides.map((slide, index) => (
                                <div key={index} className={`transition-[width,opacity] duration-500 ${index === currentIndex ? 'w-96 opacity-100' : 'w-0 opacity-25'}`}>
                                    <Link href={url}>
                                        <img
                                            className="w-full h-full"
                                            src={imageUrl(slide.url, slide?.provider)}
                                            alt={slide.alt || 'Slide image'}
                                            width={slide?.width}
                                            height={slide?.height}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/2 transition-opacity opacity-25 group-hover:opacity-100 -translate-y-1/2 left-0 right-0 flex justify-between">
                    <div> <BackBtn onClick={goToPrevSlide} color="accent" class={`${!hasPrev && 'hidden'}`} /> </div>
                    <div> <NextBtn onClick={goToNextSlide} color="accent" class={`${!hasNext && 'hidden'}`} /> </div>
                </div>

                <div className="absolute bottom-2 w-full left-1/2 transition-opacity opacity-25 group-hover:opacity-100 transform -translate-x-1/2 justify-center flex">
                    <RadioGroup aria-labelledby="rb-images-select-post" name="imges select data" row >
                        {slides.map((_, index) => (
                            <div key={index} >
                                <Radio sx={{ width: '16px', height: '16px' }} size='small' color='accent' checked={index === currentIndex} onClick={() => radioBtnClick(index)} />
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {slides[currentIndex].caption}
            </p>
            <span className='hidden'></span>
        </div>
    );
};


const PostViewActions = ({ id, post }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton size='small' onClick={handleClick}>
                <BsThreeDots className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'Post Actions',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px !important',
                            minWidth: '180px'
                        }
                    }
                }}>
                <ListItemRdX link={{ name: 'Add to Bookmark', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Report', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Say Thanks', icon: HeartBrokenOutlined }} />
                share ----
            </Menu>
        </>
    );
};

const PostGridLoadingSkelton = ({ count }) => {
    return (
        Array(count).fill().map((_, index) => (
            <div key={index} className='w-full'>
                <Skeleton variant='rounded' className='!w-full aspect-video !h-auto block rounded-xl' animation="wave" />
                <Skeleton variant='text' className='mt-3' animation="wave" />
                <Skeleton variant='text' className='mt-1 !w-7/12' animation="wave" />
                <div className="mt-2 flex justify-start space-x-4 items-center">
                    <Skeleton variant='rounded' className='!w-3/12' animation="wave" />
                    <Skeleton variant='circular' className='!w-1.5 !h-1.5' animation="wave" />
                    <Skeleton variant='rounded' className='!w-3/12' animation="wave" />
                </div>
            </div>
        ))
    )
}

const PostListLoadingSkelton = ({ count }) => {
    return (
        Array(count).fill().map((_, index) => (
            <div key={index} className='w-full flex items-start space-x-4 group/g_pst transition-opacity duration-300'>
                <Skeleton variant='rounded' className='!w-35' animation="wave" />
                <div className="h-20 flex max-w-[calc(65%-16px)] flex-nowrap items-start justify-between">
                    <Skeleton variant='text' className='!w-9/12' animation="wave" />
                    <Skeleton variant='text' className='!w-8' animation="wave" />
                </div>
            </div>
        ))
    )
}

const ImageSliderView = ({ slides = [], url, bg }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasNext, setHasNext] = useState(slides.length > 1);
    const [hasPrev, setHasPrev] = useState(false);
    const [original, setOriginal] = useState(true);
    const [showMeta, setShowMeta] = useState(false);

    const goToNextSlide = useCallback(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        setCurrentIndex(nextIndex);
        setHasPrev(true);
        if (nextIndex === slides.length - 1) {
            setHasNext(false);
        } else {
            setHasNext(true);
        }
    }, [currentIndex, slides.length]);

    const goToPrevSlide = useCallback(() => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        setCurrentIndex(prevIndex);
        setHasNext(true);
        if (prevIndex === 0) {
            setHasPrev(false);
        }
    }, [currentIndex, slides.length]);

    const radioBtnClick = useCallback((index) => {
        setCurrentIndex(index);
        setHasPrev(index > 0);
        setHasNext(index < slides.length - 1);
    }, [slides.length]);

    return (
        <div className={`relative group aspect-[4/5] mx-auto ${bg ? 'bg-light dark:bg-dark' : 'bg-transparent'}`}>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Images Slider */}
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            fill
                            className={`w-full h-full ${original ? 'object-contain' : 'object-cover'}`}
                            src={slide?.url}
                            alt={slide?.alt || 'Slide image'}
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Original Image Button */}
            <div className={`absolute right-4 ${showMeta ? 'top-4 bottom-auto' : 'bottom-4'} bg-accentLight dark:bg-accentDark ${original ? 'opacity-60' : 'opacity-100'} rounded-full transition-all duration-300`}>
                <IconButton
                    onClick={() => setOriginal(!original)}
                    className="rounded-full"
                >
                    <IoResize className="w-4 h-4" />
                </IconButton>
            </div>

            {slides.length > 1 ? <>
                <BackBtn
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2  rounded-full opacity-80 hover:opacity-100 ${hasPrev ? 'bg-accentLight/90 dark:bg-accentDark/90 shadow-md' : 'bg-lightHead/30 dark:bg-darkHead/30'}`}
                    onClick={goToPrevSlide}
                    disabled={!hasPrev}
                >
                </BackBtn>
                <NextBtn
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 ${hasNext ? 'bg-accentLight/90 dark:bg-accentDark/90 shadow-md' : 'bg-lightHead/30 dark:bg-darkHead/30'}`}
                    onClick={goToNextSlide}
                    disabled={!hasNext}
                >
                </NextBtn>
                <div className="absolute bottom-0.5 z-10 w-full flex justify-center space-x-2 items-center">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => radioBtnClick(index)}
                            className={`rounded-full transition-all ${index === currentIndex ? 'bg-accentLight dark:bg-accentDark w-2.5 h-2.5' : 'bg-accentLight/70 dark:bg-accentDark/70 w-2 h-2'}`}
                        />
                    ))}
                </div> </> : null
            }

            {/* Caption */}
            {slides[currentIndex]?.caption && (
                <div className="absolute bottom-0 left-0 w-full">
                    <div className="bg-accentLight/90 dark:bg-accentDark/90 transition-all duration-300 opacity-80 hover:opacity-100 w-5 h-5 absolute left-4 -top-5 rounded-t-md cursor-pointer">
                        <IconButton sx={{ width: '20px', height: '20px' }} onClick={() => setShowMeta(!showMeta)}>{
                            showMeta ? <BiChevronDown className="w-4 h-4" /> : <BiChevronUp className="w-4 h-4" />
                        } </IconButton>
                    </div>
                    <div className="w-full transition-all duration-300 text-sm bg-light/75 dark:bg-dark/75 backdrop-blur-2xl px-2 py-1 pb-3 rounded-t-md max-h-32 overflow-y-auto"
                        style={{
                            display: showMeta ? 'block' : 'none',
                        }}>
                        <p className="cheltenham-small text-xs">{slides[currentIndex]?.caption}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ErrorBox = ({ error, onRetry }) => {
    return (
        <div className="w-full flex justify-center items-center h-48">
            <div className="flex flex-col items-center justify-center gap-3">
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
                <Button onClick={onRetry} variant="outlined" size="small">Retry</Button>
            </div>
        </div>
    );
}

export { PostViewActions, PostView_TIA, PostListView_TIA, PostListView2, PollView, ImagePostView, ImageSliderView, ErrorBox };