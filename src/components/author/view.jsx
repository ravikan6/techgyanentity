import { Avatar, Skeleton } from "@mui/material";
import { AuthorBottomButtons, AuthorLayoutNav, BannerImage } from "./_client";
import Link from "next/link";
import { GrContactInfo } from "react-icons/gr";
import { BsChevronDoubleRight } from "react-icons/bs";

const AuthorSingleViewPage = ({ author, children }) => {

    return (
        <>
            <section>
                <div className="w-full overflow-hidden" >
                    <div className='block group/rb-banner relative overflow-hidden rounded-xl bg-black/10 dark:bg-white/10 pt-[16.12%]'>
                        <BannerImage banner={author?.banner} />
                        {/* {session?.user && <div className='absolute transition-all duration-700 hidden group-hover/rb-banner:block bg-gradient-to-br to-gray-800/20 from-transparent w-full h-full bottom-0 right-0 top-0 left-0'>
                            <Button sx={{ minWidth: '2rem', minHeight: '2rem', borderRadius: '100rem' }} className='!absolute !bottom-4 !right-4 shadow-md !bg-accentLight dark:!bg-accentDark !p-0'>
                                <Link className='flex items-center justify-center' href={`/${process.env.CHANNEL_URL_PREFIX}/@${data?.handle}/edit`}>
                                    <CameraAltIcon className='text-white w-4 h-4 dark:text-gray-100' />
                                </Link>
                            </Button>
                        </div>} */}
                    </div>
                </div>
                <div className=' m-auto mt-4'>
                    <div className='flex justify-between'>
                        <div className='flex justify-start'>
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
                            <div className='flex flex-col justify-evenly ml-5 md:ml-6 lg:ml-7'>
                                <div className='mt-0'>
                                    <h2 className='text-xl lg:text-2xl stymie-small font-bold'>{author?.name}</h2>
                                    <p className='text-sm lg:text-base karnak font-medium '>
                                        {author?._count?.followers} Followers • {author?._count?.Post} Articles
                                    </p>
                                </div>
                                <div>
                                    <Link href={`/@${author?.handle}/about`} >
                                        <p className='text-sm inline-flex items-center font-medium mt-1'>
                                            {author?.bio && author?.bio?.length > 50 ? author?.bio.slice(0, 60) + "..." : author?.bio || ''}
                                            <span className='ml-2'> <BsChevronDoubleRight /></span>
                                        </p>
                                    </Link>
                                    <div className='mt-0.5 flex items-center space-x-4' >
                                        {
                                            (author?.social && (author?.social?.length > 0)) && (
                                                author?.social.slice(0, 3).map((link, index) => (
                                                    <AuthorBottomButtons key={index} url={link.url} title={link.title} isExt={true} />
                                                ))
                                            )
                                        }
                                        <AuthorBottomButtons url={`/@${author?.handle}/about`} title={'About'} icon={<GrContactInfo className="w-4 h-4" />} tip={'Know more about this author'} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='flex mt-5 mr-4 justify-end'>
                        {/* Follow Button */}
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



export { AuthorSingleViewPage };