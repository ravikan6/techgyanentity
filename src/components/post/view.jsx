import { ArticleImage, ArticleSidebar } from "./_client";


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
            const css = `min-[1017px]:max-w-[calc(100%-370px)] w-full min-[1055px]:max-w-[calc(100%-424px)] min-[1101px]:max-w-[calc(100%-460px)] min-[1195px]:max-w-[calc(100%-500px)] min-[1256px]:max-w-[calc(100%-525px)] min-[1300px]:max-w-[calc(100%-485px)]`;
            return (
                <main className="overflow-clip ">
                    <section className="flex space-x-14 px-3 justify-center md:px-0 mx-auto">
                        {/* <Script src={`${process.env.NEXTAUTH_URL}/code-prettier.js`} strategy="lazyOnload" /> */}
                        <div className={`${css} py-6`}>
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
                            <div className="pb-7">
                                {article?.content && <div id="articleContent" dangerouslySetInnerHTML={{ __html: article?.content }} />}
                            </div>
                            <div className="mt-10 flex items-center flex-wrap space-x-4">
                                {
                                    article.tags && article.tags.map((tag) => <div className="bg-lightHead dark:bg-darkHead w-auto px-6 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-accentLight dark:hover:bg-accentDark hover:text-white cursor-pointer" key={tag}>{tag}</div>)
                                }
                            </div>
                        </div>
                        <ArticleSidebar article={article} />
                    </section>
                </main>
            );
        }

    } else {
        return notFound();
    }
}

