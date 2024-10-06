"use client";
import React, { useState, useEffect } from 'react'
import { Button, Dialog, MenuItem, TextField } from '@/components/rui'
import { InputAdornment, LinearProgress, Skeleton } from "@mui/material"
import { MdOutlineArrowRight } from "react-icons/md"
import { CloseBtn } from '@/components/Buttons';
import { InputHeader } from '@/components/studio/author/_edit-funcs';
import { toast } from 'react-toastify';
import { updateUser } from '@/lib/actions/setters/user';

const InfoItem = ({ title, value, icon, onClick }) => {
    let data = { icon: icon }

    return (
        <>
            <Button fullWidth={true} sx={{ borderRadius: 999 }} onClick={onClick} className="!w-full relative !p-0">
                <div className='flex w-full transition-all duration-500 group/infoItem text-gray-700 dark:text-gray-300 bg-light dark:bg-dark hover:bg-accentLight dark:hover:bg-accentDark hover:text-gray-200 dark:hover:text-gray-100 px-8 items-center py-3 rounded-full justify-between' >
                    <div className="flex flex-col md:flex-row w-[calc(100%-40px)]">
                        <div className='text-xs md:text-sm absolute max-md:-top-2 px-4 py-0.5 md:py-0 md:px-0 md:!bg-transparent bg-light dark:bg-dark group-hover/infoItem:bg-accentLight dark:group-hover/infoItem:bg-accentDark transition-all duration-500 rounded-full md:relative font-medium text-start md:w-1/4' >
                            {data?.icon && <data.icon className='w-3 h-3 md:w-6 md:h-6 mr-4' />}
                            {title}
                        </div>
                        <div className='text-base text-start font-semibold md:w-3/4' >{value ? value : <Skeleton width={Math.ceil(100 + Math.random() * 100)} />}</div>
                    </div>
                    <div className='text-end w-10' >
                        <MdOutlineArrowRight className='w-6 transition-all duration-500 group-hover/infoItem:text-slate-700 dark:group-hover/infoItem:text-gray-300 group-hover/infoItem:bg-light dark:group-hover/infoItem:bg-dark rounded-full md:p-1 h-6' />
                    </div>
                </div>
            </Button>
        </>
    )
}

const BasicInfoUpdate = ({ open, setOpen, user: _user }) => {
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(_user);

    const [info, setInfo] = useState({});

    useEffect(() => {
        setInfo({
            name: {
                value: user?.firstName,
                error: false,
                errorText: '',
            },
            name2: {
                value: user?.lastName,
                error: false,
                errorText: '',
            },
            username: {
                value: user?.username,
                error: false,
                errorText: '',
            },
            sex: {
                value: user?.sex
            },
            dob: {
                value: user?.dob,
                error: false,
                errorText: '',
            },
        })
    }, [user])

    const sex = [
        { key: 'male', value: 'Male' },
        { key: 'female', value: 'Female' },
        { key: 'other', value: 'Other' },
    ]

    const validateName = (value) => {
        const regex = /^[^<>]*$/;
        return regex.test(value);
    };

    const handleChangeName = (e, is2) => {
        const value = e.target.value;
        const isValid = validateName(value);
        if (is2) setInfo({ ...info, name2: { value, error: !isValid, errorText: !isValid && 'Name cannot contain angle brackets < >' } });
        else setInfo({ ...info, name: { value, error: !isValid, errorText: !isValid && 'Name cannot contain angle brackets < >' } });
    };

    const handleChangeHandle = (e) => {
        let value = e.target.value;
        let regex = /^[a-zA-Z0-9_]*$/;
        let isValid = regex.test(value);
        setInfo({ ...info, username: { value, error: !isValid, errorText: !isValid && 'Username can only contain letters, numbers, and underscores. ' } });
    };

    const handleChangeInfo = (e, key) => {
        if (key === 'dob') {
            const currentDate = new Date();
            const selectedDate = new Date(e.target.value);
            const minDate = new Date();
            minDate.setFullYear(currentDate.getFullYear() - 100);
            const maxDate = new Date();
            maxDate.setFullYear(currentDate.getFullYear() - 13);

            if (selectedDate < minDate || selectedDate > maxDate) {
                setInfo({ ...info, [key]: { value: e.target.value, error: true, errorText: 'Date must be between 13 and 100 years ago' } });
            } else {
                setInfo({ ...info, [key]: { value: e.target.value, error: false, errorText: '' } });
            }
        } else {
            setInfo({ ...info, [key]: { value: e.target.value, error: false, errorText: '' } });
        }
    };

    const isDisabled = disabled || loading;

    const handleOnSave = async () => {
        setLoading(true);
        setDisabled(true);
        try {
            let data = {
                firstName: info.name.value,
                lastName: info.name2?.value,
                username: info.username.value,
                dob: info.dob.value ? new Date(info.dob.value).toISOString() : null,
                sex: info.sex.value,
            };
            let res = await updateUser(data);
            if (res?.success) {
                setUser((prev) => ({ ...prev, ...res.data }))
                toast.success('Basic information updated successfully.');
                setOpen(false);
            }
        } catch (error) {
            toast.error('An error occurred while updating basic information. Please try again later.');
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const handleOnClose = () => {
        setInfo({
            name: {
                value: user?.firstName,
                error: false,
                errorText: '',
            },
            name2: {
                value: user?.lastName,
                error: false,
                errorText: '',
            },
            username: {
                value: user?.username,
                error: false,
                errorText: '',
            },
            sex: {
                value: user?.sex
            },
            dob: {
                value: user?.dob,
                error: false,
                errorText: '',
            },
        });
        setDisabled(false);
        setLoading(false);
        setOpen(false);
    }

    return (
        <>
            <Dialog open={open} title="Profile Picture" >
                <div className="flex sm:min-w-[400px] overflow-hidden relative max-w-[400px] min-w-[80vw] h-[90vh] flex-col space-y-4">
                    <div className='absolute flex items-center bg-lightHead z-[999] dark:bg-darkHead top-0 left-0 w-full h-14'>
                        <LinearProgress className={`!h-0.5 !absolute !top-0 !z-[99] w-full ${loading && '!-mb-0.5'}`} hidden={!loading} color="accent" />
                        <div className="flex px-5 justify-between w-full h-full items-center">
                            <h2 className="font-bold text-xl cheltenham">
                                Update Basic Information
                            </h2>
                            <CloseBtn onClick={() => setOpen(false)} />
                        </div>
                    </div>

                    <div className="flex flex-col px-5 overflow-auto space-y-7 pt-12 pb-16">
                        <div className="flex flex-col space-y-2">
                            <InputHeader label={'First Name'} desc={'Your name will be visible to other users on this website.'} tip={'Name cannot contain angle brackets < >'} />
                            <TextField disabled={isDisabled} size="small" required error={info?.name?.error} helperText={info?.name?.error && info?.name?.errorText} counter inputProps={{ maxLength: 50 }} value={info?.name.value} onChange={(e) => handleChangeName(e, false)} />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <InputHeader label={'Last Name'} desc={'Your name will be visible to other users on this website.'} tip={'Name cannot contain angle brackets < >'} />
                            <TextField disabled={isDisabled} size="small" error={info?.name2?.error} helperText={info?.name2?.error && info?.name2?.errorText} counter inputProps={{ maxLength: 50 }} value={info?.name2.value} onChange={(e) => handleChangeName(e, true)} />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <InputHeader label={'Username'} desc={'Your username will be visible to other users on this website.'} tip={'Username cannot contain angle brackets < >'} />
                            <TextField disabled={isDisabled} size="small" required error={info?.username?.error} helperText={info?.username?.error && info?.username?.errorText} counter inputProps={{ maxLength: 50 }} value={info?.username.value} onChange={(e) => handleChangeHandle(e)} InputProps={{ startAdornment: <InputAdornment position="start"><div className="ml-1 -mr-4 font-semibold text-gray-600 dark:text-gray-400 stymie">@</div></InputAdornment> }} />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <InputHeader label={'Gender'} desc={'To help us provide you with a better experience, please select your gender.'} tip={'You can make this information private.'} />
                            <TextField disabled={isDisabled} size="small" select defaultValue={info.sex.value} onChange={(e) => handleChangeInfo(e, 'sex')} >
                                {sex.map((item) => (
                                    <MenuItem value={item.value} key={item.key}>
                                        <div className='flex px-2 items-center'>
                                            {item.value}
                                        </div>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <InputHeader label={'Birthday'} desc={'Your birthday will be visible to other users on this website.'} tip={'You can make this information private.'} />
                            <TextField disabled={isDisabled} error={info?.dob?.error} helperText={info?.dob?.error && info?.dob?.errorText} size="small" type="date" value={info.dob.value ? new Date(info.dob.value).toISOString().split('T')[0] : ''} onChange={(e) => handleChangeInfo(e, 'dob')} />
                            {/* <p className="text-xs text-gray-500 dark:text-gray-400">You must be 13 years or older to use this website.</p> */}
                        </div>

                    </div>

                    <div className='absolute px-4 py-2.5 rounded-tl-xl bottom-0 bg-lightHead dark:bg-darkHead right-0'>
                        <Button sx={{ px: 2 }} size='small' variant='contained' className='dark:!text-black !text-white' disabled={disabled || loading || info?.name?.error || info?.username?.error || info?.dob?.error} color='button' onClick={handleOnSave}>Save</Button>
                    </div>

                    <div className='absolute px-4 py-2.5 rounded-tr-xl bottom-0 bg-lightHead dark:bg-darkHead left-0'>
                        <Button sx={{ px: 2 }} size='small' variant='outlined' disabled={disabled || loading} color='primary' onClick={handleOnClose}>Cancle</Button>
                    </div>

                </div>
            </Dialog>
        </>
    )
}

export { InfoItem, BasicInfoUpdate };