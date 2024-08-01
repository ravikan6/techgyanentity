"use client";
import Link from "next/link";
import { ArticleImage } from "./_client";
import { formatDate, formatDateToString } from "@/lib/utils";
import { useState } from "react";
import { IconButton, Menu } from "../rui";
import { Skeleton } from "@mui/material";
import { ListItemRdX } from "../Home/_profile-model";
import { HeartBrokenOutlined } from "@mui/icons-material";
import { AuthorAvatar } from "../author/_client";
import { BsThreeDots } from "react-icons/bs";


const PostView_TIA = ({ data }) => {

    return (
        <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                {
                    data?.list?.map((post) => (
                        <div key={post?.slug} className="relative group/g_pst transition-opacity duration-300">
                            <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                <ArticleImage className="rounded-xl" image={post?.image} />
                            </Link>
                            <div className="mt-2 h-20 flex flex-nowrap items-start justify-between">
                                <div className="grow">
                                    <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`} className="w-full">
                                        <h2 className="text-base font-bold cheltenham line-clamp-2 text-ellipsis">{post.title}</h2>
                                    </Link>
                                    <div className="flex justify-between items-center opacity-100">
                                        <span className="mt-1.5 text-zinc-700 dark:text-zinc-300 text-sm imperial">
                                            <time dateTime={post?.publishedAt}>{formatDateToString(post?.publishedAt).short}</time> • 0 Views
                                        </span>
                                        <PostViewActions id={post?.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <p className="text-gray-500 dark:text-gray-400">Yah!, you reach the end.</p>
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

const PostListView2 = ({ data }) => {

    return (
        <>
            <div className="flex flex-col items-center gap-3">
                {
                    data?.list?.map((post) => (
                        <article key={post?.slug} className="w-full first-of-type:border-t-0 lg:!border border-t border-slate-200 dark:border-slate-800/80 rounded-none lg:rounded-2xl pt-5 bg-white dark:bg-slate-950 flex flex-col gap-4 md:gap-5 md:pt-8 lg:p-6 lg:pb-5">
                            <section className="flex flex-col gap-2 sm:gap-4">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center justify-start gap-3">
                                            <Link href={`/@${post?.author?.handle || data?.author?.handle}`} >
                                                <div className="flex items-center justify-center bg-slate-100 cursor-pointer relative w-10 h-10 rounded-full overflow-hidden">
                                                    <div className="css-iyw3ow">
                                                        <AuthorAvatar data={{ url: post?.author?.image?.url }} />
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="flex flex-col">
                                                <div className="flex flex-row justify-start items-center text-sm gap-1">
                                                    <div className="flex gap-2">
                                                        <Link href={`/@${post?.author?.handle || data?.author?.handle}`} >
                                                            <span className="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">{post?.author?.name || data?.author?.name}</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center justify-start gap-1">
                                                    <div className="flex-row items-center justify-start gap-1 hidden sm:flex">
                                                        <a target="_blank" rel="noopener" href="https://gatete.hashnode.dev">
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal hidden sm:block">www.example.com</p>
                                                        </a>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-normal hidden sm:block">·</p>
                                                    </div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                                                        {formatDateToString(post?.publishedAt).short}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                        {/* <button type="button" aria-label="Featured on Hashnode">
                            <div className="flex items-center justify-center gap-1 w-auto rounded-full font-sans font-semibold text-indigo-700 text-indigo-700 dark:text-indigo-50 bg-indigo-100 dark:bg-indigo-900 cursor-pointer text-sm px-3 py-1" data-state="closed">
                                <svg className="flex items-center justify-center w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.1952 21.9803L23.1253 16.3648L23.3989 16.0915C23.8268 15.6637 24.1662 15.1559 24.3978 14.597C24.6293 14.0381 24.7485 13.439 24.7485 12.834C24.7485 12.229 24.6293 11.6299 24.3978 11.071C24.1662 10.5121 23.8268 10.0043 23.3989 9.57654L19.2576 5.43494C18.3935 4.57098 17.2216 4.08563 15.9996 4.08563C14.7777 4.08563 13.6058 4.57098 12.7416 5.43494L11.5683 6.60827L11.2216 5.02694C11.1755 4.81606 11.0586 4.62729 10.8905 4.49194C10.7223 4.3566 10.5129 4.2828 10.2971 4.2828C10.0812 4.2828 9.87184 4.3566 9.70368 4.49194C9.53552 4.62729 9.41868 4.81606 9.37255 5.02694L8.84108 7.4536L6.92748 7.9368C6.72321 7.98838 6.542 8.10664 6.41254 8.27286C6.28308 8.43907 6.21278 8.64372 6.21278 8.8544C6.21278 9.06508 6.28308 9.26974 6.41254 9.43595C6.542 9.60216 6.72321 9.72042 6.92748 9.772L8.16162 10.084C7.50147 10.9711 7.18255 12.0661 7.26314 13.1689C7.34373 14.2717 7.81845 15.3087 8.60055 16.0904L8.87415 16.3637L3.80455 21.9808C3.68676 22.1112 3.60761 22.2719 3.57596 22.4447C3.54431 22.6176 3.56142 22.7958 3.62537 22.9595C3.68931 23.1232 3.79757 23.2659 3.93802 23.3715C4.07846 23.4771 4.24555 23.5416 4.42055 23.5576L7.75388 23.8627L8.39655 27.1496C8.43031 27.3223 8.51157 27.4822 8.63121 27.6113C8.75085 27.7404 8.90411 27.8336 9.07379 27.8804C9.24347 27.9272 9.42283 27.9257 9.59172 27.8762C9.76062 27.8267 9.91236 27.731 10.0299 27.6L15.4917 21.5528C15.8296 21.5912 16.1707 21.5912 16.5085 21.5528L21.9712 27.6024C22.0891 27.7328 22.2409 27.8278 22.4097 27.8768C22.5785 27.9258 22.7576 27.9268 22.927 27.8798C23.0964 27.8327 23.2493 27.7394 23.3686 27.6104C23.4879 27.4813 23.569 27.3216 23.6027 27.1491L24.2445 23.8619L27.5795 23.5568C27.7546 23.5408 27.9217 23.4763 28.0622 23.3707C28.2027 23.265 28.311 23.1223 28.375 22.9585C28.4389 22.7947 28.4559 22.6164 28.4242 22.4434C28.3924 22.2705 28.3132 22.1099 28.1952 21.9795V21.9803Z" fill="white"></path><path d="M21.8203 16.3315L27.4931 22.6152L23.4515 22.9845L19.5208 18.6309L21.8203 16.3315Z" fill="#F67171"></path><path d="M23.7931 12.5728L23.7584 12.5747C23.64 13.3419 23.2796 14.0513 22.7296 14.5992L21.8203 15.5085L19.52 17.808L18.5867 18.7413C18.2467 19.0813 17.8431 19.351 17.399 19.5349C16.9548 19.7189 16.4788 19.8136 15.998 19.8136C15.5172 19.8136 15.0412 19.7189 14.597 19.5349C14.1528 19.351 13.7493 19.0813 13.4093 18.7413L12.476 17.808L10.1773 15.5085L9.26799 14.5992C8.71803 14.0513 8.35756 13.3419 8.2392 12.5747L8.20453 12.5728C8.26709 11.6942 8.64473 10.8677 9.26799 10.2453L9.70986 9.80425L10.2949 12.4824L10.9549 9.48265L13.4379 8.85545L11.2192 8.29545L13.4109 6.10372C14.0976 5.41733 15.0287 5.03174 15.9996 5.03174C16.9705 5.03174 17.9016 5.41733 18.5883 6.10372L22.7296 10.2451C23.3529 10.8675 23.7306 11.6941 23.7931 12.5728ZM17.8115 14.6453C18.1698 14.287 18.4139 13.8304 18.5128 13.3333C18.6116 12.8363 18.5609 12.3211 18.3669 11.8528C18.173 11.3846 17.8446 10.9844 17.4232 10.7029C17.0018 10.4213 16.5064 10.271 15.9996 10.271C15.4928 10.271 14.9974 10.4213 14.576 10.7029C14.1546 10.9844 13.8262 11.3846 13.6322 11.8528C13.4383 12.3211 13.3876 12.8363 13.4864 13.3333C13.5853 13.8304 13.8294 14.287 14.1877 14.6453C14.4256 14.8833 14.7081 15.0721 15.019 15.2008C15.3299 15.3296 15.6631 15.3959 15.9996 15.3959C16.3361 15.3959 16.6693 15.3296 16.9802 15.2008C17.2911 15.0721 17.5735 14.8833 17.8115 14.6453Z" fill="#3C81F4"></path><path d="M19.5208 18.6309L23.4515 22.9845L23.2696 23.9171L19.1109 19.0408L19.5208 18.6309Z" fill="#DA2626"></path><path d="M19.1109 19.04L23.2709 23.9163L22.6736 26.968L16.8624 20.5333C17.5162 20.3758 18.1136 20.0402 18.5883 19.5637L19.1109 19.04Z" fill="#F67171"></path><path d="M15.9995 15.396C17.4145 15.396 18.5616 14.2486 18.5616 12.8333C18.5616 11.418 17.4145 10.2707 15.9995 10.2707C14.5845 10.2707 13.4373 11.418 13.4373 12.8333C13.4373 14.2486 14.5845 15.396 15.9995 15.396Z" fill="#F7F8F9"></path><path d="M13.4109 19.5635C13.8858 20.0401 14.4835 20.3758 15.1376 20.5333L9.3264 26.968L8.7056 23.7928L12.8579 19.0104L13.4109 19.5635Z" fill="#F67171"></path><path d="M13.4379 8.85547L10.9549 9.48267L10.2973 12.4824L9.71228 9.80427L9.64054 9.48267L7.15921 8.85547L9.64054 8.22907L10.2973 5.22934L10.9549 8.22907L11.2192 8.29574L13.4379 8.85547Z" fill="#F8CA15"></path><path d="M12.8579 19.0104L8.70666 23.7928H8.7056L8.54773 22.9845L12.4784 18.6309L12.8579 19.0104Z" fill="#DA2626"></path><path d="M10.1797 16.3315L12.4784 18.6309L8.54772 22.9845L4.50665 22.6152L10.1797 16.3315Z" fill="#F67171"></path><path d="M22.7296 14.5992C23.2796 14.0513 23.64 13.3419 23.7584 12.5747L23.7931 12.5728C23.8309 13.0963 23.7554 13.6217 23.5719 14.1134C23.3884 14.6051 23.1011 15.0515 22.7296 15.4221L21.8203 16.3315L19.52 18.6309L19.1109 19.04L18.5883 19.5627C18.1137 20.0395 17.5163 20.3755 16.8624 20.5333C16.2956 20.6699 15.7044 20.6699 15.1376 20.5333C14.4835 20.3758 13.8859 20.0402 13.4109 19.5637L12.8587 19.0104L12.4792 18.6317L10.1805 16.3323L9.2712 15.4229C8.89968 15.0523 8.61238 14.6059 8.42887 14.1142C8.24536 13.6225 8.16993 13.0971 8.20773 12.5736L8.2424 12.5755C8.36076 13.3427 8.72123 14.0521 9.2712 14.6L10.1805 15.5093L12.4792 17.8088L13.4125 18.7421C13.7525 19.0821 14.156 19.3518 14.6002 19.5359C15.0444 19.7199 15.5204 19.8146 16.0012 19.8146C16.482 19.8146 16.958 19.7199 17.4022 19.5359C17.8464 19.3518 18.2499 19.0821 18.5899 18.7421L19.5232 17.8088L21.8227 15.5093L22.7296 14.5992Z" fill="#4338C8"></path><path d="M21.8203 16.4549C21.7959 16.4549 21.772 16.4477 21.7517 16.4342C21.7314 16.4206 21.7156 16.4013 21.7062 16.3788C21.6968 16.3563 21.6944 16.3314 21.6991 16.3075C21.7038 16.2835 21.7156 16.2615 21.7328 16.2443L22.6424 15.3349C22.971 15.0065 23.2316 14.6166 23.4095 14.1874C23.5873 13.7583 23.6788 13.2983 23.6788 12.8337C23.6788 12.3692 23.5873 11.9092 23.4095 11.48C23.2316 11.0508 22.971 10.6609 22.6424 10.3325L18.5011 6.19146C17.8376 5.52809 16.9378 5.15543 15.9996 5.15543C15.0614 5.15543 14.1616 5.52809 13.4981 6.19146L11.3067 8.38319C11.2833 8.40521 11.2523 8.41725 11.2201 8.41676C11.188 8.41626 11.1574 8.40327 11.1347 8.38054C11.112 8.35781 11.099 8.32713 11.0986 8.29502C11.0981 8.2629 11.1102 8.23188 11.1323 8.20853L13.3237 6.01679C14.0335 5.30716 14.9961 4.90851 15.9997 4.90851C17.0034 4.90851 17.966 5.30716 18.6757 6.01679L22.8173 10.1581C23.1688 10.5094 23.4476 10.9266 23.6378 11.3856C23.828 11.8447 23.9259 12.3368 23.9259 12.8337C23.9259 13.3307 23.828 13.8227 23.6378 14.2818C23.4476 14.7409 23.1688 15.158 22.8173 15.5093L21.9077 16.4189C21.8963 16.4304 21.8826 16.4395 21.8676 16.4457C21.8526 16.4518 21.8365 16.455 21.8203 16.4549Z" fill="#333333"></path><path d="M16 20.7584C15.6996 20.7582 15.4003 20.7224 15.1083 20.6517C15.0771 20.6435 15.0503 20.6234 15.0337 20.5956C15.0172 20.5679 15.0122 20.5348 15.0197 20.5034C15.0273 20.472 15.0469 20.4448 15.0742 20.4277C15.1016 20.4106 15.1346 20.4048 15.1661 20.4117C15.7141 20.5435 16.2854 20.5435 16.8333 20.4117C16.8649 20.4048 16.8979 20.4106 16.9253 20.4277C16.9526 20.4448 16.9722 20.472 16.9798 20.5034C16.9873 20.5348 16.9823 20.5679 16.9657 20.5956C16.9492 20.6234 16.9224 20.6435 16.8912 20.6517C16.5994 20.7224 16.3003 20.7582 16 20.7584Z" fill="#333333"></path><path d="M13.4109 19.6869C13.3947 19.687 13.3786 19.6838 13.3636 19.6776C13.3485 19.6714 13.3349 19.6622 13.3235 19.6507L12.7752 19.1016C12.7572 19.0848 12.7446 19.063 12.7391 19.039C12.7336 19.015 12.7354 18.9899 12.7443 18.967C12.7532 18.944 12.7688 18.9242 12.789 18.9102C12.8093 18.8962 12.8333 18.8885 12.8579 18.8883C12.8741 18.8883 12.8901 18.8915 12.9051 18.8977C12.9201 18.9039 12.9336 18.9131 12.9451 18.9245L13.4973 19.4776C13.5146 19.4949 13.5263 19.5169 13.531 19.5408C13.5358 19.5647 13.5333 19.5895 13.524 19.612C13.5147 19.6346 13.4989 19.6538 13.4786 19.6674C13.4584 19.681 13.4345 19.6882 13.4101 19.6883L13.4109 19.6869Z" fill="#333333"></path><path d="M12.8579 19.1331C12.8417 19.1331 12.8256 19.13 12.8107 19.1238C12.7957 19.1176 12.7821 19.1085 12.7707 19.0971L12.3912 18.7184C12.3792 18.7071 12.3696 18.6934 12.3629 18.6783C12.3562 18.6632 12.3527 18.6469 12.3524 18.6304C12.3521 18.6139 12.3552 18.5975 12.3614 18.5822C12.3676 18.5669 12.3768 18.553 12.3885 18.5413C12.4002 18.5296 12.4141 18.5203 12.4294 18.5141C12.4447 18.5079 12.461 18.5048 12.4776 18.505C12.4941 18.5053 12.5104 18.5088 12.5255 18.5155C12.5406 18.5221 12.5543 18.5317 12.5656 18.5437L12.9451 18.9221C12.9682 18.9453 12.9812 18.9767 12.9812 19.0095C12.9812 19.0422 12.9682 19.0736 12.9451 19.0968C12.9337 19.1083 12.9201 19.1174 12.9051 19.1237C12.8901 19.1299 12.8741 19.1331 12.8579 19.1331Z" fill="#333333"></path><path d="M10.1797 16.4549C10.1636 16.455 10.1475 16.4518 10.1326 16.4456C10.1176 16.4394 10.104 16.4304 10.0925 16.4189L9.18295 15.5093C8.8315 15.158 8.55272 14.7409 8.36251 14.2818C8.1723 13.8227 8.0744 13.3307 8.0744 12.8337C8.0744 12.3368 8.1723 11.8447 8.36251 11.3857C8.55272 10.9266 8.8315 10.5094 9.18295 10.1581L9.62508 9.71706C9.63642 9.70505 9.65006 9.69544 9.66518 9.6888C9.68031 9.68216 9.69661 9.67862 9.71313 9.67839C9.72964 9.67816 9.74604 9.68124 9.76134 9.68747C9.77664 9.69369 9.79054 9.70292 9.80221 9.7146C9.81388 9.72629 9.82309 9.74021 9.82929 9.75552C9.83548 9.77083 9.83855 9.78723 9.83829 9.80374C9.83804 9.82026 9.83447 9.83656 9.82781 9.85167C9.82114 9.86678 9.81151 9.88041 9.79948 9.89173L9.35762 10.3328C9.02905 10.6612 8.7684 11.0511 8.59057 11.4802C8.41274 11.9094 8.32121 12.3693 8.32121 12.8339C8.32121 13.2984 8.41274 13.7584 8.59057 14.1875C8.7684 14.6167 9.02905 15.0066 9.35762 15.3349L10.2669 16.2443C10.2842 16.2615 10.2959 16.2835 10.3006 16.3074C10.3054 16.3314 10.3029 16.3561 10.2936 16.3787C10.2843 16.4012 10.2685 16.4205 10.2482 16.4341C10.228 16.4476 10.2041 16.4549 10.1797 16.4549Z" fill="#333333"></path><path d="M16 15.52C15.3786 15.5201 14.7764 15.3048 14.2959 14.9106C13.8155 14.5165 13.4866 13.9679 13.3653 13.3585C13.244 12.749 13.3377 12.1164 13.6306 11.5683C13.9235 11.0202 14.3973 10.5907 14.9714 10.3528C15.5455 10.1149 16.1843 10.0835 16.779 10.2639C17.3736 10.4442 17.8874 10.8252 18.2326 11.3418C18.5779 11.8585 18.7333 12.4789 18.6724 13.0973C18.6115 13.7157 18.3381 14.2939 17.8987 14.7333C17.6499 14.9835 17.3541 15.1819 17.0282 15.3169C16.7022 15.4519 16.3528 15.521 16 15.52ZM16 10.3952C15.5989 10.3951 15.2039 10.4939 14.8501 10.6829C14.4963 10.8719 14.1946 11.1453 13.9717 11.4787C13.7488 11.8122 13.6116 12.1955 13.5722 12.5947C13.5328 12.9939 13.5925 13.3966 13.746 13.7672C13.8994 14.1378 14.1419 14.4648 14.452 14.7193C14.762 14.9738 15.13 15.1479 15.5234 15.2262C15.9168 15.3044 16.3235 15.2845 16.7073 15.168C17.0912 15.0516 17.4404 14.8423 17.724 14.5587C18.0653 14.2176 18.2978 13.7831 18.3921 13.3099C18.4863 12.8367 18.4382 12.3462 18.2536 11.9004C18.0691 11.4546 17.7564 11.0736 17.3553 10.8055C16.9541 10.5374 16.4825 10.3944 16 10.3944V10.3952Z" fill="#333333"></path><path d="M8.54799 23.108H8.53652L4.49545 22.7381C4.47262 22.736 4.45084 22.7276 4.43254 22.7137C4.41424 22.6999 4.40014 22.6813 4.39184 22.6599C4.38353 22.6386 4.38134 22.6153 4.38551 22.5927C4.38968 22.5702 4.40005 22.5493 4.41545 22.5323L10.088 16.2488C10.0992 16.2364 10.1129 16.2264 10.1281 16.2194C10.1433 16.2124 10.1598 16.2087 10.1765 16.2083C10.1933 16.2072 10.2101 16.2099 10.2258 16.2161C10.2414 16.2223 10.2555 16.2319 10.2669 16.2443L12.5656 18.5437C12.5887 18.5669 12.6018 18.5983 12.6018 18.6311C12.6018 18.6638 12.5887 18.6952 12.5656 18.7184C12.5424 18.7416 12.511 18.7546 12.4783 18.7546C12.4455 18.7546 12.4141 18.7416 12.3909 18.7184L10.1843 16.5107L4.76372 22.5147L8.55892 22.8613C8.59049 22.8643 8.61972 22.8793 8.64055 22.9032C8.66138 22.9271 8.67222 22.9581 8.67081 22.9897C8.66941 23.0214 8.65587 23.0513 8.633 23.0733C8.61014 23.0953 8.57969 23.1076 8.54799 23.1077V23.108Z" fill="#333333"></path><path d="M9.3264 27.0915C9.31522 27.0914 9.3041 27.0899 9.29333 27.0869C9.27124 27.0808 9.25129 27.0687 9.23571 27.0519C9.22012 27.035 9.20951 27.0142 9.20506 26.9917L8.42666 23.0083C8.42294 22.9894 8.42365 22.97 8.42875 22.9515C8.43384 22.933 8.44317 22.9159 8.456 22.9016L12.3867 18.5483C12.3979 18.5359 12.4115 18.5259 12.4268 18.5189C12.442 18.5119 12.4585 18.5081 12.4752 18.5077C12.492 18.507 12.5087 18.5098 12.5243 18.516C12.5399 18.5222 12.5539 18.5317 12.5656 18.5437L13.4989 19.4771C13.9581 19.937 14.5354 20.2611 15.1672 20.4136C15.188 20.4186 15.2072 20.429 15.2228 20.4436C15.2385 20.4583 15.25 20.4768 15.2563 20.4972C15.2626 20.5177 15.2635 20.5395 15.2589 20.5604C15.2543 20.5813 15.2442 20.6007 15.2299 20.6165L9.41786 27.0507C9.40634 27.0635 9.39223 27.0738 9.37647 27.0808C9.36071 27.0878 9.34365 27.0915 9.3264 27.0915ZM8.6808 23.0216L9.4008 26.7016L14.9109 20.5997C14.3113 20.4199 13.7658 20.0937 13.3235 19.6507L12.4829 18.8101L8.6808 23.0216Z" fill="#333333"></path><path d="M23.4512 23.108C23.4195 23.1079 23.3891 23.0956 23.3662 23.0736C23.3433 23.0516 23.3298 23.0217 23.3284 22.99C23.327 22.9583 23.3378 22.9273 23.3586 22.9034C23.3795 22.8795 23.4087 22.8646 23.4403 22.8616L27.2363 22.5149L21.8157 16.5107L19.608 18.7184C19.5846 18.7404 19.5536 18.7525 19.5215 18.752C19.4894 18.7515 19.4587 18.7385 19.436 18.7158C19.4133 18.693 19.4004 18.6624 19.3999 18.6302C19.3995 18.5981 19.4116 18.5671 19.4336 18.5437L21.7333 16.2443C21.7449 16.2321 21.759 16.2226 21.7746 16.2164C21.7902 16.2102 21.807 16.2074 21.8237 16.2083C21.8405 16.2087 21.857 16.2125 21.8722 16.2194C21.8874 16.2264 21.901 16.2364 21.9123 16.2488L27.5848 22.5333C27.6002 22.5503 27.6106 22.5713 27.6148 22.5938C27.6189 22.6164 27.6167 22.6396 27.6084 22.661C27.6001 22.6824 27.586 22.701 27.5677 22.7148C27.5494 22.7286 27.5276 22.7371 27.5048 22.7392L23.4627 23.1077L23.4512 23.108Z" fill="#333333"></path><path d="M22.6736 27.0915C22.6564 27.0915 22.6393 27.0878 22.6235 27.0808C22.6078 27.0738 22.5937 27.0635 22.5821 27.0507L16.7709 20.6157C16.7566 20.5998 16.7466 20.5805 16.7419 20.5596C16.7373 20.5387 16.7382 20.5169 16.7445 20.4964C16.7508 20.4759 16.7623 20.4575 16.778 20.4428C16.7936 20.4281 16.8128 20.4178 16.8336 20.4128C17.4651 20.2602 18.0421 19.9361 18.5011 19.4763L19.4344 18.5429C19.4461 18.5309 19.4601 18.5214 19.4757 18.5152C19.4913 18.509 19.508 18.5062 19.5248 18.5069C19.5415 18.5073 19.5579 18.5111 19.5731 18.5181C19.5883 18.5251 19.6019 18.5351 19.6131 18.5475L23.5437 22.9011C23.5567 22.9153 23.5661 22.9324 23.5712 22.9509C23.5763 22.9694 23.5771 22.9889 23.5733 23.0077L22.7957 26.9912C22.7913 27.0137 22.7807 27.0345 22.7651 27.0513C22.7495 27.0681 22.7296 27.0803 22.7075 27.0864C22.6965 27.0896 22.6851 27.0913 22.6736 27.0915ZM17.0891 20.5995L22.5997 26.7021L23.3197 23.0221L19.5163 18.8101L18.6755 19.6507C18.2335 20.0936 17.6884 20.4196 17.0891 20.5995Z" fill="#333333"></path><path d="M10.2973 12.6059C10.2692 12.6058 10.2419 12.5962 10.22 12.5785C10.198 12.5609 10.1828 12.5363 10.1768 12.5088L9.53679 9.58345L7.12905 8.97519C7.10214 8.96867 7.07819 8.95329 7.06107 8.93153C7.04395 8.90977 7.03464 8.88288 7.03464 8.85519C7.03464 8.82749 7.04395 8.8006 7.06107 8.77884C7.07819 8.75708 7.10214 8.7417 7.12905 8.73519L9.53652 8.12745L10.1765 5.20239C10.183 5.17547 10.1984 5.15153 10.2202 5.1344C10.2419 5.11728 10.2688 5.10797 10.2965 5.10797C10.3242 5.10797 10.3511 5.11728 10.3729 5.1344C10.3946 5.15153 10.41 5.17547 10.4165 5.20239L11.0579 8.12772L13.4669 8.73545C13.4938 8.74197 13.5178 8.75734 13.5349 8.77911C13.552 8.80087 13.5613 8.82776 13.5613 8.85545C13.5613 8.88314 13.552 8.91003 13.5349 8.9318C13.5178 8.95356 13.4938 8.96894 13.4669 8.97545L11.0579 9.58372L10.4165 12.5091C10.4106 12.5363 10.3956 12.5608 10.3739 12.5784C10.3522 12.5959 10.3252 12.6056 10.2973 12.6059ZM7.66345 8.85545L9.67092 9.36212C9.69308 9.36768 9.71326 9.37931 9.72918 9.3957C9.7451 9.4121 9.75614 9.4326 9.76105 9.45492L9.83279 9.77679L10.2976 11.9043L10.8344 9.45519C10.8393 9.4328 10.8504 9.41223 10.8663 9.39579C10.8823 9.37935 10.9026 9.36769 10.9248 9.36212L12.9336 8.85545L11.1891 8.41545L10.9248 8.34879C10.9025 8.34317 10.8823 8.33146 10.8663 8.31497C10.8503 8.29849 10.8393 8.27787 10.8344 8.25545L10.2976 5.80612L9.76132 8.25545C9.75636 8.27785 9.74528 8.29843 9.72932 8.31491C9.71336 8.33139 9.69315 8.34311 9.67092 8.34879L7.66345 8.85545Z" fill="#333333"></path></svg>
                                <span className="hidden sm:block">Featured</span>
                            </div>
                        </button> */}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 md:gap-5 w-full">
                                    <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 justify-between">
                                        <div className="flex flex-col gap-1 ">
                                            <div>
                                                <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                                    <h1 className="font-heading text-base sm:text-xl font-semibold sm:font-bold  text-slate-700 dark:text-slate-200 hn-break-words cursor-pointer">{post?.title}</h1>
                                                </Link>
                                            </div>
                                            <div className="hidden md:block">
                                                <Link href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                                    <span className="text-base hidden font-normal text-slate-500 dark:text-slate-400 hn-break-words cursor-pointer md:line-clamp-2">
                                                        {post?.description}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="w-full rounded-xl md:rounded-lg bg-gray-100 dark:bg-gray-900 relative cursor-pointer md:basis-[180px] md:h-[108px] md:shrink-0">
                                            <div className="md:hidden">
                                                <div style="position:relative;width:100%;padding-bottom:56.25%" data-radix-aspect-ratio-wrapper="">
                                                    <div style="position:absolute;top:0;right:0;bottom:0;left:0">
                                                        <Link className="block w-full h-full overflow-hidden rounded-xl md:rounded-lg focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 focus:dark:ring-offset-slate-800" href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                                            <span style="box-sizing:border-box;display:block;overflow:hidden;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0;position:absolute;top:0;left:0;bottom:0;right:0">
                                                                <ArticleImage image={post?.image} className="css-5eln6m" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%; object-fit: cover;" />
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden md:block w-full h-full">
                                                <Link className="block w-full h-full overflow-hidden rounded-xl md:rounded-lg focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 focus:dark:ring-offset-slate-800" href={`/@${post?.author?.handle || data?.author?.handle}/${post.slug}`}>
                                                    <span style="box-sizing:border-box;display:block;overflow:hidden;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0;position:absolute;top:0;left:0;bottom:0;right:0">
                                                        <ArticleImage image={post?.image} className="css-5eln6m" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%; object-fit: cover;" />
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="flex flex-col gap-5">
                                <div className="flex flex-row items-center justify-between text-slate-600 dark:text-slate-300 text-sm">
                                    <div className="flex flex-row items-center justify-start gap-2">
                                        <a href="/discussions/post/66a773b967c66e8251003206?source=discuss_feed_card_button">
                                            <div className="group css-1r5ffh4">
                                                <svg fill="none" viewBox="0 0 20 20" width="20" height="20"><path stroke="currentColor" d="M8.709 14.155a4.793 4.793 0 0 1 5.412-6.55m-5.412 6.55a4.793 4.793 0 0 0 6.31 2.54c.1-.044.21-.06.317-.042l2.213.37c.18.03.337-.127.307-.307l-.371-2.21a.566.566 0 0 1 .041-.316 4.793 4.793 0 0 0-3.405-6.586m-5.412 6.55a5.845 5.845 0 0 1-2.682-.461.689.689 0 0 0-.385-.05l-2.695.45a.324.324 0 0 1-.373-.373l.452-2.69a.689.689 0 0 0-.05-.386 5.835 5.835 0 0 1 9.482-6.435 5.808 5.808 0 0 1 1.663 3.395" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg>
                                                <span className="css-m0svy7">Discuss</span>
                                            </div>
                                        </a>
                                        <p className="font-bold text-slate-400 dark:text-slate-500">·</p>
                                        <p>30 likes</p>
                                        <p className="font-bold text-slate-400 dark:text-slate-500">·</p>
                                        <p>179 reads</p>
                                    </div>
                                    <div className="flex-row items-center flex gap-1">
                                        <div className="hidden sm:flex gap-2 items-center">
                                            <a href="/n/aws-api-gateway?source=tags_feed_article">
                                                <div className="flex justify-start items-center rounded-full px-2 py-1 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700 w-min max-w-[126px] truncate text-left">
                                                    <span className="truncate">AWS API Gateway</span>
                                                </div>
                                            </a>
                                            <div data-orientation="horizontal" role="separator" className="h-3 w-px bg-slate-200 dark:bg-slate-800">
                                            </div>
                                        </div>
                                        <button className="bookmark-button" aria-label="Bookmark post" data-state="closed">
                                            <span className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600">
                                                <svg fill="none" viewBox="0 0 20 20" width="20" height="20"><path stroke="currentColor" d="M10 6.77v1.874m0 0v1.875m0-1.875h1.875m-1.875 0H8.125M7.083 2.5h5.834a2.5 2.5 0 0 1 2.5 2.5v12.5l-4.98-3.065a.833.833 0 0 0-.874 0L4.583 17.5V5a2.5 2.5 0 0 1 2.5-2.5Z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg>
                                            </span>
                                        </button>
                                    </div>

                                </div>
                            </section>
                        </article>
                    ))
                }
                {
                    data?.loading && <PostListLoadingSkelton count={12} />
                }
                <span ref={data?.ref} ></span>
            </div >
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

const PostAuthorView = ({ author }) => {
    return (
        <div className="flex items-center space-x-4">
            <Link href={`/@${author?.handle}`}>
                <AuthorAvatar data={{ url: author?.image?.url }} />
            </Link>
            <div>
                <Link href={`/@${author?.handle}`}>
                    <h3 className="text-base font-bold cheltenham">{author?.name}</h3>
                </Link>
            </div>
        </div>
    )
}


const PostViewActions = ({ id }) => {
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
                <BsThreeDots className="w-6 h-6" />
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
                <ListItemRdX link={{ name: 'Add to Bookmark', url: '/share', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Report', url: '/report', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Say Thanks', url: '/bookmark', icon: HeartBrokenOutlined }} />
                <ListItemRdX link={{ name: 'Share', url: '/report', icon: HeartBrokenOutlined }} />
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

export { PostViewActions, PostView_TIA, PostListView_TIA, PostListView2 };