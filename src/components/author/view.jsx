import { Avatar, Skeleton } from "@mui/material";
import { AuthorBottomButtons, AuthorLayoutNav, BannerImage } from "./_client";
import Link from "next/link";
import { GrContactInfo } from "react-icons/gr";
import { BsChevronDoubleRight } from "react-icons/bs";
import { FollowButton } from "./utils";
import { CameraAlt } from "@mui/icons-material";
import { Button } from "../rui";
import { auth } from "@/lib/auth";

const AuthorSingleViewPage = async ({ author, children }) => {
    const session = await auth();

    return (
        <>
            <section className="mb-5">
                <div className="w-full overflow-hidden" >
                    <div className='block group/rb-banner relative overflow-hidden rounded-xl bg-black/10 dark:bg-white/10 pt-[16.12%]'>
                        <BannerImage banner={author?.banner} />
                        {session.user && <div className='absolute transition-all duration-700 hidden group-hover/rb-banner:block bg-gradient-to-br to-gray-800/20 from-transparent w-full h-full bottom-0 right-0 top-0 left-0'>
                            <Button sx={{ minWidth: '2rem', minHeight: '2rem', borderRadius: '100rem' }} className='!absolute !bottom-4 !right-4 shadow-md !bg-accentLight dark:!bg-accentDark !p-0'>
                                <Link className='flex items-center justify-center' href={`/studio/edit`}>
                                    <CameraAlt className='text-white w-4 h-4 dark:text-gray-100' />
                                </Link>
                            </Button>
                        </div>}
                    </div>
                </div>
                <div className='flex justify-start mt-4 items-center'>
                    {author ? <div className='!w-[128px] !h-[128px] rounded-full bg-transparent'>
                        <Avatar
                            src={author?.image?.url}
                            quality={100}
                            alt={author?.name}
                            width={128}
                            height={128}
                            className='rounded-full !w-[128px] !h-[128px]'
                        >{author?.name[0]}</Avatar>
                    </div> : <Skeleton variant='cricle' className='!w-[128px] !h-[128px] block !p-0 !m-0 rounded-full' animation="wave" />}
                    <div className='ml-5 md:ml-6 lg:ml-7 flex md:justify-between items-start flex-col md:flex-row md:w-[calc(100%-150px)]'>
                        <div className='flex flex-col justify-evenly self-start'>
                            <div className='mt-0'>
                                <h2 className='text-xl lg:text-2xl stymie-small font-bold'>{author?.name}</h2>
                                <p className='text-sm lg:text-base karnak font-medium '>
                                    {author?._count?.followers} Followers • {author?._count?.Post} Posts
                                </p>
                            </div>
                            <div>
                                {author?.bio && <Link href={`/@${author?.handle}/about`} >
                                    <p className='text-sm items-center font-medium mt-1 line-clamp-1 text-ellipsis'>
                                        {author?.bio?.length > 50 ? author?.bio.slice(0, 60) + "..." : author?.bio || 'More about this author'}
                                        <span className='ml-2'> <BsChevronDoubleRight /></span>
                                    </p>
                                </Link>}
                                <div className='mt-0.5 flex items-center space-x-4' >
                                    {
                                        (author?.social && (author?.social?.length > 0)) && (
                                            author?.social.slice(0, 3).map((link, index) => (
                                                <AuthorBottomButtons key={index} url={link.url} title={link.title} isExt={true} isNoWrap={true} />
                                            ))
                                        )
                                    }
                                    <AuthorBottomButtons url={`/@${author?.handle}/about`} title={'About'} icon={<GrContactInfo className="w-4 h-4 max-[768px]:-mr-[0.6rem]" />} tip={'Know more about this author'} isNoWrap={true} />
                                </div>
                            </div>
                        </div>
                        <div className='flex mt-3 md:mt-5 md:mr-4 justify-end'>
                            <FollowButton authorId={author?.id} />
                        </div>
                    </div>
                </div>
                <div className="mt-4" >
                    <AuthorLayoutNav data={{ handle: author?.handle }} />
                </div>
            </section >
            <section>
                {children}
            </section>
        </>
    )

}

const AuthorAbout = ({ author }) => {

    return (
        <>
            <div className='my-10'>
                <div className='flex space-x-4 justify-between flex-col md:flex-row md:flex-wrap lg:flex-nowrap'>
                    <div className='md:w-[calc(100%-300px)] w-full mb-5'>
                        <div className='max-w-2xl pb-5 border-b border-lightHead dark:border-darkHead'>
                            {/* <h2 className='text-xl mb-2 stymie-small font-bold'>Description</h2> */}
                            <span className='text-gray-800 dark:text-gray-300 whitespace-break-spaces'>{author?.bio}</span>
                            <div className='mt-2 flex items-center space-x-4 flex-wrap' >
                                {
                                    (author?.social && (author?.social?.length > 0)) && (
                                        author?.social.map((link, index) => (
                                            <AuthorBottomButtons key={index} url={link.url} title={link.title} isExt={true} className={'mt-2'} />
                                        ))
                                    )
                                }
                            </div>
                        </div>
                        {/* <div className='max-w-2xl border-b border-lightHead dark:border-darkHead pb-5 pt-5'>
                            <h2 className='mb-2 stymie-small font-bold'>Social Links</h2>
                            <div className='flex flex-row flex-wrap justify-between space-y-3'>
                                {author?.social && author?.social?.map((link, index) => {
                                    return (
                                        <div key={index} className='flex w-full md:w-1/2 items-center space-x-3'>
                                            <div className='w-10 h-10 flex justify-center items-center rounded-full bg-lightHead/20 dark:bg-darkHead/20'>
                                                <Image src={getFevicon(link?.url)} alt={link?.url} width={16} height={16} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <p className='text-sm text-slate-950 dark:text-gray-200 cheltenham-small font-bold'>{link?.title}</p>
                                                <a href={link?.url} className='text-accentLight dark:text-accentDark' target='_blank' rel='noreferrer'>
                                                    {link?.url.replace(/^(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, '')}
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div> */}

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
                                        <p className='text-sm imperial italic font-semibold'>{(author?._count?.Post) || 'N/A'}</p>
                                        <p className='text-base fact-display pt-1 font-semibold'>Posts</p>
                                    </div>
                                </div>
                                <div className='w-1/2 my-1 py-1'>
                                    <div className='flex mx-2 justify-center h-24 rounded-xl border dark:bg-darkHead dark:border-darkHead bg-lightHead border-lightHead flex-col items-center'>
                                        <p className='text-sm font-semibold imperial italic'>{(author?._count?.followers) || 'N/A'}</p>
                                        <p className='text-base fact-display font-semibold pt-1'>Followers</p>
                                    </div>
                                </div>
                                {/* <div className='w-1/2 my-1 py-1'>
                                    <div className='flex mx-2 justify-center h-24 rounded-xl border dark:bg-darkHead dark:border-darkHead bg-lightHead border-lightHead flex-col items-center'>
                                        <p className='text-sm font-semibold imperial italic'>N/A</p>
                                        <p className='text-base fact-display font-semibold pt-1'>Following</p>
                                    </div>
                                </div>
                                <div className='w-1/2 my-1 py-1'>
                                    <div className='flex mx-2 justify-center h-24 rounded-xl border dark:bg-darkHead dark:border-darkHead bg-lightHead border-lightHead flex-col items-center'>
                                        <p className='text-sm font-semibold imperial italic'>N/A</p>
                                        <p className='text-base fact-display font-semibold pt-1'>Views</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export { AuthorSingleViewPage, AuthorAbout };