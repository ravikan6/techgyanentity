import { AccountMenu } from "@/components/account/_menu";
import { auth } from "@/lib/auth";



export default async function AccountPageLayout({ children, params }) {
    const session = await auth();

    return (
        <>
            <section className="flex flex-col relative lg:flex-row justify-between items-start space-x-5 lg:block lg:space-x-0" >
                <div className="w-full lg:fixed lg:top-20 lg:left-0 lg:w-64 xl:72">
                    <div className="overflow-x-auto mx-5 lg:mx-0 lg:overflow-x-hidden flex lg:flex-col">
                        <AccountMenu path={params?.path[0]} session={session} />
                    </div>
                </div>
                <div className='w-full xl:max-w-5xl lg:!ml-64 xl:!ml-72 lg:w-[calc(100%-16rem)] xl:w-[calc(100%-18rem)] pt-10 lg:pt-0 lg:px-10 '>
                    <div className="mx-auto w-full max-w-4xl">
                        {children}
                    </div>
                </div>
            </section>
        </>
    )
};