import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@mui/material";
// import { get_SECTION_logo } from "./fetchers";
import { MenuItem, TextField, ToggleButtonGroup } from "@/components/rui";
import { ToggleButton } from "@mui/material";
import React, { useMemo, useEffect, useState, memo } from "react";
import { toast } from "react-toastify";
import { LearnMoreBtn } from "@/components/Buttons";

const MainLogoClient = ({ className }) => {
    const [sectionData, setSectionData] = useState(null);

    useMemo(async () => {
        // let data = await get_SECTION_logo();
        // data = await data?.data?.uiBrand;
        // setSectionData(data);
    }, []);

    return (
        <Link className={`${className}`} href={'/'}>
            {sectionData ? (!sectionData?.logoSvg) ? (
                sectionData?.brandLogo && <Image
                    alt={sectionData?.title}
                    src={process.env.MEDIA_URL_V2 + sectionData?.brandLogo}
                    width={120}
                    height={40}
                />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: sectionData?.logoSvg }}></div>
            ) : <Skeleton variant="rounded" animation='wave' width={120} height={34} />}
        </Link>
    )
}

/**
 * SelectDate component allows the user to select a date by choosing the day, month, and year.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the date input.
 * @param {string} props.date - The initial date value.
 * @param {function} props.setDate - The callback function to update the selected date.
 * @returns {JSX.Element} The SelectDate component.
 */
const SelectDate = ({ label, date, setDate }) => {
    const d = new Date(date) === 'Invalid Date' ? new Date() : new Date(date);
    const [day, setDay] = useState(d.getDate());
    const [month, setMonth] = useState(d.getMonth() + 1);
    const [year, setYear] = useState(d.getFullYear());
    const [error, setError] = useState({ type: '', message: '' });
    const months = [
        { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
        { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
        { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
        { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
    ];

    const onChange = (e, type) => {
        switch (type) {
            case 'day':
                setDay(e.target.value);
                break;
            case 'month':
                setMonth(e.target.value === '' ? '' : parseInt(e.target.value));
                break;
            case 'year':
                setYear(e.target.value);
                break;
            default:
                break;
        }
    }

    const validateDate = () => {
        if (!day && !year) {
            setError({ type: 'all', message: 'Please enter a valid date' });
            return false;
        }

        if (!months.find(item => item.value === parseInt(month))) {
            setError({ type: 'month', message: 'Select a valid month' });
            return false;
        }

        const maxDays = new Date(year, month, 0).getDate();

        if (isNaN(day) || day < 1 || day > maxDays) {
            setError({ type: 'day', message: 'Please enter a valid day' });
            return false;
        }

        if (isNaN(year) || year < 1900 || year > 2100) {
            year.length < 4 ? setError({ type: 'year', message: 'Please enter a four digit year' }) : setError({ type: 'year', message: 'Please enter a valid year' });
            return false;
        }

        if (day && month && year) {
            let d = new Date(year, (parseInt(month) - 1), day);
            if (d.toString() === 'Invalid Date') {
                setError({ type: 'all', message: 'Please enter a valid date' });
                return false;
            } else if (d > new Date()) {
                setError({ type: 'all', message: 'Please enter a valid date' });
                return false;
            } else {
                setError({ type: '', message: '' });
                return true;
            }
        }

        setError({ type: '', message: '' });
        return true;
    };

    useEffect(() => {
        let v = validateDate();
        if (day && month && year && v && setDate && !error.type) {
            setDate({ date: new Date(year, month - 1, day), error: false });
        } else {
            setDate({ date: null, error: true });
        }
    }, [day, month, year]);

    const handleInputChange = async (e, field) => {
        onChange(e, field);
    };

    return (
        <>
            <p className="text-sm dark:text-zinc-400 text-zinc-600">{label}</p>
            <div className="flex space-x-2 flex-row flex-nowrap items-center">
                <TextField size="small" error={error?.type == 'day' || error.type == 'all'} sx={{ width: '28%' }} type="number" variant="outlined" value={day} onChange={(e) => handleInputChange(e, 'day')} label="Day" />
                <TextField size="small" error={error?.type == 'month' || error.type == 'all'} sx={{ width: '40%' }} select variant="outlined" value={month} onChange={(e) => handleInputChange(e, 'month')} label="Month" >
                    {months.map((month, i) => (
                        <MenuItem key={i} value={month.value}>{month.label}</MenuItem>
                    ))}
                </TextField>
                <TextField size="small" error={error?.type == 'year' || error.type == 'all'} sx={{ width: '28%' }} type="number" variant="outlined" value={year} onChange={(e) => handleInputChange(e, 'year')} label='Year' />
            </div>
            {error && <div className="dark:text-red-600 text-red-500 stymie text-sm">{error.message}</div>}
        </>
    );
};

const WhoCanSeeChooser = ({ value, setValue, fOption = false }) => {
    const tginfo = () => {
        switch (value) {
            case "any":
                return `This information is visible to anyone who visits your profile or views your content on ${process.env.NEXT_PUBLIC_APP_NAME} platform. It is accessible to a wide audience. `;
            case "own":
                return `This information is private and can only be seen by you. It is not visible to anyone else.`;
            case "friends":
                return `This information is visible to your friends only. It is not accessible to the general public.`;
            default:
                return "";
        }
    }
    return (
        <>
            <ToggleButtonGroup size="small" fullWidth value={value} exclusive color="accent" onChange={(e, value) => { if (value !== null) setValue(value) }}>
                <ToggleButton value="own">Only You</ToggleButton>
                {fOption && <ToggleButton value="friends">Followers</ToggleButton>}
                <ToggleButton value="any">Anyone</ToggleButton>
            </ToggleButtonGroup>
            <div>
                <h3 className="text-sm dark:text-zinc-400 mt-2 text-zinc-600">
                    {tginfo()} <LearnMoreBtn url="/help/privacy" tooltip={'Learn more about privacy settings'} target="_blank" />
                </h3>
            </div>
        </>
    );
};

const toastError = (erros) => {
    if (erros && erros.length) {
        erros.forEach((error) => {
            toast.error(error.message);
        });
    }
};

export {
    MainLogoClient as MainLogo,
    SelectDate,
    WhoCanSeeChooser,
    toastError
};