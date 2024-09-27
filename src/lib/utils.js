import CryptoJS from "crypto-js";
import { prisma } from "./db";

const encrypt = (data, key) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const decrypt = (data, key) => {
    try {
        return JSON.parse(CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.log(error);
        return null;
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

const getAuthorFirst = async (id) => {
    const author = await prisma.author.findFirst({
        where: {
            userId: id
        },
        select: {
            id: true,
        },
    })

    console.log(author, '______-Author____________-from_________getAuthorFirst_________');
    return author;
}

function formatDateToString(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const timeDifference = now - date;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(daysDifference / 30); // Approximate month length
    const yearsDifference = now.getFullYear() - date.getFullYear();

    // Short format
    let shortFormat;
    if (secondsDifference < 60) {
        shortFormat = `${secondsDifference}s ago`;
    } else if (minutesDifference < 60) {
        shortFormat = `${minutesDifference}m ago`;
    } else if (hoursDifference < 24) {
        shortFormat = `${hoursDifference}h ago`;
    } else if (daysDifference < 7) {
        shortFormat = `${daysDifference} day${daysDifference === 1 ? '' : 's'}`;
    } else if (daysDifference < 30) {
        shortFormat = `${weeksDifference} week${weeksDifference === 1 ? '' : 's'}`;
    } else if (yearsDifference === 0) {
        shortFormat = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
        shortFormat = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Long format
    const optionsLong = { day: 'numeric', month: 'long', year: 'numeric' };
    const longFormat = date.toLocaleDateString(undefined, optionsLong);

    // Return the object with both formats
    return {
        short: shortFormat || longFormat,
        long: longFormat
    };
}

function formatNumber(num) {
    if (num < 1000) return num.toString();

    const suffixes = [
        { value: 1E12, symbol: "T" },
        { value: 1E9, symbol: "B" },
        { value: 1E6, symbol: "M" },
        { value: 1E3, symbol: "K" }
    ];

    for (let i = 0; i < suffixes.length; i++) {
        if (num >= suffixes[i].value) {
            return (num / suffixes[i].value).toFixed(1).replace(/\.0$/, '') + suffixes[i].symbol;
        }
    }

    return num.toString();
}

export {
    encrypt,
    decrypt,
    generateDisplayNameOptions,
    getAuthorFirst,
    formatDateToString,
    formatNumber
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
 * @deprecated : This function is deprecated and will be removed in a future release (using old API or For Old Data).
 * Formats a date string to a human-readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function _formatDateToString(dateString) {
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

function capitlize(str) {
    try {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    } catch (error) {
        return str;
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
    _formatDateToString as formatDate,
    pLink,
    uiAvtar,
    getDate,
    getFevicon,
    generateListId,
    AnimalMain,
    capitlize
};