function formatLocalDate(inputDate) {
    const dateParts = inputDate?.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const date = new Date(year, month, day);

    // Convert the date to the desired format: "18 November 2006"
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}


export {
    formatLocalDate
}