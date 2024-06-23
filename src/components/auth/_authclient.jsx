'use client'
import Link from "next/link";
import { toast } from 'react-toastify';
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { RiMicrosoftFill } from "react-icons/ri";
import { BiChevronDownCircle } from "react-icons/bi";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import React, { useSearchParams, useRouter } from "next/navigation";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { MdOutlineFacebook, MdMailLock, MdChevronLeft, MdOutlineAccountCircle } from "react-icons/md";
import { createUser } from "@/lib/actions/user";

const AuthFooter = () => {
    return (
        <>
            <div className="flex justify-between items-center w-full">
                <div>
                    <Button variant="outlined" size="small" sx={{ borderColor: 'accent', borderRadius: 20, px: 3, height: 30, color: 'white', '&:hover': { backgroundColor: 'accent' } }}>
                        English
                    </Button>
                </div>
                <div className="flex justify-end items-center space-x-3">
                    <Button size="small" sx={{ borderColor: 'accent', borderRadius: 20, px: 3, height: 30, color: 'white', '&:hover': { backgroundColor: 'accent' } }}>
                        Help
                    </Button>
                    <Button size="small" sx={{ borderColor: 'accent', borderRadius: 20, px: 3, height: 30, color: 'white', '&:hover': { backgroundColor: 'accent' } }}>
                        Terms
                    </Button>
                    <Button size="small" sx={{ borderColor: 'accent', borderRadius: 20, px: 3, height: 30, color: 'white', '&:hover': { backgroundColor: 'accent' } }}>
                        Privacy
                    </Button>
                </div>
            </div>
        </>
    );
};

const CopyrightBox = () => {
    useEffect(() => {
        const copyrightBox = document.getElementById('copyright-box');
        copyrightBox.classList.add('animate-slidein');
        setTimeout(() => {
            copyrightBox.style.opacity = 1;
        }, 500);
    }, []);
    const year = new Date().getFullYear();
    return (
        <div id="copyright-box" className="fixed bottom-1 right-0 opacity-0 transition-opacity ease-in-out duration-500">
            <div className="text-[10px] text-gray-300 bg-gray-800 imperial py-2 px-4 rounded-l-lg">
                © {year} All Rights Reserved - <span className="text-accent font-semibold">{process.env.APP_NAME}</span>.
            </div>
        </div>
    );
};



const Auth_Login_options = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);


    const handleEmailClick = () => {
        setLoading(true);
        setTimeout(() => {
            router.push(`/auth/v2/login/identifier?_state=hdgenxSIddiMHDeZY&_callbackUrl=${callbackUrl}`)
            setLoading(false);
        }, 500);
    };

    const btn_style = "inline-block focus:bg-accentLight dark:focus:bg-accentDark text-white font-medium text-sm leading-snug uppercase rounded-[12px] shadow-md bg-transparent hover:backdrop-blur-3xl hover:shadow-lg transition duration-150 ease-in-out w-full"
    const btn_style2 = "!pr-5 !pl-8 !py-2.5 !flex !justify-start !hover:border-gray-300 !hover:opacity-80 !text-white !border-accentDark/70 !font-medium !text-sm !leading-snug !uppercase !shadow-md !transition !hover:backdrop-blur-3xl !duration-150 !ease-in-out !w-full"

    return (
        <>
            {loading && <span className="absolute animate-spin -top-10 right-5 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentDark opacity-75"></span>
                <span className="relative animate-bounce to-accentLight from-yellow-300 inline-flex rounded-full h-5 w-5 bg-gradient-radial"></span>
            </span>}

            <div className={`mt-1 px-5 py-2 w-full ${loading ? 'opacity-30' : 'opacity-100'}`}>
                <div>
                    <h3 className="text-2xl mb-10 cheltenham font-bold text-center text-gray-100">
                        Sign in to your account
                    </h3>
                </div>
                <div className="flex sm:w-72 mx-auto flex-col space-y-3 my-1">
                    <div className={`${btn_style}`}>
                        <Button
                            fullWidth
                            variant="outlined"
                            className={`${btn_style2} `}
                            onClick={() => {
                                signIn("google", { callbackUrl });
                                setLoading(true);
                            }}
                            role="button"
                        >
                            <AiFillGoogleCircle className="mr-4 w-5 h-5" /> Continue with Google
                        </Button>
                    </div>

                    <div className={`${btn_style}`}>
                        <Button
                            variant="outlined"
                            className={`${btn_style2}`}
                            onClick={() => signIn("facebook", { callbackUrl })}
                            role="button"
                        ><MdOutlineFacebook className="mr-4 w-5 h-5" />
                            Continue with FaceBook
                        </Button>
                    </div>
                    <div className={`${btn_style}`}>
                        <Button
                            variant="outlined"
                            className={`${btn_style2}`}
                            onClick={() => showMore ? setShowMore(false) : setShowMore(true)}
                        ><BiChevronDownCircle className="mr-4 w-5 h-5" />
                            {showMore ? 'Hide Another way' : 'Choose Another way'}
                        </Button>
                    </div>
                    <div className={`${btn_style}`}>
                        <Button
                            variant="outlined"
                            className={`${btn_style2}`}
                            onClick={handleEmailClick}
                            role="button"
                        > <MdMailLock className="mr-4 w-5 h-5" />
                            Sign In with Email
                        </Button>
                    </div>
                    <div className="my-0 text-center text-gray-500">or</div>
                    <div className={`${btn_style}`}>
                        <Button
                            variant="outlined"
                            className={`${btn_style2}`}
                            onClick={() => router.push("/auth/v2/signup")}
                            role="button"
                        > <MdMailLock className="mr-4 w-5 h-5" />
                            Create Account
                        </Button>
                    </div>
                </div >
            </div >
            {showMore && (
                <div className="fixed right-5 md:w-[350px] top-5 md:h-screen">
                    <div className="md:max-h-[80vh] border border-slate-600 relative my-auto rounded-xl p-2 backdrop-blur-3xl">
                        <div className="bg-accentLight/90 dark:bg-accentDark/70 absolute left-2 top-2 rounded-full w-7 h-7">
                            <Button color="accent" onClick={() => showMore ? setShowMore(false) : setShowMore(true)} sx={{ borderRadius: 100, minWidth: 28, minHeight: 28 }} size="small" className="rounded-full"><MdChevronLeft className="w-4 text-white h-4" /></Button>
                        </div>
                        <div className="flex flex-col space-y-3 px-4 mb-2 mt-10">
                            <div className={`${btn_style}`}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    className={`${btn_style2} `}
                                    onClick={() => signIn("google", { callbackUrl })}
                                    role="button"
                                >
                                    <AiFillGoogleCircle className="mr-4 w-5 h-5" /> Continue with Google
                                </Button>
                            </div>
                            <div className={`${btn_style}`}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    className={`${btn_style2} `}
                                    onClick={() => signIn("auth0", { callbackUrl })}
                                    role="button"
                                >
                                    <AiFillGoogleCircle className="mr-4 w-5 h-5" /> Continue with Auth0
                                </Button>
                            </div>
                            <div className={`${btn_style}`}>
                                <Button
                                    variant="outlined"
                                    className={`${btn_style2}`}
                                    onClick={() => signIn("github", { callbackUrl })}
                                    role="button"
                                > <AiFillGithub className="mr-4 w-5 h-5" />
                                    Continue with GitHub
                                </Button>
                            </div>
                            <div className={`${btn_style}`}>
                                <Button
                                    variant="outlined"
                                    className={`${btn_style2}`}
                                    onClick={() => signIn("facebook", { callbackUrl })}
                                    role="button"
                                ><MdOutlineFacebook className="mr-4 w-5 h-5" />
                                    Continue with FaceBook
                                </Button>
                            </div>
                            <div className={`${btn_style}`}>
                                <Button
                                    variant="outlined"
                                    className={`${btn_style2}`}
                                    onClick={() => signIn("microsoft", { callbackUrl })}
                                    role="button"
                                > <RiMicrosoftFill className="mr-4 w-5 h-5" />
                                    Continue with Microsoft
                                </Button>
                            </div>
                        </div>
                    </div >
                </div>
            )
            }
        </>
    );
};

const Auth_Login_Form = ({ params, query }) => {
    const [emailError, setEmailError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [loginError, setLoginError] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    });
    const searchParams = useSearchParams()

    useEffect(() => {
        if (params[1] === 'password') {
            if (query._identifier)
                setFormValues({ ...formValues, email: query._identifier })
            else router.push(`/auth/v2/login/identifier?_state=${query._state}&_callbackUrl=${query._callbackUrl}`)
        } else if (params[1] === 'redirect') {
            let url = searchParams?._callbackUrl ? searchParams?._callbackUrl : window.location.origin;
            router.push(url)
        }
    }, [params]);

    const handleNext = () => {
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        setLoading(true);
        setTimeout(() => {
            if (params[1] === 'identifier') {
                if (validateEmail(formValues.email)) {
                    setEmailError(false);
                    router.push(`/auth/v2/login/password?_state=${query._state}&_callbackUrl=${query._callbackUrl}&_identifier=${formValues.email}`)
                } else {
                    setEmailError(true);
                }
                // } else if (params[3] === 'password' && formValues.password !== '') {
                //     router.push(`/auth/v2/redirect?_status=success&_state=hdgenxSIddiMHDeZY&_callbackUrl=https://raviblog.tech`)
            }
            setLoading(false);
        }, 500);
    };

    const backToEmail = () => {
        router.push(`/auth/v2/login/identifier?_state=${query._state}&_callbackUrl=${query._callbackUrl}&_identifier=${formValues.email}`);
    };

    const onSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await signIn("credentials", {
                redirect: false,
                identifier: formValues.email,
                password: formValues.password,
                callbackUrl: query._callbackUrl
            });
            console.log(res, "---- res")
            if (!res?.error) {
                toast.success("Sucessfully Logged In", { toastId: "Slogin" });
                setFormValues({ email: "", password: "" });
                setLoginError(false);
                router.push(`/auth/v2/login/redirect?_state=${query._state}&_callbackUrl=${query._callbackUrl}`)
            } else {
                setLoginError(true);
                toast.error(`${res.code} _ ${res.url} _ ${res.ok} _ ${res.status}_${res.error}`, { toastId: "Elogin" });
            }
        } catch (error) {
            setLoading(false)
            toast.error(error, { toastId: "loginApi" });
        } finally {
            setLoading(false)
        };
    };

    const handleChange = event => {
        if (event.target.name === "email") {
            if (event.target.value !== '' && event.target.value?.includes("@")) {
                setEmailError(false);
            }
        }
        const { name, value } = event.target
        setFormValues({ ...formValues, [name]: value })
    };

    const input_style = "block w-full text-sm font-normal text-gray-700 bg-transparent backdrop-blur-2xl rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none";
    return (
        <>
            <div className="h-[calc(100vh-300px)] px-4 flex flex-col justify-between mt-2 w-full">
                <div className="h-full">
                    {loading && <span className="absolute animate-spin -top-10 right-5 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentDark opacity-75"></span>
                        <span className="relative animate-bounce to-accentLight from-yellow-300 inline-flex rounded-full h-5 w-5 bg-gradient-radial"></span>
                    </span>}
                    {
                        (params[1] === 'identifier') && (
                            <>
                                <div className="pb-10">
                                    <h3 className="text-2xl mb-8 cheltenham font-bold text-center text-gray-100">
                                        Sign in with Email
                                    </h3>
                                </div>
                                <TextField
                                    required
                                    type="email"
                                    color="ld"
                                    error={emailError}
                                    name="email"
                                    fullWidth
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'white' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "white", color: 'white' },
                                            "&:hover fieldset": { borderColor: "gray" },
                                            "&.Mui-focused fieldset": { borderColor: "white" },
                                        }, borderRadius: '6px'
                                    }}
                                    value={formValues.email}
                                    onChange={handleChange}
                                    label="Email address"
                                    placeholder="Email address"
                                    className={`${input_style}`}
                                    inputProps={{ style: { color: 'white' } }}
                                />
                            </>
                        )
                    }
                    {
                        (params[1] === 'password') && (
                            <>
                                <div className="pb-8 flex flex-col items-center w-full">
                                    <h3 className="text-2xl mb-2 cheltenham font-bold text-center text-gray-100">
                                        Welcome
                                    </h3>
                                    <Button variant="outlined" sx={{ borderColor: 'white', borderRadius: 100 }} onClick={() => backToEmail} size='small'>
                                        <div className="text-gray-200">
                                            <MdOutlineAccountCircle className="mr-2 w-5 h-5" />
                                            <span className="text-sm truncate font-semibold"> {formValues.email} </span>
                                            <FiChevronDown className="ml-2 w-5 h-5" />
                                        </div>
                                    </Button>
                                </div>
                                <TextField
                                    required
                                    type={showPassword ? "text" : "password"}
                                    color="ld"
                                    error={loginError}
                                    name="password"
                                    fullWidth
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'white' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "white", color: 'white' },
                                            "&:hover fieldset": { borderColor: "gray" },
                                            "&.Mui-focused fieldset": { borderColor: "white" },
                                        }, borderRadius: '6px'
                                    }}
                                    value={formValues.password}
                                    onChange={handleChange}
                                    label="Password"
                                    placeholder="Password"
                                    className={`${input_style}`}
                                    inputProps={{ style: { color: 'white' } }}
                                />
                                <div className="mt-1 ml-0.5">
                                    <FormControlLabel control={<Checkbox sx={{ color: "white", '&.Mui-checked': { color: "white", }, }} className="text-gray-200" checked={showPassword} onChange={() => showPassword ? setShowPassword(false) : setShowPassword(true)} />} label={'Show Password'} className="text-gray-200" />
                                </div>
                            </>
                        )
                    }
                    {
                        (params[1] === 'redirect') && (
                            <>
                                <div className="w-full text-gray-300 flex-col h-full flex justify-center items-center text-center">
                                    <p className="text-gray-100 mb-4">You will be redirected in a few seconds...</p>
                                    <Link href={query?._callbackUrl} className="text-accent underline hover:text-accentDark">Or click here to continue</Link>
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-300 mt-4"></div>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="flex flex-wrap justify-between items-center">
                    {(params[1] === 'identifier') &&
                        <>
                            <div className="">
                                <Button onClick={() => router.push("/auth/v2/register?state=hdgenxSIddiMHDeZY&callbackUrl=https://raviblog.tech")} className="px-4" size='small' color="ld">
                                    Create Account
                                </Button>
                            </div>
                            <div className="">
                                <Button disabled={!formValues.email} variant="contained" onClick={handleNext} size='small' color="accent" className={`!text-white ${(!formValues.email) ? '!bg-accentLight/30 !text-gray-200/70 dark:!bg-accentDark/20' : '!bg-accentLight dark:!bg-accentDark/70'}`}>
                                    Next
                                </Button>
                            </div>
                        </>
                    }
                    {
                        (params[1] === 'password') && (
                            <>
                                <div className="">
                                    <Button onClick={() => router.push(`/auth/v2/account-recovery?type=ForgetPassword&fp_Email=${formValues.email}`)}
                                        className="px-4"
                                        color="ld"
                                        size='small'
                                    > Forgot Password? </Button>
                                </div>
                                <div className="">
                                    <Button disabled={!formValues.email || !formValues.password} variant="contained" onClick={onSubmit} size='small' color="icon" className={`!text-white ${(!formValues.email || !formValues.password) ? '!bg-accentLight/30 !text-gray-200/70 dark:!bg-accentDark/20' : '!bg-accentLight dark:!bg-accentDark/70'}`}>
                                        Sign In
                                    </Button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )

}


const CreateAccount = () => {
    const [data, setData] = useState({});
    const router = useRouter();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onSubmit = async () => {
        if (data.email && data.name) {
            let st = await createUser(data);
            if (st && st.status === 200 && st.data) {
                toast.success("Account Created Successfully", { toastId: "createAccount" });
                router.push("/auth/v2/login/identifier");
            } else {
                toast.error("Account Creation Failed", { toastId: "createAccount" });
            }
        }
    }

    return (
        <>
            <div className="z-[1000]">
                <h1>Create Account</h1>
                <div className="w-full max-w-3xl mx-auto px-10 flex flex-col ">
                    <div className="mb-10">
                        <TextField fullWidth={true} onChange={(e) => handleChange(e)} variant="standard" name="name" label="Name" />
                    </div>
                    <div>
                        <TextField fullWidth={true} onChange={(e) => handleChange(e)} variant="standard" name="email" label="Email" />
                    </div>
                    <div>
                        <TextField fullWidth={true} onChange={(e) => handleChange(e)} variant="standard" name="username" label="Username" />
                    </div>

                    <div className="mt-10">
                        <Button onClick={onSubmit} className="btn">Sign Up</Button>
                    </div>
                </div>
            </div>
        </>
    );
}


export { AuthFooter, CopyrightBox, Auth_Login_options, Auth_Login_Form, CreateAccount }