import { Avatar } from "@mui/material";

const AuthorSingleViewPage = ({ author }) => {

    return (
        <>
            <section>
                <div className="w-full rounded-xl overflow-hidden" >
                    <img draggable={false} src={author?.banner?.url} alt={author?.name} className="w-full h-40 object-cover" />
                </div>
                <div className={`flex flex-col w-full items-center ${author?.banner?.url && '-mt-12'}`}>
                    <Avatar src={author?.image?.url} width={100} height={100} className="!w-24 !h-24" alt={author?.name} />
                    <h2 className="text-xl karanak font-bold mt-2 mx-auto">{author?.name}</h2>
                    <span className="opacity-80 max-w-80 mx-auto line-clamp-3 truncate">{author?.bio}</span>
                </div>
            </section>
        </>
    )

}


export { AuthorSingleViewPage };