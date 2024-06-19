"use client";
import { Button } from "@/components/rui"
import { Skeleton } from "@mui/material"
import { useRouter } from "next/navigation";
import { MdOutlineArrowRight } from "react-icons/md"

const InfoItem = ({ title, value, icon, url }) => {
    let data = { icon: icon }
    const router = useRouter();

    return (
        <>
            <Button fullWidth={true} sx={{ borderRadius: 999 }} onClick={() => { url && router.push(`${url}`) }} className="!w-full relative !p-0">
                <div className='flex w-full transition-all duration-500 group/infoItem text-gray-700 dark:text-gray-300 bg-light dark:bg-dark hover:bg-accentLight dark:hover:bg-accentDark hover:text-gray-200 dark:hover:text-gray-100 px-8 items-center py-3 rounded-full justify-between' >
                    <div className="flex flex-col md:flex-row w-[calc(100%-40px)]">
                        <div className='text-xs md:text-sm absolute max-md:-top-2 px-4 py-0.5 md:py-0 md:px-0 md:!bg-transparent bg-white dark:bg-bgSpDark group-hover/infoItem:bg-slate-900 dark:group-hover/infoItem:bg-bgSP transition-all duration-500 rounded-full md:relative font-medium text-start md:w-1/4' >
                            {data?.icon && <data.icon className='w-3 h-3 md:w-6 md:h-6 mr-4' />}
                            {title}
                        </div>
                        <div className='text-base text-start font-semibold md:w-3/4' >{value ? value : <Skeleton width={Math.ceil(100 + Math.random() * 100)} />}</div>
                    </div>
                    <div className='text-end w-10' >
                        <MdOutlineArrowRight className='w-6 transition-all duration-500 group-hover/infoItem:text-slate-700 dark:group-hover/infoItem:text-gray-300 group-hover/infoItem:bg-white dark:group-hover/infoItem:bg-slate-900 rounded-full md:p-1 h-6' />
                    </div>
                </div>
            </Button>
        </>
    )
}

export { InfoItem };