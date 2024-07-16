import { Avatar } from "@mui/material";

const AuthorSingleViewPage = ({ author }) => {

    return (
        <>
            <section>
                <div className="w-full rounded-xl overflow-hidden" >
                    <img draggable={false} src={author?.banner?.url} alt={author?.name} className="w-full h-40 object-cover bg-black/10 dark:bg-white/10" />
                </div>
                <div className={`flex flex-col w-full items-center ${author?.banner?.url && '-mt-12'}`}>
                    <Avatar src={author?.image?.url} width={160} height={160} className="!w-40 !h-40 box-border border-4 border-light dark:border-dark" alt={author?.name} />
                    <h2 className="text-xl karanak font-bold mt-2 mx-auto">{author?.name}</h2>
                    <span className="opacity-80 max-w-80 mx-auto line-clamp-3 truncate">{author?.bio}</span>
                </div>
            </section>
        </>
    )

}


export { AuthorSingleViewPage };