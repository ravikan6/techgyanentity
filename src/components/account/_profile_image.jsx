'use client';
import { Dialog, Button } from "../rui";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, LinearProgress } from "@mui/material";
import { userImage } from "@/lib/actions/user";
import { CloseBtn } from "../Buttons";
import { toast } from "react-toastify";

const UserProfileImageHandler = ({ open, setOpen }) => {
    const [tab, setTab] = useState('upload');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState({});

    const { data } = useSession();

    useEffect(() => {
        if (data?.user) {
            setSession(data);
        }
    }, [data?.user]);

    const handleUpload = async () => {
        const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
        const MIN_WIDTH = 98;
        const MIN_HEIGHT = 98;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg, image/gif';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const image = new Image();
                    image.src = e.target.result;
                    image.onload = async () => {
                        const { width, height } = image;
                        const fileSize = file.size;
                        const fileType = file.type;
                        if (fileSize > 4 * 1024 * 1024) {
                            setError({ error: true, message: { logo: 'File size should be less than 4MB.' } });
                            return;
                        }
                        if (!ACCEPTED_FILE_TYPES.includes(fileType)) {
                            setError({ error: true, message: { logo: 'Invalid file type. Please upload a PNG, JPEG, or GIF file.' } });
                            return;
                        }
                        if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                            setError({ error: true, message: { logo: 'Minimum width and height should be 98px' } });
                            return;
                        }

                        try {
                            setDisabled(true);
                            setLoading(true);
                            const formData = new FormData();
                            formData.append('image', file);
                            formData.append('rm', false);
                            const response = await userImage(formData);
                            if (response?.data) {
                                setSession({ ...session, user: { ...session.user, ...response.data } });
                                setDisabled(false);
                                setLoading(false);
                                toast.success('Profile picture updated successfully');
                            }
                        } catch (error) {
                            toast.error('Failed to update profile picture');
                            setDisabled(false);
                            setLoading(false);
                        } finally {
                            setDisabled(false);
                            setLoading(false);
                        }

                    };
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    const handleCancle = () => {
        setOpen(false);
    }

    const handleRemove = async () => {
        try {
            setDisabled(true);
            setLoading(true);
            const formData = new FormData();
            formData.append('image', null);
            formData.append('rm', true);
            const response = await userImage(formData);
            if (response?.data) {
                setSession({ ...session, user: { ...session.user, ...response.data } });
                setTimeout(() => {
                    setDisabled(false);
                    setLoading(false);
                    toast.success('Profile picture removed successfully');
                }, 1000);
            }
        } catch (error) {
            toast.error('Failed to remove profile picture');
            setDisabled(false);
            setLoading(false);
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    return (
        <Dialog keepMounted={false} open={open} title="Profile Picture" >
            <div className="flex sm:min-w-[400px] relative max-w-[400px] min-w-[80vw] h-[90vh] flex-col space-y-4">
                <div className='absolute flex items-center bg-lightHead z-[999] dark:bg-darkHead top-0 left-0 w-full h-14'>
                    <LinearProgress className={`!h-0.5 !absolute !top-0 !z-[99] w-full ${loading && '!-mb-0.5'}`} hidden={!loading} color="accent" />
                    <div className="flex px-5 justify-between w-full h-full items-center">
                        <h2 className="font-bold text-xl cheltenham">
                            Profile Picture
                        </h2>
                        <CloseBtn onClick={() => setOpen(false)} />
                    </div>
                </div>
                {/* <div className="flex items-center justify-between w-full px-5 border-b border-secondary dark:border-secondaryDark pb-3 sm:w-auto sm:justify-start space-x-2 md:space-x-3 lg:space-x-5">
                    {
                        [{ name: 'Upload', value: 'upload' }, { name: 'Settings', value: 'settings' }].map((item, index) => {
                            return (
                                <Button key={index} variant="contained" sx={{ px: { xs: 3, sm: 1.4, md: 2.3, lg: 3 } }} className={`font-semibold truncate !text-nowrap cheltenham ${tab === item.value ? '!bg-accentLight dark:!bg-accentDark !text-white dark:!text-secondaryDark' : '!bg-light dark:!bg-dark !text-slate-900 dark:!text-slate-100'}`} color="primary" size="small" >
                                    {item.name}
                                </Button>
                            );
                        })
                    }
                </div> */}
                {
                    tab === 'upload' && (<>
                        <div className="w-full h-full flex-col flex items-center justify-center">
                            <Avatar sx={{ boxShadow: 3 }} width={128} height={128} className='w-32 h-32 rounded-full overflow-hidden' src={session?.user?.image} alt={session?.user?.name} />
                            <div className="mt-5 flex space-x-10">
                                <Button sx={{ px: 2.5 }} disabled={disabled || loading} onClick={() => handleUpload()} variant="contained" className="font-bold -tracking-tighter cheltenham !text-white dark:!text-black" color="button" size="small" > Update </Button>
                                <Button sx={{ px: 2.5 }} disabled={disabled || loading || !session?.user?.image} onClick={handleRemove} variant="outlined" className="font-bold -tracking-tighter cheltenham" color="button" size="small" > Remove </Button>
                            </div>
                        </div><p className="px-5 pb-2 text-justify text-sm">
                            Upload a profile picture to make your account more personal. It will be visible to other users. You can change it at any time. The image must be in JPG, PNG or GIF format and not exceed 5MB.
                        </p>
                    </>)
                }
            </div>
        </Dialog>
    );
}
export { UserProfileImageHandler }