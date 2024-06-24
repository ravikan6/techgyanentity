"use client";
import { CldImage } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext } from "react";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions } from "./postActions";
import { Avatar, Skeleton, SwipeableDrawer, useMediaQuery } from "@mui/material";
import { Button, IconButton, Tooltip } from "../rui";
import { EmailRounded } from "@mui/icons-material";
import { formatLocalDate } from "@/lib/helpers";
import { CloseBtn } from "../Buttons";
import { LuUser } from "react-icons/lu";
import useQuery from "@/hooks/useMediaQuery";

export const ArticleImage = ({ image, classes }) => {
    return <CldImage
        src={image?.url}
        alt={image.alt}
        width={720}
        height={480}
        sizes="100vw"
        loading='lazy'
        enhance
        sanitize
        className={`rounded-2xl w-full h-auto ${classes}`}
    />
}

export const ArticleWrapper = ({ children }) => {
    const context = useContext(DrawerContext);

    useEffect(() => {
        context.setVariant('persistent');
        context.setOpen(false);
    }, []);

    return <div className="">
        {children}
    </div>
}

const SidebarContext = createContext();

export const ArticleSidebar = ({ article }) => {
    const [component, setComponent] = useState(<SidebarContent article={article} />);
    const css = `min-[1017px]:max-w-[313px] min-[1055px]:max-w-[363px] min-[1101px]:max-w-[393px] min-[1195px]:max-w-[410px] min-[1256px]:max-w-[425px] min-[1300px]:max-w-[410px]`;

    return (
        <>
            <SidebarContext.Provider value={{ setComponent }}>
                <div className={`overflow-hidden z-[999] w-96  min-[1017px]:block h-screen relative ${css}`}>
                    <div className={`fixed h-[calc(100%-68px)] overflow-hidden bg-lightHead z-[998] dark:bg-darkHead rounded-xl border dark:border-slate-600 border-gray-300 w-full mt-[64px] top-0 bottom-0 ${css}`}>
                        <section className="relative h-[calc(100%-1px)] overflow-hidden">
                            {component}
                        </section>
                    </div>
                </div>
            </SidebarContext.Provider>
        </>
    );
}

const SidebarContent = ({ article }) => {
    const publishedAt = getDate(article?.createdAt);
    const updatedAt = getDate(article?.updatedAt);

    const { setComponent } = useContext(SidebarContext);

    const handleDescription = () => {
        setComponent(<Description article={article} publishedAt={publishedAt} updatedAt={updatedAt} />);
    }

    return (
        <>
            <div className="h-[calc(100%-0px)] p-4 overflow-x-hidden">
                <ArticleTop article={article} onClick={handleDescription} />
                <div className="min-h-44">
                    <div className="mb-8">
                        <ArticleAuthor article={article} />
                        <PostActions id={article.id} />
                    </div>
                </div>
            </div>
        </>
    );
};

const Description = ({ article, publishedAt, updatedAt }) => {
    const { setComponent } = useContext(SidebarContext);

    const onClose = () => {
        setComponent(<SidebarContent article={article} />);
    }
    return (
        <DescriptionContent article={article} onClose={onClose} />
    );
}

const DescriptionContent = ({ article, onClose }) => {
    return (
        <>
            <div className="bg-lightHead px-4 shadow-sm dark:bg-darkHead absolute flex items-center justify-between top-0 left-0 w-full h-14">
                <h2 className="text-base font-bold ">
                    About
                </h2>
                <CloseBtn onClick={onClose} />
            </div>
            <div className="h-[calc(100%-62px)] p-4 overflow-x-hidden mt-14 pb-14">
                <div className="">
                    <h1 className="text-base cheltenham mb-3 font-bold">{article.title}</h1>
                    <div className="flex space-x-1 items-center justify-between font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                        <div className={`flex flex-col items-center justify-center`}>
                            <span className="mb-0.5 cheltenham">233</span>
                            <span>views</span>
                        </div>
                        <Tooltip title="average read time" placement="top" arrow>
                            <div className={`flex flex-col items-center justify-center`}>
                                <span className="mb-0.5 cheltenham">{'2 min'}</span>
                                <span>read</span>
                            </div>
                        </Tooltip>
                        <PostDatePublished date={article?.createdAt} expanded />
                    </div>
                </div>
                <div className="my-4">
                    <h4 className="text-sm mx-1 bg-light dark:bg-dark p-3 rounded-md font-medium dark:text-gray-300 text-gray-700">{article.description}</h4>
                </div>
                <div className="flex justify-between items-center mb-5 border-y-slate-500">
                    <div className="flex items-center py-1">
                        <div className="flex-shrink-0">
                            <Avatar src={article?.author?.image?.url} sx={{ width: 50, height: 50, borderRadius: 1000 }} alt={article?.author?.name} >{article?.author?.name.slice(0, 1)}</Avatar>
                        </div>
                        <div className="flex flex-col justify-around ml-5">
                            <p className="text-base karnak mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                {article?.author?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                2k followers
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center mt-2 space-x-4">
                    <Button variant="outlined" sx={{ px: 2 }} color="button" startIcon={<LuUser className="w-4 h-4 mr-1" />} size="small" >About</Button>
                    <Button variant="outlined" sx={{ px: 2 }} color="button" startIcon={<EmailRounded className="w-4 h-4 mr-1" />} size="small" >Contact</Button>
                    <Button variant="contained" color="primary" size="small" >Follow</Button>
                </div>
            </div>
        </>
    )
}

export const PostDate = (props) => {
    const publishedAt = props.publishedAt;
    const updatedAt = props.updatedAt;

    return (
        <>
            <div className="group relative transition-all duration-500">
                <time dateTime={props.date}>{formatDate(props?.date)}</time>
                <div className="hidden opacity-0 transition-all duration-500 group-hover:opacity-100 p-5 group-hover:block absolute -right-4 top-8 border rounded-xl shadow-dark/20 z-[2] dark:border-darkHead dark:shadow-light/20 shadow-md border-t-2 dark:bg-dark border-t-accentLight dark:border-t-accentDark bg-light">
                    <table className="table-auto">
                        <thead className="text-slate-800 dark:text-gray-200">
                            <tr>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Published At</th>
                                <th className="px-4 py-2">Updated At</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-gray-300">
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">Date</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.date}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.date}</td>
                            </tr>
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">time</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.time}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.time}</td>
                            </tr>
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">ISO</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.ISO}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.ISO}</td>
                            </tr>
                            <tr>
                                <td className="border text-black dark:text-white font-bold border-secondary dark:border-secondaryDark px-4 py-2">Day</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{publishedAt.dayOfWeek}</td>
                                <td className="border border-secondary dark:border-secondaryDark px-4 py-2">{updatedAt.dayOfWeek}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-sm text-center text-gray-500 mt-2">
                        {publishedAt.diff}
                    </div>
                </div>
            </div>

        </>
    );
}


const PostDatePublished = ({ date, expanded }) => {

    return (
        <>
            <Tooltip title={<>{new Date(date).toLocaleString()}</>} placement="top" arrow>
                <div className={`flex flex-col items-center justify-center`}>
                    {expanded && <span className="mb-0.5 cheltenham">{new Date(date).getFullYear()}</span>}
                    <time dateTime={date}>{formatDate(date)}</time>
                </div>
            </Tooltip>
        </>
    )
}

export const PostWrapper = ({ children, article }) => {
    let width = useMediaQuery('(min-width:945px)');
    const mediaWidth = useQuery('(min-width:945px)');
    const [drawable, setDrawable] = useState(false);

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <>
            <section className={`flex xl:flex-row space-x-14 justify-center md:px-0 mx-auto ${mediaWidth == 'undefined' && 'hidden'}`}>
                <div className={`max-w-xl w-full py-6`}>
                    <div className='mb-2'>
                        {article?.image && (
                            <figure
                                key={article?.url}
                                className="block mb-10 text-center break-inside-avoid-column"
                            >
                                <ArticleImage image={article.image} />
                                {/* <figcaption className="z-10 mt-4 text-sm italic text-gray-600">
                                    {article?.caption}
                                </figcaption> */}
                            </figure>
                        )}
                    </div>
                    {!width && (
                        <>
                            <div className="mt-5 mb-10">
                                <ArticleTop article={article} onClick={() => setDrawable(!drawable)} hSize="text-2xl mb-4" />
                                <ArticleAuthor article={article} />
                                <div className="mt-4">
                                    <PostActions modern id={article.id} />
                                </div>
                            </div>
                            <SwipeableDrawer container={container} minFlingVelocity={500} disableSwipeToOpen={false}
                                swipeAreaWidth={40}
                                ModalProps={{
                                    keepMounted: true,
                                }} anchor="bottom" open={drawable} onClose={() => setDrawable(false)} onOpen={() => setDrawable(true)}>
                                <DescriptionContent article={article} onClose={() => setDrawable(false)} />
                            </SwipeableDrawer>
                        </>
                    )}
                    {children}
                </div>
                {width && (
                    <ArticleSidebar article={article} />
                )}
            </section>
            {mediaWidth == 'undefined' && (
                <>
                    <div className="mx-auto max-w-xl">
                        <Skeleton animation="wave" variant="rounded" width={'100%'} height={300} />
                        <Skeleton animation="wave" variant="text" width={'100%'} className="!mt-10" height={40} />
                        <div className="flex items-center justify-between mt-10">
                            <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                            <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                            <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                            <Skeleton animation="wave" variant="circular" width={40} className="" height={40} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

const ArticleAuthor = ({ article }) => {
    return (
        <>
            <div className="flex justify-between space-x-2 items-center mb-5 border-y-slate-500">
                <div className="flex items-center py-1">
                    <div className="flex-shrink-0">
                        <Avatar src={article?.author?.image?.url} sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={article?.author?.name} >{article?.author?.name.slice(0, 1)}</Avatar>
                    </div>
                    <div className="flex flex-col justify-around ml-3">
                        <p className="text-sm karnak mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                            {article?.author?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                            2k followers
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <IconButton className="bg-light dark:bg-dark" size="small" color="accent" >
                        <EmailRounded className="w-4 h-4" />
                    </IconButton>
                    <Button variant="contained" color="primary" size="small" >Follow</Button>
                </div>
            </div>
        </>
    )
}

const ArticleTop = ({ article, onClick = () => { }, hSize = 'text-xl' }) => {

    return (
        <>
            <div onClick={onClick} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer duration-500 mb-4 rounded-xl py-1 px-2">
                <h1 className={`karnak mb-1.5 font-bold ${hSize}`}>{article.title}</h1>
                <div className="flex space-x-1 items-center justify-between font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                    <div>233 views</div>
                    <div>
                        {'2 min'} read
                    </div>
                    <PostDatePublished date={article?.createdAt} />
                </div>
                <h4 className="text-sm font-medium dark:text-gray-300 text-gray-700">{article.description?.slice(0, 100) + ((article.description?.length > 50) && '...')}<span className="font-bold">more</span></h4>
            </div>
        </>
    )

}