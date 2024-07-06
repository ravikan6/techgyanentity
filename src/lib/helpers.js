import { getCldImageUrl } from "next-cloudinary";

function formatLocalDate(inputDate) {
    if (inputDate == null || inputDate === '') {
        return null;
    }
    const dateParts = inputDate?.split('-');
    if (dateParts.length < 3) {
        return null;
    }
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const date = new Date(year, month, day);

    // Convert the date to the desired format: "18 November 2006"
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}

async function hashPassword(password) {
    const saltRounds = 10;
    const passwordPepper = process.env.PASSWORD_PEPPER;

    try {
        const combinedPassword = password + passwordPepper;
        const hash = await bcrypt.hash(combinedPassword, saltRounds);
        console.log('Hashed password:', hash);
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
    }
}

async function verifyPassword(password, hash) {
    const passwordPepper = process.env.PASSWORD_PEPPER;

    try {
        const combinedPassword = password + passwordPepper;
        const match = await bcrypt.compare(combinedPassword, hash);
        console.log('Password match:', match);
        return match;
    } catch (err) {
        console.error('Error verifying password:', err);
    }
}

async function getCImageUrl(id, options) {
    try {
        const url = await getCldImageUrl({ src: id, quality: 100, ...options });
        return url;
    } catch (error) {
        return null;
        console.error('Error getting image url:', error);
    }
}

function generateUniqueId(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueId = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        uniqueId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return uniqueId;
}

export {
    formatLocalDate,
    hashPassword,
    verifyPassword,
    getCImageUrl,
    generateUniqueId
}