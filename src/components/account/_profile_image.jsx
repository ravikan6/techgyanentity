'use client';
import { Dialog, Button } from "../rui";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@mui/material";
import { userImage } from "@/lib/actions/user";

const UserProfileImageHandler = ({ open, setOpen }) => {
    const [tab, setTab] = useState('upload');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const session = useSession();

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
                                setDisabled(false);
                                setLoading(false);
                                // setOpen(false);
                            }
                        } catch (error) {
                            console.error(error);
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

    return (
        <Dialog open={open} setOpen={setOpen} title="Profile Picture" >
            <div className="flex sm:min-w-[400px] max-w-[400px] min-w-[80vw] h-[90vh] flex-col space-y-4">
                <h2 className="mt-3 px-5 font-bold text-xl cheltenham">
                    My Profile Picture
                </h2>
                <div className="flex items-center justify-between w-full px-5 border-b border-secondary dark:border-secondaryDark pb-3 sm:w-auto sm:justify-start space-x-2 md:space-x-3 lg:space-x-5">
                    {
                        [{ name: 'Upload', value: 'upload' }, { name: 'Settings', value: 'settings' }].map((item, index) => {
                            return (
                                <Button key={index} variant="contained" sx={{ px: { xs: 3, sm: 1.4, md: 2.3, lg: 3 } }} className={`font-semibold truncate !text-nowrap cheltenham ${tab === item.value ? '!bg-accentLight dark:!bg-accentDark !text-white dark:!text-secondaryDark' : '!bg-light dark:!bg-dark !text-slate-900 dark:!text-slate-100'}`} color="primary" size="small" >
                                    {item.name}
                                </Button>
                            );
                        })
                    }
                </div>
                {
                    tab === 'upload' && (<>
                        <p className="px-5 text-sm">
                            Upload a profile picture to make your account more personal. It will be visible to other users. You can change it at any time. The image must be in JPG, PNG or GIF format and not exceed 5MB.
                        </p>
                        <div className="w-full h-full flex-col flex items-center justify-center">
                            <Avatar width={128} height={128} className='w-32 h-32 rounded-full overflow-hidden' src={session?.user?.image} alt={session?.user?.name} />
                            <div className="mt-5 flex space-x-10">
                                <Button disabled={disabled || loading} onClick={() => handleUpload()} variant="contained" className="font-bold -tracking-tighter cheltenham dark:!text-black" color="button" size="small" > Update </Button>
                                <Button disabled={disabled || loading} onClick={handleCancle} variant="outlined" className="font-bold -tracking-tighter cheltenham" color="button" size="small" > Remove </Button>
                            </div>
                        </div>
                    </>)
                }
            </div>
        </Dialog>
    );
}

export { UserProfileImageHandler }