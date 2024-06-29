'use client';
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { BasicInfoUpdate, InfoItem } from './_client';
import { formatLocalDate } from '@/lib/helpers';
import { Avatar, Skeleton } from '@mui/material';
import { Button } from '@/components/rui/_components';
import { UserProfileImageHandler } from '../_profile_image';
import { useSession } from 'next-auth/react';

const Account = ({ session }) => {
  return (
    <div>
      <PersonalInfo user={session?.user} />
    </div>
  )
}

const PersonalInfo = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [infoModel, setInfoModel] = useState(false);

  const { data } = useSession();

  data?.user ? user = data.user : user = user;

  const profileModelHandler = () => setOpen(!open);
  const infoModelHandler = () => setInfoModel(!infoModel);

  return (
    <>
      <profile-info className="content-center">
        <div className="flex flex-col space-y-2 mb-20">
          <h2 className="text-2xl cheltenham text-center font-semibold">Personal Information</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">Update your personal information and manage your account settings.</p>
        </div>
        <div className='mb-10' >
          <div className='flex' >
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl stymie text-slate-800 dark:text-slate-200 font-medium">Profile Information in {process.env.APP_NAME} services</h3>
              <p className="text-gray-600 dark:text-gray-400">Take control of your personal details and tailor your preferences. Opt to share specific information, such as contact details, for seamless communication with others. You can also get an overview of your profiles.</p>
            </div>
            {/* <div className='flex items-center justify-center'>
              <Image width={360} height={128} src="https://www.gstatic.com/identity/boq/accountsettingsmobile/profile_scene_visible_360x128_18500c161aac04e9279fbb234b7de818.png" alt="Profile Picture" />
            </div> */}
          </div>
        </div>

        <InfoBox title="Basic Info" description={`Edit your name, email, and phone number. This information will be visible to other users on ${process.env.APP_NAME} services.`}>
          <div className='flex flex-col mt-4 space-y-4' >
            <div onClick={profileModelHandler} className='flex cursor-pointer w-full transition-all duration-500 group/infoItem text-gray-700 dark:text-gray-300 bg-light dark:bg-dark hover:bg-accentLight dark:hover:bg-accentDark hover:text-gray-200 dark:hover:text-gray-100 px-8 items-center py-3 rounded-xl justify-between' >
              <p className='text-sm ' >Profile Picture</p>
              <p>A profile picture helps personalise your account</p>
              <Avatar width={32} height={32} className='w-8 h-8 rounded-full overflow-hidden' src={user?.image} alt={user?.name} />
            </div>
            <InfoItem title="Name" value={user?.name} onClick={infoModelHandler} />
            <InfoItem title="Username" value={user?.username} onClick={infoModelHandler} />
            <InfoItem title="Gender" value={user?.sex || 'Not Provided'} onClick={infoModelHandler} />
            <InfoItem title="Birthday" value={formatLocalDate(user?.dob) || 'Not Provided'} onClick={infoModelHandler} />
          </div>
        </InfoBox>

      </profile-info>
      <BasicInfoUpdate open={infoModel} setOpen={setInfoModel} user={user} />
      <UserProfileImageHandler open={open} setOpen={setOpen} />
    </>
  )
};

const InfoBox = ({ title, description, children }) => {
  return (
    <div className='rounded-xl bg-lightHead dark:bg-darkHead mt-5 px-8 py-5' >
      <h3 className="text-lg stymie text-slate-800 dark:text-slate-200 font-medium">{title}</h3>
      <p className="text-gray-600 text-xs dark:text-gray-400">{description}</p>
      <div className="mt-8">
        {children}
      </div>
    </div>
  )
}

export { PersonalInfo };

export default Account;
