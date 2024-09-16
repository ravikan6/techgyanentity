"use client";
import Link from "next/link";
import { ArticleImage } from "./_client";
import { formatDate, formatDateToString, formatNumber } from "@/lib/utils";
import { useCallback, useState } from "react";
import { Button, IconButton, Menu, Tooltip } from "../rui";
import { Box, Radio, RadioGroup, Skeleton } from "@mui/material";
import { ListItemRdX } from "../Home/_profile-model";
import { HeartBrokenOutlined, ShareOutlined } from "@mui/icons-material";
import { AuthorAvatar } from "../author/_client";
import { BsNutFill, BsThreeDots } from "react-icons/bs";
import { Bookmark } from "./postActions";
import { PiHandsClappingLight } from "react-icons/pi";
import { AiOutlineComment } from "react-icons/ai";
import { ShareView } from "../Home/_client";
import { AuthorTipWrapper } from "../author/utils";
import { pollAnsSubmit } from "@/lib/actions/create";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { imageUrl } from "@/lib/helpers";
import { BackBtn, NextBtn } from "../Buttons";


const PostView_TIA = ({ data, hidden, className }) => {

    return (
        <>
            <div className={`grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full ${className}`}>
                {
                    data?.list?.map((post) => (
                        <article key={post?.slug}>
                            <div className="relative group/g_pst transition-opacity duration-300">
                                <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                    <ArticleImage className="rounded-xl" image={post?.image} />
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
                                <ArticleImage className="rounded-lg" image={post?.image} />
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
                                <AuthorTipWrapper shortId={post?.author?.shortId}>
                                    <div className="flex items-center cursor-pointer space-x-3">
                                        <AuthorAvatar data={{ url: post?.author?.image?.url }} className={'!w-6 !h-6'} />
                                        <span className="font-semibold text-[14px] cheltenham-small text-slate-800 dark:text-slate-100">{post?.author?.name || data?.author?.name}</span>
                                    </div>
                                </AuthorTipWrapper>
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
                                    <ArticleImage image={post?.image} className="rounded-md md:rounded-lg" style={{ objectFit: "cover" }} />
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
                            {!hidden?.bookmark && <Bookmark id={post?.shortId} variant="text" />}
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
        <AuthorTipWrapper shortId={author?.shortId}>
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
        </AuthorTipWrapper>
    )
}


const PollView = ({ post, session }) => {
    const [pollData, setPollData] = useState(post?.typeContent);
    const [disabled, setDisabled] = useState(false);

    const onSubmit = async (option) => {
        setDisabled(true);
        try {
            const response = await pollAnsSubmit(
                post.typeContent.poll.id,
                option);
            if (response.status == 200)
                setPollData(response.data);
            else toast.error('Something Went Wrong While Submiting poll answer.')
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
                            <div className="relative h-auto rounded-[12px] overflow-hidden">
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
                {formatNumber(pollData?.poll?._count.votes)} Votes
            </div>
        </div>
    )
}

const ImagePostView = ({ post }) => {
    return (
        <div>
            <ImageSlider slides={post.list || []} />
        </div>
    );
};

const ImageSlider = ({ slides = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasNext, setHasNext] = useState(slides.length > 1);
    const [hasPrev, setHasPrev] = useState(false);

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
        <div className="relative group">
            <div className="flex items-center justify-center">
                <div className={`bg-cover overflow-hidden rounded-lg w-96 min-h-[500px] max-h-[500px]`} style={{ backgroundImage: `url(${slides[currentIndex].url})` }}>
                    <div className="overflow-hidden min-h-[500px] max-h-[500px] backdrop-blur-3xl items-center justify-center flex-nowrap flex">
                        {slides.map((slide, index) => (
                            <div key={index} className={`transition-[width,opacity] duration-500 ${index === currentIndex ? 'w-96 opacity-100' : 'w-0 opacity-25'}`}>
                                <img
                                    className="w-full h-full"
                                    src={imageUrl(slide.url, slide?.provider)}
                                    alt={slide.alt || 'Slide image'}
                                    width={slide?.width}
                                    height={slide?.height}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <span className='hidden'></span>
            <div className="absolute top-1/2 transition-opacity opacity-25 group-hover:opacity-100 -translate-y-1/2 left-0 right-0 flex justify-between">
                <div> <BackBtn onClick={goToPrevSlide} color="accent" class={`${!hasPrev && 'hidden'}`} /> </div>
                <div> <NextBtn onClick={goToNextSlide} color="accent" class={`${!hasNext && 'hidden'}`} /> </div>
            </div>

            <div className="absolute bottom-2 w-96 left-1/2 transition-opacity opacity-25 group-hover:opacity-100 transform -translate-x-1/2 justify-center flex">
                <RadioGroup aria-labelledby="rb-images-select-post" name="imges select data" row >
                    {slides.map((_, index) => (
                        <div key={index} >
                            <Radio size='small' color='accent' checked={index === currentIndex} onClick={() => radioBtnClick(index)} />
                        </div>
                    ))}
                </RadioGroup>
            </div>
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
                <ShareView data={{ image: post?.image?.url, title: post?.title, info: post?.description }} meta={{ url: `/@${post?.author?.handle}/${post?.slug}` }} component={{ button: ListItemRdX, props: { link: { name: 'Share', icon: ShareOutlined } } }} />
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

export { PostViewActions, PostView_TIA, PostListView_TIA, PostListView2, PollView, ImagePostView };