import React from "react";
import { Auth_Login_Form, Auth_Login_options } from "./_authclient";

const AuthLogin = ({ params, searchParams }) => {
    return (
        <>
            <section className="relative w-full">
                <div className="mx-auto w-full h-full flex justify-center items-center">
                    <div className="bg-transparent w-full">
                        {params.length === 1 ? (
                            <>
                                <div className="mt-1">
                                    <div className="text-sm px-5 w-80 fixed left-5">
                                        <p className="text-sm kippenberger-con text-gray-200"> Welcome back to our platform!</p>
                                        <p className="text-sm italic mt-0.5 text-slate-300 cheltenham"> If you don't have an account yet, you can create one by clicking the "Create Account" button below.</p>
                                    </div>
                                </div>
                                <div className="mx-auto w-full flex justify-center">
                                    <Auth_Login_options />
                                </div>
                            </>
                        ) : params?.length >= 2 && searchParams.state !== null ? (
                            <>
                                <Auth_Login_Form params={params} query={searchParams} />
                            </>
                        ) : null}
                    </div>
                </div>
            </section>
        </>
    );
};

export { AuthLogin };
