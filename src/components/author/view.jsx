import { Avatar, Skeleton } from "@mui/material";
import { AuthorBottomButtons, BannerImage } from "./_client";
import Link from "next/link";
import { GrContactInfo } from "react-icons/gr";

const AuthorSingleViewPage = ({ author }) => {

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
                {/* <div className={`flex flex-col w-full items-center ${author?.banner?.url && ''}`}>
                    <Avatar src={} width={160} height={160} className="!w-14 !h-14 md:!h-24 md:!w-24 lg:!w-40 lg:!h-40 box-border border-2 md:border-[3px] lg:border-4 border-light dark:border-dark" alt={author?.name} />
                    <h2 className="text-xl karnak font-bold mt-2 mx-auto">{author?.name}</h2>
                    <span className="opacity-80 max-w-80 mx-auto line-clamp-3 truncate">{author?.bio}</span>
                </div> */}
                <div className=' m-auto mt-4'>
                    <div className='flex justify-between'>
                        <div className='flex justify-start'>
                            {author ? <div className='h-32 w-32 rounded-full bg-transparent'>
                                <Avatar
                                    src={author?.image?.url}
                                    quality={100}
                                    alt={author?.name}
                                    width={128}
                                    height={128}
                                    className='rounded-full min-w-[128px] min-h-[128px]'
                                >{author?.name[0]}</Avatar>
                            </div> : <Skeleton variant='cricle' className='!min-h-32 min-w-32 block w-32 !p-0 !m-0 rounded-full' animation="wave" />}
                            <div className='flex flex-col justify-evenly ml-7'>
                                <div className='mt-0'>
                                    <h2 className='text-2xl stymie-small font-bold'>{author?.name}</h2>
                                    <p className='text-base karnak font-medium '>{`@${author?.handle}`}</p>
                                </div>
                                <div>
                                    <Link href={`/@${author?.handle}/about`} >
                                        {/* <p className='text-sm inline-flex items-center font-medium mt-1'>
                                            {data?.description && data?.description?.length > 50 ? data?.description.slice(0, 60) + "..." : data?.description || 'More about this channel'}
                                            <span className='ml-2'> <BsChevronDoubleRight /></span>
                                        </p> */}
                                    </Link>
                                    <div className='mt-0.5 flex items-center space-x-4' />
                                    {
                                        (author?.social && (author?.social?.length > 0)) && (
                                            author?.social.slice(0, 3).map((link, index) => (
                                                <AuthorBottomButtons key={index} url={link.url} title={link.title} isExt={true} />
                                            ))
                                        )
                                    }
                                    <AuthorBottomButtons url={`/@${author?.handle}/about`} title={'About'} icon={<GrContactInfo className="w-4 h-4 mr-3" />} tip={'Know more about this author'} />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='flex mt-5 mr-4 justify-end'>
                        {/* Will be Follow System Added */}

                    </div>
                </div>
                <div className='mt-4'>
                    {/* <ChannelNav data={data} lang={'en'} /> */}
                </div>
            </section >
        </>
    )

}



export { AuthorSingleViewPage };