'use server';
import { VariantPersistent } from "../header";
import { ArticleImage, ArticleTopMeta } from "./_client";


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
            return (
                <main className="overflow-clip max-w-[2400px] mx-auto">
                    <VariantPersistent />
                    <section className={`flex flex-col lg:flex-row lg:space-x-18 justify-between md:px-0 `}>
                        <div className={`lg:w-[calc(100%-475px)] w-full py-3`}>
                            <div className="max-w-xl w-full mx-auto">
                                <div className='mb-2'>
                                    {article?.image && (
                                        <figure
                                            key={article?.url}
                                            className="block mb-10 text-center break-inside-avoid-column"
                                        >
                                            <ArticleImage image={article.image} />
                                            <figcaption className="z-10 mt-4 text-sm italic text-gray-600">
                                                {article?.image?.caption}
                                            </figcaption>
                                        </figure>
                                    )}
                                </div>
                                <ArticleTopMeta article={article} />
                                <div id="article_topMeta" className="mb-6 pb-4 border-b block lg:hidden border-gray-500 border-t pt-4">

                                </div>
                                <div className="pb-7">
                                    {article?.content && <div id="articleContent" dangerouslySetInnerHTML={{ __html: article?.content }} />}
                                </div>
                                <div className="mt-8 flex items-center flex-wrap justify-evenly">
                                    {
                                        article.tags && article.tags.map((tag) => <div className="bg-lightHead mt-2 dark:bg-darkHead w-auto px-6 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-accentLight dark:hover:bg-accentDark hover:text-white cursor-pointer" key={tag}>{tag}</div>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div id="article_sidebar">

                        </div>
                    </section>
                </main>
            );
        }
    } else {
        return notFound();
    }
}
