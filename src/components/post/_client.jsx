"use client";
import { CldImage } from "next-cloudinary";
import { DrawerContext } from "../mainlayout";
import { useContext, useEffect, useState, createContext } from "react";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions } from "./postActions";
import { Avatar } from "@mui/material";


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
                <div className={`overflow-hidden z-[999] w-96 hidden min-[1017px]:block h-screen relative ${css}`}>
                    <div className={`fixed h-[calc(100%-68px)] bg-lightHead z-[998] dark:bg-darkHead rounded-xl p-4 border dark:border-slate-600 border-gray-300 w-full mt-[64px] top-0 bottom-0 ${css}`}>
                        {component}
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
            <div onClick={handleDescription} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer duration-500 mb-4 rounded-xl py-1 px-2">
                <h1 className="text-xl karnak mb-1.5 font-bold">{article.title}</h1>
                <div className="flex space-x-1 items-center justify-between font-semibold mb-3 text-sm text-gray-800 dark:text-gray-200">
                    <div>233 views</div>
                    {/* <div area-hidden="true"> · </div> */}
                    <div>
                        {'2 min'} read
                    </div>
                    {/* <div area-hidden="true"> · </div> */}
                    <PostDate date={article?.createdAt} publishedAt={publishedAt} updatedAt={updatedAt} />
                </div>
                <h4 className="text-sm font-medium dark:text-gray-300 text-gray-700">{article.description?.slice(0, 100) + ((article.description?.length > 50) && '...')}<span className="font-bold">more</span></h4>
            </div>
            <div className=" min-h-44 ">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-5 border-y-slate-500">
                        <div className="flex items-center px-3 py-1">
                            <div className="flex-shrink-0">
                                <Avatar sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={article?.author?.name} >{article?.author?.name.slice(0, 1)}</Avatar>
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
                    </div>
                    <PostActions id={article.id} />
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
        <>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-5 border-y-slate-500">
                    <div className="flex items-center px-3 py-1">
                        <div className="flex-shrink-0">
                            <Avatar sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={article?.author?.name} >{article?.author?.name.slice(0, 1)}</Avatar>
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
                    <div className="cursor-pointer" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <PostActions id={article.id} />
            </div>
        </>
    );
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