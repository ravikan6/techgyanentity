import { Avatar } from "@mui/material";
import { BannerImage } from "./_client";

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
                <div className={`flex flex-col w-full items-center ${author?.banner?.url && '-mt-20'}`}>
                    <Avatar src={author?.image?.url} width={160} height={160} className="!w-40 !h-40 box-border border-4 border-light dark:border-dark" alt={author?.name} />
                    <h2 className="text-xl karanak font-bold mt-2 mx-auto">{author?.name}</h2>
                    <span className="opacity-80 max-w-80 mx-auto line-clamp-3 truncate">{author?.bio}</span>
                </div>
            </section>
        </>
    )

}


export { AuthorSingleViewPage };