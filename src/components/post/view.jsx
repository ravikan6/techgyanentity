import { Avatar } from "@mui/material";
import { ArticleImage } from "./_client";
import { getDate, formatDate } from "@/lib/utils";
import { PostActions } from "./postActions";

export const PostView = async ({ article }) => {
    if (article?.id) {
        if (article?.privacy === 'PRIVATE') {
            return (
                <main className="container m-auto">
                    <div className="bg-red-100 mt-20 border w-4/6 m-auto text-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Sorry, this article is private!</strong>
                        <br></br>
                        <span className="block sm:inline">Please check back later.</span>
                    </div>
                </main>
            );
        } else if (article?.privacy === 'PUBLIC' || article?.privacy === 'UNLISTED') {
            const publishedAt = getDate(article?.createdAt);
            const updatedAt = getDate(article?.updatedAt);

            return (
                <main className="container ">
                    <section className="flex space-x-14 px-3 md:px-0 mx-auto w-fit">
                        {/* <Script src={`${process.env.NEXTAUTH_URL}/code-prettier.js`} strategy="lazyOnload" /> */}
                        <div className="max-w-[680px] min-w-[500px] py-6">
                            <div className='mb-2'>
                                {article?.image && <figure
                                    key={article?.url}
                                    className="block mb-10 text-center break-inside-avoid-column">
                                    <ArticleImage image={article.image} />
                                    {/* <figcaption className="z-10 mt-4 text-sm italic text-gray-600">
                                    {article?.caption}
                                </figcaption> */}
                                </figure>}
                            </div>
                            <h1 className="text-4xl leading-10 karnak font-bold pb-3 mb-10">{article.title}</h1>
                            <div className="pb-7">
                                {article?.content && <div id="articleContent" dangerouslySetInnerHTML={{ __html: article?.content }} />}
                            </div>
                            <div className="mt-10 flex items-center flex-wrap space-x-4">
                                {
                                    article.tags && article.tags.map((tag) => <div className="bg-lightHead dark:bg-darkHead w-auto px-6 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-accentLight dark:hover:bg-accentDark hover:text-white cursor-pointer" key={tag}>{tag}</div>)
                                }
                            </div>
                        </div>
                        <div className="max-w-[300px] min-w-[300px] h-screen relative">
                            <div className="fixed h-screen max-w-[300px] pt-[54px] min-w-[300px] top-0 bottom-0 ">
                                <div className="border dark:border-slate-600 border-gray-300 mt-10 rounded-xl min-h-72 ">
                                    <h4 className="text-xl font-medium leading-6 dark:text-slate-400 text-gray-700 stymie pb-5">{article.description}</h4>
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-5 border-y-slate-500">
                                            <div className="flex items-center px-3 py-1">
                                                <div className="flex-shrink-0">
                                                    <Avatar sx={{ width: 40, height: 40, borderRadius: 1000 }} alt={article?.author?.id} />
                                                </div>
                                                <div className="flex flex-col justify-around ml-3">
                                                    <p className="text-sm karnak mb-0.5 font-semibold dark:text-slate-100 text-gray-900">
                                                        {article?.author?.id}
                                                    </p>
                                                    <div className="flex space-x-1 text-sm text-gray-600 dark:text-gray-300">
                                                        <div>
                                                            {'2 min'} read
                                                        </div>
                                                        <div area-hidden="true"> · </div>
                                                        <PostDate date={publishedAt} publishedAt={publishedAt} updatedAt={updatedAt} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <PostActions id={article.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            );
        }

    } else {
        return notFound();
    }
}


export const PostDate = (props) => {
    const publishedAt = props.publishedAt;
    const updatedAt = props.updatedAt;

    return (
        <>
            <div className="group relative transition-all duration-500">
                <time dateTime={props.date}>{publishedAt.date}</time>
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