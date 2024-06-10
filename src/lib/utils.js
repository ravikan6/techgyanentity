import { ApiGql_V2 } from "./connect";
import CryptoJS from "crypto-js";

const encrypt = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

const decrypt = (data, key) => {
    return JSON.parse(CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8));
}

const getUserChannels = async (id) => {
    let query = `query {
        UserChannels(user: "${id}") {
          id
          isActive
        }
      }`

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `${process.env.API_TOKEN_V2}`
    }

    try {
        let res = await ApiGql_V2(query, headers);
        res = await res?.data?.UserChannels[0];
        return res;
    } catch (error) {
        console.error(error);
        return {};
    }
}

const getUserCommunities = async (id) => {
    let query = `query {
        UserCommunities(user: "${id}") {
          isActive
          id
        }
      }`

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `${process.env.API_TOKEN_V2}`
    }

    try {
        let res = await ApiGql_V2(query, headers);
        res = await res?.data?.UserCommunities[0];
        return res;
    } catch (error) {
        console.error(error);
        return {};
    }
}

function generateDisplayNameOptions(name, nickname) {
    const options = [];
    options.push(name);
    options.push(`${name} "${nickname}"`);
    options.push(`${name} (${nickname})`);
    options.push(`${nickname} ${name}`);
    options.push(`${name} ${nickname}`);
    return options;
}
export {
    getUserChannels,
    getUserCommunities,
    encrypt,
    decrypt,
    generateDisplayNameOptions,
}

/**
 * @deprecated : This File is deprecated and will be removed in a future release (using old API or For Old Data).
 */

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns the Strapi API URL with the given path appended to it.
 * If process.env.API_URL is defined, it will be used as the base URL.
 * Otherwise, the default base URL 'http://server.raviblog.tech' will be used.
 * @param {string} path - The path to append to the base URL.
 * @returns {string} The complete Strapi API URL.
 */
function getStrapiURL(path = '') {
    return `${process.env.API_URL || 'http://server.raviblog.tech'}${path}`;
}

/** 
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns a link to a post or page.
 * @param {string} url - The URL of the post or page.
 * @returns {string} - The link to the post or page.
 */
function pLink(url) {
    const data = url
    let url1 = '';
    let url2 = data.slug;
    // if (data.publication?.data) {
    //     url1 = data.publication.data.attributes.slug;
    // } else if (data.author?.data) {
    //     url1 = `@${data.author.data.attributes.username}`;
    // }

    if (typeof url === 'string' || url == null) {
        if (url.startsWith('http') || url.startsWith('//')) {
            return url;
        }
    } else {
        return `${process.env.APP_URL}/view?s=${url2}`
    };
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns the media URL.
 * @param {string} url - The URL of the media.
 * @returns {string|null} - The media URL or null if the URL is invalid.
 */
function getMedia(url) {
    if (typeof url !== 'string' || url == null) {
        return null;
    }

    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    return `${getStrapiURL()}${url}`;
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Calculates the estimated reading time for a given content.
 * @param {string} content - The content to calculate the reading time for.
 * @param {number} [wordsPerMinute=300] - The average number of words per minute to use for the calculation.
 * @returns {string} The estimated reading time in minutes, formatted as a string.
 */
function readTime(content, wordsPerMinute = 300) {
    try {
        if (!content) {
            return "0 min";
        }
        const text = content.replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/);

        const readingTimeMinutes = words.length / wordsPerMinute;
        const roundedReadingTime = Math.ceil(readingTimeMinutes);
        const readingTimeFormatted = roundedReadingTime === 1 ? `${roundedReadingTime} min` : `${roundedReadingTime} mins`;

        return readingTimeFormatted;

    } catch (error) {
        console.error('Error calculating reading time:', error);
        return "N/A";
    }
}

/**
 * Returns the URL and metadata for a given image format.
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * @param {Object} imageData - The image data object.
 * @param {string} format - The desired format of the image.
 * @returns {Object} - The URL and metadata for the image in the desired format.
 */
function getMediaFormatURL(imageData, format) {
    if (!imageData) {
        return null;
    }

    if (!imageData.formats) {
        return {
            url: getMedia(imageData.url),
            width: imageData.width,
            height: imageData.height,
            ext: imageData.ext,
            mime: imageData.mime,
            name: imageData.name,
            alt: imageData.alternativeText ? imageData.alternativeText : imageData.name,
            caption: imageData.caption,
            subname: imageData.hash,
        };
    }

    const formatMap = {
        L: 'large',
        S: 'small',
        M: 'medium',
        T: 'thumbnail',
    };

    while (formatMap[format]) {
        if (imageData.formats[formatMap[format]]) {
            const formatData = imageData.formats[formatMap[format]];
            return {
                url: getMedia(formatData.url),
                width: formatData.width,
                height: formatData.height,
                ext: formatData.ext,
                subname: formatData.name,
                mime: formatData.mime,
                name: imageData.name,
                alt: imageData.alternativeText ? imageData.alternativeText : imageData.name,
                caption: imageData.caption,
            };
        }
        format = format === 'T' ? 'D' : String.fromCharCode(format.charCodeAt(0) + 1);
    }

    return {
        url: getMedia(imageData.url),
        width: imageData.width,
        height: imageData.height,
        ext: imageData.ext,
        mime: imageData.mime,
        name: imageData.name,
        subname: imageData.hash,
        alt: imageData.alternativeText ? imageData.alternativeText : imageData.name,
        caption: imageData.caption,
    };
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Formats a date string to a human-readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const timeDifference = now - date;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    if (secondsDifference < 60) {
        return `${secondsDifference} second${secondsDifference === 1 ? '' : 's'} ago`;
    } else if (minutesDifference < 60) {
        return `${minutesDifference} minute${minutesDifference === 1 ? '' : 's'} ago`;
    } else if (hoursDifference < 24) {
        return `${hoursDifference} hour${hoursDifference === 1 ? '' : 's'} ago`;
    } else if (daysDifference < 7) {
        return `${daysDifference} day${daysDifference === 1 ? '' : 's'} ago`;
    } else {
        const options = { day: 'numeric', month: 'short' };
        const year = date.getFullYear();
        const currentYear = now.getFullYear();
        if (year === currentYear) {
            return date.toLocaleDateString(undefined, options);
        } else {
            options.year = 'numeric';
            return date.toLocaleDateString(undefined, options);
        }
    }
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Generates a URL for a UI avatar image based on the given name and size.
 * @param {string} name - The name to use for the avatar.
 * @param {number} [size=40] - The size of the avatar image in pixels.
 * @returns {string} The URL for the generated avatar image.
 */
function uiAvtar(name, size) {
    if (!size) {
        size = 40
    }
    const baseUrl = 'https://ui-avatars.com/api/';
    const params = new URLSearchParams({
        rounded: true,
        'font-size': 0.47,
        background: 'random',
        bold: true,
        size: size,
        name: name,
    });
    return `${baseUrl}?${params.toString()}`;
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns user data object with formatted properties
 * @param {Object} userData - User data object
 * @param {number} size - Avatar image size
 * @returns {Object} - Formatted user data object
 */
function getUserData(userData, size) {
    return {
        id: userData?.id,
        username: userData?.username,
        name: userData?.name,
        email: userData?.email,
        avatar: userData?.avatar ? getMediaFormatURL(userData.avatar, 'S') : { url: uiAvtar(userData?.name, size), alt: userData?.name },
        provider: userData?.provider,
        confirmed: userData?.confirmed,
        blocked: userData?.blocked,
        createdAt: new Date(userData?.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        updatedAt: new Date(userData?.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        slug: userData?.slug,
        bookmarks: userData?.bookmarks || [],
    };
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns channel data object with formatted properties.
 *
 * @param {Object} cData - Channel data object.
 * @param {string} CoverFormate - Cover format string.
 * @returns {Object} - Formatted channel data object.
 */
function getChannelData(cData, CoverFormate) {
    let channel_logo = cData.attributes.logo?.data?.attributes
        ? getMediaFormatURL(cData.attributes.logo.data.attributes, 'S')
        : getMediaFormatURL(cData.attributes.logo, 'S');

    if (!channel_logo?.url) {
        channel_logo = { url: uiAvtar(cData.attributes.name), alt: cData.attributes.name };
    }

    const cover = cData.attributes.banner?.data?.attributes
        ? getMediaFormatURL(cData.attributes.banner.data.attributes, CoverFormate)
        : getMediaFormatURL(cData.attributes.banner, CoverFormate);
    const sociallinks = cData?.attributes.social || [];
    const socialLinkObj = sociallinks[0];
    if (socialLinkObj) {
        socialLinkObj.links = sociallinks.length - 1;
    }
    const sociallinksData = socialLinkObj;

    const folloWers = cData?.attributes?.followers?.data?.length || 0;

    const folloWings = {
        total: cData?.attributes?.followings?.data?.length,
        data: cData?.attributes?.followings?.data?.map((item) => {
            const nData = item.attributes.follower.data[0];
            let nchannel_logo = nData.attributes.logo?.data?.attributes
                ? getMediaFormatURL(nData.attributes.logo.data.attributes, 'S')
                : getMediaFormatURL(nData.attributes.logo, 'S');

            if (!channel_logo?.url) {
                nchannel_logo = { url: uiAvtar(nData.attributes.name), alt: nData.attributes.name };
            }
            return {
                id: item.id,
                c_id: nData.id,
                name: nData.attributes.name,
                handle: nData.attributes.handle,
                logo: nchannel_logo,
            };
        }) || [],
    };


    return {
        id: cData.id,
        handle: cData.attributes.handle,
        name: cData.attributes.name,
        channleId: cData.attributes.cid,
        enquiryEmail: cData.attributes.enquiry_email,
        followers: folloWers,
        followings: folloWings,
        description: cData.attributes.description,
        articles: cData.attributes.articles?.data || [],
        logo: channel_logo,
        confirmed: cData.attributes.confirmed,
        blocked: cData.attributes.blocked,
        createdAt: new Date(cData.attributes.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        updatedAt: new Date(cData.attributes.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        banner: cover || null,
        sociallinks: sociallinks || [],
        mainSociallink: sociallinksData || null,
    };
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * @param {*} data 
 * @returns 
 */
function getPostData(data) {
    const user = data.attributes?.user?.data;
    let user_avatar = user?.attributes?.avatar?.data && getMediaFormatURL(user?.attributes?.avatar?.data?.attributes, 'S');
    if (!user_avatar?.url) {
        user_avatar = { url: uiAvtar(user?.attributes?.username), alt: user?.attributes?.username };
    };
    let media = null;
    if (data.attributes?.media?.data) {
        media = data.attributes?.media?.data.map((item) => {
            return getMediaFormatURL(item.attributes, 'M');
        });
    }

    return {
        id: data.id,
        title: data.attributes?.title,
        type: data.attributes?.type,
        text: data.attributes?.text,
        slug: data.attributes?.slug,
        media: media,
        user: {
            id: user?.id,
            username: user?.attributes?.username,
            name: user?.attributes?.name,
            avatar: user_avatar,
        },
        createdAt: formatDate(data.attributes?.createdAt),
        // createdAt: new Date(data.attributes.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        updatedAt: new Date(data.attributes?.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
    };
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns an array of channel data objects with formatted properties.
 *
 * @param {Array} cDataArray - An array of channel data objects.
 * @param {string} CoverFormate - The format of the channel banner image.
 * @returns {Array} An array of formatted channel data objects.
 */
function getChannelsData(cDataArray, CoverFormate) {
    return cDataArray.map(cData => {
        let channel_logo = cData.attributes.logo?.data?.attributes
            ? getMediaFormatURL(cData.attributes.logo.data.attributes, 'S')
            : getMediaFormatURL(cData.attributes.logo, 'S');

        if (!channel_logo?.url) {
            channel_logo = { url: uiAvtar(cData.attributes.name), alt: cData.attributes.name };
        }

        const cover = cData.attributes.banner?.data?.attributes
            ? getMediaFormatURL(cData.attributes.banner.data.attributes, CoverFormate)
            : getMediaFormatURL(cData.attributes.banner, CoverFormate);
        const sociallinks = cData?.attributes.social || [];
        const socialLinkObj = sociallinks[0];
        if (socialLinkObj) {
            socialLinkObj.links = (sociallinks.length - 1);
        }
        const sociallinksData = socialLinkObj;

        const folloWers = cData?.attributes?.followers?.data?.length || 0;

        return {
            id: cData.id,
            handle: cData.attributes.handle,
            name: cData.attributes.name,
            channleId: cData.attributes.cid,
            enquiryEmail: cData.attributes.enquiry_email,
            followers: folloWers,
            description: cData.attributes.description,
            articles: cData.attributes.articles?.data || [],
            logo: channel_logo,
            confirmed: cData.attributes.confirmed,
            blocked: cData.attributes.blocked,
            createdAt: new Date(cData.attributes.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
            updatedAt: new Date(cData.attributes.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
            banner: cover || null,
            sociallinks: sociallinks || [],
            mainSociallink: sociallinksData || null,
        };
    });
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns channel information object.
 *
 * @param {Object} cData - Channel data object.
 * @param {string} CoverFormate - Cover format string.
 * @returns {Object} - Channel information object.
 */
function getChannelInfo(cData, CoverFormate) {
    let channel_logo = cData.logo?.data?.attributes
        ? getMediaFormatURL(cData.logo.data.attributes, 'S')
        : getMediaFormatURL(cData.logo, 'S');

    if (!channel_logo.url) {
        channel_logo = { url: uiAvtar(cData.name), alt: cData.name };
    }

    // const cover = cData.attributes.banner?.data?.attributes
    //     ? getMediaFormatURL(cData.attributes.banner.data.attributes, CoverFormate)
    //     : getMediaFormatURL(cData.attributes.banner, CoverFormate);

    return {
        handle: cData.handle,
        name: cData.name,
        channleId: cData.cid,
        // enquiryEmail: cData.attributes.enquiry_email,
        // description: cData.attributes.description,
        logo: channel_logo,
        confirmed: cData.confirmed,
        blocked: cData.blocked,
        createdAt: new Date(cData.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        updatedAt: new Date(cData.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        // banner: cover || null,
    };
}


/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns an object containing various date-related information based on the input date string.
 * @param {string} dateString - The date string to be parsed.
 * @returns {Object} An object containing the following properties:
 * - date: A formatted date string in the format "DD Month YYYY".
 * - dayOfWeek: The day of the week as a string (e.g. "Monday").
 * - ISO: The date string in ISO format.
 * - time: The time string in the format "HH:MM:SS AM/PM".
 * - diff: A string indicating how old the date is, in years, months, or days.
 */
function getDate(dateString) {
    if (!dateString) {
        return {
            date: '',
            dayOfWeek: '',
            ISO: '',
            time: '',
            diff: '',
        };
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const date = new Date(dateString);
    const currentDate = new Date();
    const diffDays = Math.round(Math.abs((currentDate - date) / oneDay));
    const diffMonths = Math.round(Math.abs(currentDate.getMonth() - date.getMonth() + (12 * (currentDate.getFullYear() - date.getFullYear()))));
    const diffYears = Math.abs(currentDate.getFullYear() - date.getFullYear());

    let diff = '';
    if (diffYears > 0) {
        diff = `${diffYears} year${diffYears > 1 ? 's' : ''}`;
    } else if (diffMonths > 0) {
        diff = `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
        diff = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }

    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[date.getMonth()];
    const formattedDate = `${date.getDate()} ${monthName} ${date.getFullYear()}`;
    const iso = date.toISOString();
    const time = date.toLocaleTimeString();

    return {
        date: formattedDate,
        dayOfWeek: dayOfWeek,
        ISO: iso,
        time: time,
        diff: (diffMonths >= 3) ? `This article is ${diff} old.` : '',
    };
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Returns the URL for the favicon of a given domain.
 * @param {string} domain - The domain name for which to get the favicon.
 * @param {number} [size=40] - The size of the favicon to get. Defaults to 40.
 * @returns {string} The URL for the favicon.
 */
const getFevicon = (domain, size) => {
    const baseUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size || 40}`;
    return baseUrl;
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Generates a unique list ID based on the given name.
 * @param {string} name - The name to base the ID on.
 * @returns {string} The generated list ID.
 */
function generateListId(name) {
    const symbols = "-_.~";
    const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = '';

    for (let i = 0; i < 11; i++) {
        if (Math.random() < 0.1) { // 20% chance to insert a symbol
            id += symbols.charAt(Math.floor(Math.random() * symbols.length));
        } else if (i % 3 === 0) { // insert characters from the name at positions divisible by 3
            id += name.charAt(Math.floor(Math.random() * name.length));
        } else { // insert random alphanumeric characters at all other positions
            id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
        }
    }

    id = id.split('').map(char => Math.random() < 0.5 ? char.toUpperCase() : char).join('');

    return id;
}

/**
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * @returns 
 */
const AnimalMain = () => {
    return (
        <>
            <span className="animate-spin flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentDark opacity-75"></span>
                <span className="relative animate-bounce to-accentLight from-yellow-300 inline-flex rounded-full h-5 w-5 bg-gradient-radial"></span>
            </span>
        </>
    )
}

export {
    getStrapiURL,
    getMedia,
    readTime,
    formatDate,
    pLink,
    uiAvtar,
    getMediaFormatURL,
    getChannelData,
    getDate,
    getUserData,
    getFevicon,
    getChannelInfo,
    generateListId,
    getChannelsData,
    getPostData,
    AnimalMain,
};
