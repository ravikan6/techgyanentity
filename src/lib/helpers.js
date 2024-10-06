import { getCldImageUrl } from "next-cloudinary";
import { toast } from "react-toastify";

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

async function getCImageUrl(id, options) {
    try {
        const url = await getCldImageUrl({ src: id, quality: 100, ...options });
        return url;
    } catch (error) {
        console.error('Error getting image url:', error);
        return null;
    }
}

/**
 * Generates a unique ID with the specified length.
 * The ID consists of a random prefix, current timestamp, and random suffix.
 *
 * @param {number} [length=13] - The length of the generated ID.
 * @returns {string} The generated unique ID.
 */
function generateUniqueId(length = 13) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = Date.now().toString(36); // Convert current timestamp to a base-36 string

    // Calculate the available length for the random part (after subtracting timestamp length)
    const availableLength = length - timestamp.length;

    // Ensure the prefix is larger than the suffix
    const prefixLength = Math.ceil(availableLength * 2 / 3); // ~2/3 of the available length
    const suffixLength = availableLength - prefixLength;      // remaining length for suffix

    let randomPrefix = '';
    let randomSuffix = '';

    // Generate random prefix
    for (let i = 0; i < prefixLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomPrefix += chars[randomIndex];
    }

    // Generate random suffix
    for (let i = 0; i < suffixLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomSuffix += chars[randomIndex];
    }

    return randomPrefix + timestamp + randomSuffix; // Combine prefix, timestamp, and suffix
}

function imgUrl(url) {
    if (url && (url !== null && '' !== url?.trim() && url !== undefined)) {
        return imageUrl(url, 'cloudinary');
    } else return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAACUCAMAAABY+0dBAAAAD1BMVEXy8vL////29vb5+fn8/Px3yyzeAAACS0lEQVR4nO2c7Y6CMBBFcdr3f+YVWpCWfqFuNnt7zh8TBJIe651pNSwLAAAAAAAAAAAAAAAAAAAAAAAAwC/z+Brur4fyGYiIICKyjsA+xyuIsC/cRkLEN0aAiAgiIoiIICIiKcLMuWdJvXUbRRHOhwbJ31GhJ8L8W72inog3u2Y5ET4RMd50qomwbCHlR2+jJiKbEONTQk3EZW2NiJtxiYiIvIhZvxqEZWS4fLqsAVcTkU+J2lWWO5ITYYmJ2ti2sxITciLGFl3+8raeiMXcng/VoNxdWXJITUR/Y2Y3dVYlKaLDqbK8TEwoIqmwx6XziUjLynHtfCLy3tOOw3OJcI+cYGI2EXkLfvRVk4koeIgm5hJR9BCu1xfhW7sVLxPyItypkb5sVpwCU12EnSrktWC8YkLjr0P1EdipLjQ8PE/RFrGH414X2giL8OcxVkrGDCJOX4Y1JnomZEUkoWD5gXlEpBNg23lox4SoiGy5PWBCU0TuIZaO+UQUPvutdDTmhKSIYi52SoeiiEp9aJcOQRHVj319s2pCUEQ1CJq9tp6IRiC2SoeciGYD6eI1E4gYaKTLGSImorvIrJYOLRFdDyEmSia0RHQ9BBOlDlNKRCcgmiaURAx5qAWmkIh+QESKgakjorW0HDChI2LcQzCRnS8jYjAgAoVVh4qIWx5K2zQiIoaDMjGhJ+K2h+uGlYaI5yTf/lacvfjG0W2bxnxARsSnSPwIzIM0VtYZwaNVFh62c4CICCIAAAAAAAAAAAAAAAAAAAAAAADg//ADWzkP4LXpARUAAAAASUVORK5CYII=';
}

function copyText(text, message) {
    navigator.clipboard.writeText(text).then(function () {
        toast.success(message?.success || 'Copied to clipboard');
    }, function (err) {
        toast.error(message?.error || 'Failed to copy to clipboard');
    });
}

function imageUrl(url, provider = 'local', options = {}) {
    if (url && (url !== null && '' !== url?.trim() && url !== undefined)) {
        if (url.startsWith('http')) {
            return url;
        }
        if (provider === 'cloudinary') {
            return getCldImageUrl({ src: url, quality: 100, ...options });
        }
    } else return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAACUCAMAAABY+0dBAAAAD1BMVEXy8vL////29vb5+fn8/Px3yyzeAAACS0lEQVR4nO2c7Y6CMBBFcdr3f+YVWpCWfqFuNnt7zh8TBJIe651pNSwLAAAAAAAAAAAAAAAAAAAAAAAAwC/z+Brur4fyGYiIICKyjsA+xyuIsC/cRkLEN0aAiAgiIoiIICIiKcLMuWdJvXUbRRHOhwbJ31GhJ8L8W72inog3u2Y5ET4RMd50qomwbCHlR2+jJiKbEONTQk3EZW2NiJtxiYiIvIhZvxqEZWS4fLqsAVcTkU+J2lWWO5ITYYmJ2ti2sxITciLGFl3+8raeiMXcng/VoNxdWXJITUR/Y2Y3dVYlKaLDqbK8TEwoIqmwx6XziUjLynHtfCLy3tOOw3OJcI+cYGI2EXkLfvRVk4koeIgm5hJR9BCu1xfhW7sVLxPyItypkb5sVpwCU12EnSrktWC8YkLjr0P1EdipLjQ8PE/RFrGH414X2giL8OcxVkrGDCJOX4Y1JnomZEUkoWD5gXlEpBNg23lox4SoiGy5PWBCU0TuIZaO+UQUPvutdDTmhKSIYi52SoeiiEp9aJcOQRHVj319s2pCUEQ1CJq9tp6IRiC2SoeciGYD6eI1E4gYaKTLGSImorvIrJYOLRFdDyEmSia0RHQ9BBOlDlNKRCcgmiaURAx5qAWmkIh+QESKgakjorW0HDChI2LcQzCRnS8jYjAgAoVVh4qIWx5K2zQiIoaDMjGhJ+K2h+uGlYaI5yTf/lacvfjG0W2bxnxARsSnSPwIzIM0VtYZwaNVFh62c4CICCIAAAAAAAAAAAAAAAAAAAAAAADg//ADWzkP4LXpARUAAAAASUVORK5CYII=';
}

export {
    formatLocalDate,
    hashPassword,
    verifyPassword,
    getCImageUrl,
    generateUniqueId,
    imgUrl,
    copyText,
    imageUrl
}