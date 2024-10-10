import { Avatar, Skeleton } from "@mui/material";
import { AuthorBottomButtons, AuthorLayoutNav, BannerImage, CreatorPageWrapper } from "./_client";
import Link from "next/link";
import { GrContactInfo } from "react-icons/gr";
import { BsChevronDoubleRight } from "react-icons/bs";
import { CreatorFollowButton } from "./utils";
import { CameraAlt } from "@mui/icons-material";
import { Button } from "../rui";
import { auth } from "@/lib/auth";

const CreatorSingleViewPage = async ({ creator, children }) => {
    const session = await auth();

    return (
        <CreatorPageWrapper creator={creator} >
            <section className="mb-5">
                <div className="w-full overflow-hidden" >
                    <div className='block group/rb-banner relative overflow-hidden rounded-lg md:rounded-xl bg-black/10 dark:bg-white/10 pt-[16.12%]'>
                        <BannerImage banner={creator?.banner} />
                        {session?.user && <div className='absolute transition-all duration-700 hidden group-hover/rb-banner:block bg-gradient-to-br to-gray-800/20 from-transparent w-full h-full bottom-0 right-0 top-0 left-0'>
                            <Button sx={{ minWidth: '2rem', minHeight: '2rem', borderRadius: '100rem' }} className='!absolute !bottom-4 !right-4 shadow-md !bg-accentLight dark:!bg-accentDark !p-0'>
                                <Link className='flex items-center justify-center' href={`/studio/edit`}>
                                    <CameraAlt className='text-white w-4 h-4 dark:text-gray-100' />
                                </Link>
                            </Button>
                        </div>}
                    </div>
                </div>
                <div className='flex flex-row justify-start mt-4 items-center'>
                    {creator ? <div className='md:!w-[128px] md:!h-[128px] !w-24 !h-24 rounded-full bg-transparent'>
                        <Avatar
                            src={creator?.image?.url}
                            quality={100}
                            alt={creator?.name}
                            width={128}
                            height={128}
                            className='rounded-full md:!w-[128px] md:!h-[128px] !w-24 !h-24'
                        >{creator?.name[0]}</Avatar>
                    </div> : <Skeleton variant='cricle' className='md:!w-[128px] md:!h-[128px] !w-24 !h-24 block !p-0 !m-0 rounded-full' animation="wave" />}
                    <div className='w-full ml-5 md:ml-6 lg:ml-7 flex md:justify-between items-start flex-col md:flex-row md:w-[calc(100%-150px)]'>
                        <div className='flex flex-col justify-evenly self-start'>
                            <div className='mt-0'>
                                <h2 className='text-lg md:text-xl lg:text-2xl stymie-small font-bold'>{creator?.name}</h2>
                                <p className='text-sm lg:text-base karnak font-medium '>
                                    {0} Followers • {0} Stories
                                </p>
                            </div>
                            <div className="mt-1">
                                {creator?.description && <Link href={`/@${creator?.handle}/about`} >
                                    <p className='text-sm items-center font-medium line-clamp-1 text-ellipsis'>
                                        {creator?.description?.length > 50 ? creator?.description.slice(0, 60) + "..." : creator?.description}
                                        <span className='ml-2'> <BsChevronDoubleRight /></span>
                                    </p>
                                </Link>}
                                <div className='mt-0.5 flex items-center gap-4' >
                                    {
                                        (creator?.social && (creator?.social?.length > 0)) && (
                                            creator?.social.slice(0, 3).map((link, index) => (
                                                <AuthorBottomButtons key={index} url={link.url} title={link.name} isExt={true} isNoWrap={true} />
                                            ))
                                        )
                                    }
                                    <AuthorBottomButtons url={`/@${creator?.handle}/about`} title={'About'} icon={<GrContactInfo className="w-4 h-4 max-[768px]:-mr-[0.6rem]" />} tip={'Know more about this author'} isNoWrap={true} />
                                </div>
                            </div>
                        </div>
                        <div className='flex mt-3 md:mt-5 md:mr-4 justify-end'>
                            <CreatorFollowButton value={creator?.followed} options={{
                                creator: creator?.key,
                            }} />
                        </div>
                    </div>
                </div>
                <div className="mt-4" >
                    <AuthorLayoutNav data={{ handle: creator?.handle }} />
                </div>
            </section >
            <section>
                {children}
            </section>
        </CreatorPageWrapper>
    )

}

export { CreatorSingleViewPage };