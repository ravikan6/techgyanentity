'use client';
import { useSession } from 'next-auth/react';
import { BookmarkBtn, CloseBtn, PrivacyHandlerBtn } from '../Buttons';
import { useState } from 'react';
import { Checkbox, FormControl, InputLabel, Select } from '@mui/material';
import { Button, Dialog, MenuItem, TextField, Tooltip } from '../rui';
import { TbLockAccess, TbLockCheck } from 'react-icons/tb';
import { MdOutlineAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { HiOutlineGlobe } from 'react-icons/hi';
import { CgLink } from 'react-icons/cg';
import { IoMdPeople } from 'react-icons/io';

/**
 * @deprecated: This component is deprecated and will be removed in the future.(Using old API)
 */
const Bookmark = (props) => {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isAddded, setIsAdded] = useState([]); // [id, id, id
    const [bookmark, setBookmark] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [chLists, setChLists] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [listName, setListName] = useState('');
    const [listType, setListType] = useState('');

    let token = null;
    let me = null;
    if (session) {
        token = session.user.jwt;
        me = session.user.id;
    }
    const id = props?.id;
    const channel_id = props?.ch_id;

    const handleBookmarkClick = () => { setShowModal(!showModal) }

    //     useEffect(() => {
    //         if (token) {
    //             getBookmark(token, id, me).then((data) => {
    //                 if (data.bookmarks.data.length > 0) {
    //                     const bookmarkID = data.bookmarks.data[0].id;
    //                     setBookmark(bookmarkID);
    //                     setIsChecked(true);
    //                 } else {
    //                     setIsChecked(false);
    //                 }
    //             });
    //             if (channel_id) {
    //                 getChannelList(token, channel_id).then((data) => {
    //                     setChLists(data.lists.data);
    //                 });
    //             }
    //         }
    //     }, [token]);

    //     useEffect(() => {
    //         if (isAddded || bookmark) {
    //             setIsBookmarked(true);
    //         } else {
    //             setIsBookmarked(false);
    //         }
    //     }, [isAddded, bookmark]);

    //     const handleBookmarkClick = () => {
    //         setShowModal(true);
    //     };

    const handleModalClick = (event) => {
        if (event.target === event.currentTarget) {
            setShowModal(false);
        }
    };

    const handleCheckboxChange = async (event) => {
        if (session?.user) {
            setIsChecked(event.target.checked);
            if (event.target.checked) {
                // await saveBookeMark(token, id, me).then((data) => {
                toast.success('Saved to Read Later');
                setBookmark('');
                // }).catch((error) => {
                //     toast.error('Something went wrong');
                // });
            } else {
                // const query = `mutation {
                //   deleteBookmark(id: ${bookmark}) {
                //     data {
                //       id
                //     }
                //   }
                // }`
                // await fetchData(query, token).then((data) => {
                //     if (data.data.deleteBookmark.data.id === bookmark) {
                toast.success('Removed from Read Later');
                setBookmark(null);
                //     } else {
                //         toast.error('Something went wrong');
                //     }
                // });
            }
        } else {
            toast.error('Please login to save this article');
        }
    };

    const handleCreateListClick = () => {
        setShowForm(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        // const slug = generateListId(listName);
        // const query = `mutation {
        // createList(data: { title: "${listName}", slug: "${slug}", privacy: ${listType} , channel: ${channel_id} , articles: [${id}] }) {
        //     data {
        //       id
        //       attributes {
        //         title
        //         privacy
        //         articles {
        //           data {
        //             id
        //           }
        //         }
        //       }
        //     }
        //   }
        // }`
        // await fetchData(query, token).then((data) => {
        //     if (data.data.createList.data.attributes.title === listName) {
        //         toast.success(`List ${listName} created`);
        //         setChLists([...chLists, data.data.createList.data]);
        //         setListName('');
        //         setListType('');
        //         setShowForm(false);
        //     } else {
        //         toast.error('Please refresh the page and try again');
        //     }
        // }).catch((error) => {
        //     toast.error('Something went wrong');
        // });
    };

    //     useEffect(() => {
    //         let isArticleInAnyList = chLists.some(list => {
    //             let articleData = list?.attributes?.articles?.data || [];
    //             console.log(articleData, id, ' ----NN article data');
    //             return articleData.some(article => article.id == id);
    //         });

    //         setIsAdded(isArticleInAnyList);

    //         console.log(isArticleInAnyList); // Outputs: true if the article is in any list, false otherwise
    //     }, [chLists, id]);

    const RreadingLists = () => {
        if (chLists.length > 0) {
            return (
                <>
                    {chLists.map((list) => {
                        const [isTrue, setIsTrue] = useState(false);
                        const [addedArticles, setAddedArticles] = useState(
                            list?.attributes?.articles?.data || []
                        );

                        useEffect(() => {
                            if (addedArticles.length > 0) {
                                const isPresent = addedArticles.find((item) => item.id == id);
                                if (isPresent) {
                                    setIsTrue(true);
                                } else {
                                    setIsTrue(false);
                                }
                            }
                        }, [addedArticles]);

                        const handleListChange = async (event) => {
                            if (event.target.checked) {
                                const newArticlesIds = [...addedArticles.map(item => item.id), id];
                                const query = `mutation {
                                        updateList(id: ${list.id} , data: { articles: ${JSON.stringify(newArticlesIds)} }) {
                                            data {
                                                id
                                            }
                                        }
                                    }`;
                                // await fetchData(query, token).then((data) => {
                                //     if (data.data.updateList.data.id === list.id) {
                                //         getChannelList(token, channel_id).then((data) => {
                                //             setChLists(data.lists.data);
                                //         });
                                //         toast.success(`Saved to ${list.attributes.title}`);
                                //     } else {
                                //         toast.error("Something went wrong");
                                //     }
                                // });
                            } else {
                                const newArticles = addedArticles.filter((item) => item.id != id) || [];
                                const newArticlesIds = newArticles.map(item => item.id) || [];
                                console.log(newArticles, addedArticles, 'new articles -----');
                                const query = `mutation {
                                        updateList(id: ${list.id} , data: { articles: ${newArticlesIds.length > 0 ? `[${newArticlesIds}]` : "[]"} }) {
                                            data {
                                                id
                                            }
                                        }
                                    }`;
                                // await fetchData(query, token).then((data) => {
                                //     if (data.data.updateList.data.id === list.id) {
                                //         getChannelList(token, channel_id).then((data) => {
                                //             setChLists(data.lists.data);
                                //         });
                                //         console.log(data.data.updateList.data, addedArticles, 'new articles ----- from rjk');
                                //         toast.success(`Removed from List ${list.attributes.title}`);
                                //     } else {
                                //         toast.error("Something went wrong");
                                //     }
                                // });
                            }
                        };

                        return (
                            <div key={list.id} className="flex items-center justify-between">
                                <div className="flex w-[calc(100%-20px)] -ml-2 items-center">
                                    <Checkbox
                                        checked={isTrue}
                                        onChange={handleListChange}
                                        inputProps={{ "aria-label": "controlled" }}
                                        color="accent"
                                        id={`${list.attributes.title}${list.id}`}
                                    />
                                    <Tooltip followCursor={true} title={list.attributes.title}>
                                        <label
                                            htmlFor={`${list.attributes.title}${list.id}`}
                                            className="text-base ml-0.5 mt-0.5 truncate max-w-[99%] stymie font-medium"
                                        >
                                            {list.attributes.title}
                                        </label>
                                    </Tooltip>
                                </div>
                                <PrivacyHandlerBtn privacy={list.attributes.privacy} />
                            </div>
                        );
                    })}
                </>
            );
        } else {
            return null;
        }
    };

    return (
        <div>
            <BookmarkBtn onClick={handleBookmarkClick} bookmarked={isBookmarked} />
            {(showModal && !session?.user) && alert("Sorry you are not logged in!")}
            {/* fixed top-0 left-0 z-[999] w-full h-full dark:bg-opacity-50 bg-black bg-opacity-25 flex justify-center items-center" */}
            {(showModal && session?.user) && (
                <Dialog
                    open={showModal}
                    onClose={handleModalClick}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div className="w-full mt-auto rounded-t-xl sm:m-auto sm:w-52 min-h-[11rem] sm:rounded-xl pt-4 pb-10 px-4">
                        <h3 className="text-sm font-medium">Save to ...</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex -ml-2 items-center">
                                <Checkbox
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    color='accent'
                                    id='bookmark'
                                />
                                <label htmlFor='bookmark' className='text-base ml-0.5 mt-0.5 stymie font-medium'>
                                    Read Later
                                </label>
                            </div>
                            <Tooltip followCursor={true} title="Your List is Private">
                                <TbLockCheck className='text-2xl h-5 w-5 ml-1 mr-1' />
                            </Tooltip>
                        </div>
                        <div>
                            <RreadingLists />
                        </div>
                        {showForm ? (
                            <form onSubmit={handleFormSubmit} className='mt-6'>
                                <div className='flex flex-col mb-4'>
                                    <TextField
                                        id="listName"
                                        label="Name"
                                        value={listName}
                                        onChange={(event) => setListName(event.target.value)}
                                        inputProps={{ maxLength: 150 }}
                                        size='small'
                                        required
                                        counter
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <FormControl size='small' required>
                                        <InputLabel id="listType-label"><span className='bg-gray-100 dark:bg-gray-800 px-2'>Privacy</span></InputLabel>
                                        <Select
                                            labelId="listType-label"
                                            id="listType"
                                            value={listType}
                                            onChange={(event) => setListType(event.target.value)}
                                            defaultValue='private'
                                            renderValue={(selected) => {
                                                const item = [
                                                    { value: 'public', name: 'Public' },
                                                    { value: 'unlisted', name: 'Unlisted' },
                                                    { value: 'private', name: 'Private' },
                                                    { value: 'followers', name: 'Followers' },
                                                ].find(item => item.value === selected);
                                                return item ? item.name : '';
                                            }}
                                            MenuProps={{
                                                anchorOrigin: {
                                                    vertical: "bottom",
                                                    horizontal: "left"
                                                },
                                                transformOrigin: {
                                                    vertical: "top",
                                                    horizontal: "left"
                                                },
                                            }}
                                        >
                                            {[
                                                { value: 'public', Icon: HiOutlineGlobe, name: 'Public', desc: 'Anyone can see and access this list' },
                                                { value: 'unlisted', Icon: CgLink, name: 'Unlisted', desc: 'Only people with the link can see and access this list' },
                                                { value: 'private', Icon: TbLockAccess, name: 'Private', desc: 'Only you can see and access this list' },
                                                { value: 'followers', Icon: IoMdPeople, name: 'Followers', desc: 'Only your followers can see and access this list' },
                                            ].map(({ value, Icon, name, desc }) => (
                                                <MenuItem value={value} key={value}>
                                                    <div className='flex px-2 items-center'>
                                                        <Icon className='mr-4 h-5 w-5 text-lg' />
                                                        <div>
                                                            <div>{name}</div>
                                                            <div className='text-xs'>{desc}</div>
                                                        </div>
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='flex mt-2 justify-end'>
                                    <Button color='secondary' size='small' className='mr-2' onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' color='accent' size='small'>
                                        Create
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className='absolute w-full px-1 -ml-4 bottom-1'>
                                <span className='text-sm font-medium mt-0.5 text-blue-600 hover:text-blue-800 dark:text-orange-300 dark:hover:text-orange-500'>
                                    <Button fullWidth={true} color='accent' size='small' onClick={handleCreateListClick}>
                                        <MdOutlineAdd className='h-5 w-5 mr-2' />
                                        <span className='mt-0.5'>Create a new list</span>
                                    </Button>
                                </span>
                            </div>
                        )}
                        <CloseBtn onClick={() => setShowModal(false)} class="absolute top-2 right-2" />
                    </div>
                </Dialog>
            )}
        </div>
    );

};

/**
 * @deprecated: This component is deprecated and will be removed in the future.(Using old API)
 */
// const Bookmark = () => {
//     return (
//         <div>
//             <BookmarkBtn bookmarked='false' />
//         </div>
//     );
// }

export default Bookmark;