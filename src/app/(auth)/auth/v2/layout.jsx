import { AuthFooter, CopyrightBox } from "@/components/auth/_authclient";

const AuthLayoutV2 = async ({ children }) => {

    return (
        <>
            <div className="min-h-screen"
                // style={{ backgroundImage: 'url(/static/images/background-image-auth-page.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                <div className="h-screen flex flex-col justify-center mx-auto items-center w-[400px]">
                    <div className="border relative border-gray-500 w-full h-[calc(100vh-120px)] max-h-[600px] my-auto before:backdrop-blur-md overflow-hidden before:absolute before:w-full before:h-full rounded-xl">
                        <div className="flex relative w-full justify-center items-center">
                            {/* <Image src={logo.url} alt={logo.alt} width={logo.width} height={35} /> */}
                            {/* {logo ?
                                <div className="bg-white dark:bg-dark rounded-b-xl px-3 py-1.5 -mt-[1px]" dangerouslySetInnerHTML={{ __html: logo }}></div>
                                : process.env.APP_NAME
                            } */}
                            TECHGYAN ENTITY
                        </div>
                        {children}
                    </div>
                    <div className="h-[40px] flex items-center rounded-lg px-1 w-full mt-[20px] mb-[10px] my-auto backdrop-blur-sm">
                        <AuthFooter />
                    </div>
                </div>
                <CopyrightBox />
            </div>
        </>
    );
}

export default AuthLayoutV2;