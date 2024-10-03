"use client";
import { CreatorPageContext } from '@/lib/context';
import { useContext } from 'react';
import { getFevicon } from '@/lib/utils';
import Image from 'next/image';

const AboutView = () => {
    const creator = useContext(CreatorPageContext);

    return (
        <>
            <div className='my-10'>
                <div className='flex space-x-4 justify-between flex-col md:flex-row md:flex-wrap lg:flex-nowrap'>
                    <div className='md:w-[calc(100%-300px)] w-full mb-5'>
                        <div className='max-w-2xl pb-5 border-b border-lightHead dark:border-darkHead'>
                            <h2 className='text-xl mb-2 stymie-small font-bold'>Description</h2>
                            <span className='text-gray-800 dark:text-gray-300 whitespace-break-spaces'>{creator?.description}</span>
                            {/* <div className='mt-2 flex items-center space-x-4 flex-wrap' >
                                {
                                    (creator?.social && (creator?.social?.length > 0)) && (
                                        creator?.social.map((link, index) => (
                                            <AuthorBottomButtons key={index} url={link.url} title={link.name} isExt={true} className={'mt-2'} />
                                        ))
                                    )
                                }
                            </div> */}
                        </div>
                        <div className='max-w-2xl border-b border-lightHead dark:border-darkHead pb-5 pt-5'>
                            <h2 className='mb-2 stymie-small font-bold'>Social Links</h2>
                            <div className='flex flex-row flex-wrap justify-between space-y-3'>
                                {creator?.social && creator?.social?.map((link, index) => {
                                    return (
                                        <div key={index} className='flex w-full md:w-1/2 items-center space-x-3'>
                                            <div className='w-10 h-10 flex justify-center items-center rounded-full bg-lightHead/20 dark:bg-darkHead/20'>
                                                <Image src={getFevicon(link?.url)} alt={link?.url} width={16} height={16} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <p className='text-sm text-slate-950 dark:text-gray-200 cheltenham-small font-bold'>{link?.name}</p>
                                                <a href={link?.url} className='text-accentLight dark:text-accentDark' target='_blank' rel='noreferrer'>
                                                    {link?.url?.replace(/^(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, '')}
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                    <div className='w-full md:w-[300px] md:max-w-[300px] self-center md:self-end'>
                        <div className='w-[calc(100%-40px)] rounded-2xl border-t border-t-accentLight dark:border-t-accentDark p-5 m-auto mx-5 md:h-96 shadow-md dark:shadow-sm dark:shadow-accentDark/30'>
                            <div className='mb-4 stymie-small text-center font-bold'>
                                Stats
                            </div>
                            <div className='flex border dark:bg-darkHead dark:border-darkHead bg-lightHead justify-center items-center rounded-full p-1 border-lightHead'>
                                <span className='text-sm '>Joined {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className='flex mt-2 flex-wrap justify-between'>
                                <div className='w-1/2 my-1 py-1'>
                                    <div className='flex justify-center mx-2 h-24 rounded-xl border dark:bg-darkHead dark:border-darkHead bg-lightHead border-lightHead flex-col items-center'>
                                        <p className='text-sm imperial italic font-semibold'>{'N/A'}</p>
                                        <p className='text-base fact-display pt-1 font-semibold'>Posts</p>
                                    </div>
                                </div>
                                <div className='w-1/2 my-1 py-1'>
                                    <div className='flex mx-2 justify-center h-24 rounded-xl border dark:bg-darkHead dark:border-darkHead bg-lightHead border-lightHead flex-col items-center'>
                                        <p className='text-sm font-semibold imperial italic'>{'N/A'}</p>
                                        <p className='text-base fact-display font-semibold pt-1'>Followers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export { AboutView };