'use client';
import { Button, TextField } from '@/components/rui';
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { createAuthor } from "@/lib/actions/user";

const CreateAuthor = ({ context, modern = true }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const { data: session, status: status } = useSession();

    const handleLoading = (s) => {
        context?.setInProgress(s);
        setIsLoading(s);
    }

    useEffect(() => {
        if (status == 'loading') {
            handleLoading(true);
        } else {
            handleLoading(false);
        }
    }, [session]);

    const createAuthorx = () => {
        handleLoading(true);
        try {
            createAuthor({ name: name }).then((res) => {
                handleLoading(false);
                if (res?.status === 200 && res?.data) {
                    toast.success('Author created successfully');
                    window.location.href = `/${process.env.STUDIO_URL_PREFIX}/dashboard/@${res?.data?.handle}`;
                } else {
                    for (let i in res?.errors) {
                        toast.error(res?.errors[i]?.message);
                    }
                }
            });
        } catch (error) {
            handleLoading(false);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <div className="block max-w-xl mx-auto relative">
                <author-create-page className="block">
                    <div className={`${modern && 'bg-lightHead dark:bg-darkHead'} px-6 py-4 rounded-xl`}>
                        <div className='text-center text-xl font-bold mb-1 cheltenham'>
                            Become an Creator
                        </div>
                        <div className='text-xs mb-4 text-gray-700 dark:text-gray-300' >
                            Create an creator account to start writing your own stories. creators can write stories, publish them and earn money.
                        </div>
                        <div className='text-sm mb-2' >
                            <TextField
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                fullWidth
                                disabled={isLoading}
                                counter
                                color='button'
                                label="Name"
                                inputProps={{ maxLength: 100 }}
                                size="medium"
                            />
                        </div>
                        <div className='mt-8'>
                            <Button onClick={() => createAuthorx()} disabled={name?.length < 3 || isLoading} sx={{ px: '16px', py: '4px' }} color='button' variant='outlined'>Create</Button>
                        </div>
                    </div>
                </author-create-page>
            </div>
        </>
    );
}

export default CreateAuthor;