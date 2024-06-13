// @app/components/Home/HomeBlocks.js
"use client"
import { useState } from 'react';
import { uploadImage } from '@/lib/actions/upload';

import { Button } from '../rui';
import { CldImage } from 'next-cloudinary';
import { getBlogs } from '@/lib/actions/blog';

export const ImageBlock = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadImage({
            formData: formData,
        });

        if (response.status === 200) {
            console.log('File uploaded successfully:', response);
        } else {
            console.error('File upload failed:', response);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
};

export const TheImageBlock = () => {
    const [file, setFile] = useState(null);

    const handler = async() => {
        const b = await getBlogs()
        console.log(b)
    }

    return (
        <>
            <div className="mt-10 mb-10 mx-auto w-full">
                {/* <CldImage src="TechGyan/Untitled_k2r9ny" width={300} height={300} quality={100} /> */}
                <Button onClick={handler} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Blogs</Button>
            </div>
        </>
    )
};

// export const HeroBlock = ({ content }) => {
//     const hImage = `${process.env.MEDIA_URL}/${content?.image}`;
//     function Scroll600() {
//         window.scrollTo({
//             left: 0,
//             top: window.scrollY + 600,
//             behavior: 'smooth',
//         });
//     };

//     return (
//         <>
//             <div className='relative w-full rounded-xl mt-2 bg-gradient-radial to-white from-accentLight/30 via-accentLight/5 dark:to-dark dark:via-accentDark/10 dark:from-accentDark/40'>
//                 <div className={`rounded-xl bg-[url('/static/images/rb-signin-light-box-1603847734787-9e8a3f3e9d60.avif')] dark:bg-[url('/static/images/rb-signin-dark-box-1655835584195-1839b9cdf2ae.avif')]`}>
//                     <div className='flex flex-col px-5 items-center rounded-xl backdrop-blur-2xl border-b border-b-slate-300 dark:border-zinc-700'>
//                         <div className={`pb-2  px-3 md:p-0 m-auto flex justify-between h-[500px] items-center`}>
//                             <div className='justify-start w-full md:w-1/2'>
//                                 <h1 className='karnak text-5xl max-w-xl '>{content?.data?.Heading}</h1>
//                                 <p className={`stymie font-medium mt-7 text-base`} dangerouslySetInnerHTML={{ __html: `${content?.data?.Description}` }}></p>
//                                 <div className='mt-10'>
//                                     <SgBtn class={'reGister px-12'} name="Sign Up" />
//                                     <LgBtn />
//                                 </div>
//                             </div>
//                             <div className='md:flex justify-end hidden md:w-1/2'>
//                                 <Image
//                                     alt={content?.title}
//                                     src={hImage}
//                                     quality={100}
//                                     width={400}
//                                     height={400}
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <TransBtn onclick={Scroll600} Text='Start Reading' CssClass='!-translate-y-[50%] text-sm md:text-base !-translate-x-[50%] !absolute' />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// /**
//  * @deprecated -- it is for testing purpose only
//  */
// export const HomePopular = ({ data }) => {
//     const articles = data?.data?.Articles?.edges;
//     if (articles && articles.length > 0) {
//         return (
//             <div className="border-b-slate-300 dark:border-zinc-700 mb-5 border-b mt-16">
//                 <div className="px-3 md:px-0 m-auto mb-3">
//                     <ol className="flex flex-col md:flex-row gap-2 flex-wrap justify-between">
//                         {(articles).map((article, index) => {
//                             const data = article?.node;
//                             if (data && data?.isPublished) {
//                                 const cover = get_Article_image(data?.coverImage);
//                                 return (
//                                     <li className="w-full md:w-[49%] mb-5" key={index}>
//                                         <div>
//                                             <div className="flex flex-col md:flex-row">
//                                                 <div className="mb-1 md:mb-0 md:mr-5 ">

//                                                     <Link href={get_Article_url_by_id(data?.uuid)}>
//                                                         <Image
//                                                             src={cover ? cover.sizes.SM : uiAvtar(data?.title)}
//                                                             width={180}
//                                                             height={132}
//                                                             className="object-cover rounded-2xl border-2 dark:border-zinc-800 border-gray-200 min-w-full md:min-w-[180px] md:max-w-[180px] max-w-full min-h-[25px] max-h-[250px] md:min-h-[132px] md:max-h-[132px]"
//                                                             alt={data?.cover?.alt}
//                                                         />
//                                                     </Link>
//                                                 </div>
//                                                 <div className="flex flex-col justify-around">
//                                                     <div className="mt-1">
//                                                         <Link href={`/${process.env.AUTHOR_URL_PREFIX || 'author'}/${data.author?.handle ? `@${data.author?.handle}` :data.author?.id}`} >
//                                                         <div className="flex mb-2 items-center">
//                                                             <Image
//                                                             src={article?.author?.avatar || '#'}
//                                                             width={20}
//                                                             height={20}
//                                                             className="object-cover rounded-full min-w-[20px] min-h-[20px] mr-1"
//                                                             alt={article.author?.name}
//                                                         />
//                                                             <div className="imperial -mt-1 text-sm md:text-xs"><span>{data?.author?.name || "Unknown"}</span></div>
//                                                         </div></Link>
//                                                         <Link href={get_Article_url_by_id(data?.id)}>
//                                                             <h3 className=" text-xl dark:hover:text-gray-300 hover:text-gray-800 font-bold leading-6 franklin-tv">{data?.title}</h3>
//                                                         </Link>
//                                                     </div>
//                                                     <div className="flex items-center mt-1.5 karnak text-sm font-medium">
//                                                         <span><Link className='dark:text-gray-300 text-gray-700 hover:underline dark:hover:text-gray-200' href={get_Article_url_by_id(data?.id)}>{formatDate(data?.publishedAt)}</Link></span>
//                                                         <span className=" mx-3 font-extrabold">.</span>
//                                                         <span className='dark:text-gray-300 text-gray-700'>{data?.readTime} read</span>
//                                                         {data?.tags ? (<><span className=" mx-3 font-extrabold">.</span> <Link href={`/tag/${data?.tags[0]?.slug}`}> <span className=" bg-slate-200 hover:opacity-70 dark:bg-slate-700 rounded-full px-4 py-0.5">{data?.tags[0]?.name}</span> </Link></>) : null}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </li>
//                                 )
//                             }
//                         })}
//                     </ol>
//                 </div>
//             </div>
//         );
//     }
//     else {
//         return null
//     }
// };

// export const PostLoader = () => {
//     return (
//         <div className="m-auto flex justify-between items-center mb-5">
//             <div className="flex w-full max-w-[650px] justify-between items-center">
//                 <div className="flex w-full flex-col justify-around">
//                     <div className="w-full overflow-clip mb-2">
//                         <div className="flex pb-2 items-center">
//                             <div className="bg-gray-300 dark:bg-slate-600 animate-pulse rounded-full mr-2 h-5 w-5"></div>
//                             <div className="bg-gray-200 dark:bg-slate-500 animate-pulse rounded-full mr-2 h-4 w-16"></div>
//                         </div>
//                         <h3 className="bg-gray-300 dark:bg-slate-600 animate-pulse rounded-md h-6 w-full"></h3>
//                         <p className="bg-gray-200 dark:bg-slate-500 animate-pulse mt-1.5 rounded-md h-2 w-11/12"></p>
//                         <p className="bg-gray-100 dark:bg-slate-400 animate-pulse mt-1 rounded-md h-2 w-3/5"></p>
//                     </div>
//                     <div className="flex items-center karnak pt-2 text-sm font-medium">
//                         <span className="bg-gray-200 dark:bg-slate-500 animate-pulse rounded-md h-3 w-1/5"></span>
//                         <span className="bg-gray-200 dark:bg-slate-500 animate-pulse ml-2 rounded-md h-3 w-1/5"></span>
//                         <span className="bg-gray-400 dark:bg-slate-700 animate-pulse ml-2 rounded-md h-3 w-1/5"></span>
//                     </div>
//                 </div>
//                 <div className="ml-5 ">
//                     <div className="bg-gray-200 dark:bg-slate-500 animate-pulse rounded-2xl border-2 dark:border-zinc-800 border-gray-200 min-w-[200px] max-w-[200px] min-h-[145px] max-h-[145px]"></div>
//                 </div>
//             </div>
//         </div>
//     );
// };