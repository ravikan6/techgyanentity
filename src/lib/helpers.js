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

function imgUrl(url) {
    if (url && (url !== null && '' !== url?.trim() && url !== undefined)) {
        return url;
    } else 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAACUCAMAAABY+0dBAAAAD1BMVEXy8vL////29vb5+fn8/Px3yyzeAAACS0lEQVR4nO2c7Y6CMBBFcdr3f+YVWpCWfqFuNnt7zh8TBJIe651pNSwLAAAAAAAAAAAAAAAAAAAAAAAAwC/z+Brur4fyGYiIICKyjsA+xyuIsC/cRkLEN0aAiAgiIoiIICIiKcLMuWdJvXUbRRHOhwbJ31GhJ8L8W72inog3u2Y5ET4RMd50qomwbCHlR2+jJiKbEONTQk3EZW2NiJtxiYiIvIhZvxqEZWS4fLqsAVcTkU+J2lWWO5ITYYmJ2ti2sxITciLGFl3+8raeiMXcng/VoNxdWXJITUR/Y2Y3dVYlKaLDqbK8TEwoIqmwx6XziUjLynHtfCLy3tOOw3OJcI+cYGI2EXkLfvRVk4koeIgm5hJR9BCu1xfhW7sVLxPyItypkb5sVpwCU12EnSrktWC8YkLjr0P1EdipLjQ8PE/RFrGH414X2giL8OcxVkrGDCJOX4Y1JnomZEUkoWD5gXlEpBNg23lox4SoiGy5PWBCU0TuIZaO+UQUPvutdDTmhKSIYi52SoeiiEp9aJcOQRHVj319s2pCUEQ1CJq9tp6IRiC2SoeciGYD6eI1E4gYaKTLGSImorvIrJYOLRFdDyEmSia0RHQ9BBOlDlNKRCcgmiaURAx5qAWmkIh+QESKgakjorW0HDChI2LcQzCRnS8jYjAgAoVVh4qIWx5K2zQiIoaDMjGhJ+K2h+uGlYaI5yTf/lacvfjG0W2bxnxARsSnSPwIzIM0VtYZwaNVFh62c4CICCIAAAAAAAAAAAAAAAAAAAAAAADg//ADWzkP4LXpARUAAAAASUVORK5CYII=';
}

export {
    formatLocalDate,
    hashPassword,
    verifyPassword,
    getCImageUrl,
    generateUniqueId,
    imgUrl
}