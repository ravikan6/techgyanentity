'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BsPatchQuestion } from 'react-icons/bs';
import { Dialog, InputLabel, DialogContent, DialogContentText, DialogActions, TextField, Button, FormControl, Tooltip, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from '@mui/material';


const ArticleReportModal = (props) => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [reportType, setReportType] = useState('');
    const [reportTypeOptions, setReportTypeOptions] = useState([]);
    const [reportSubtype, setReportSubtype] = useState('');
    const [reportSubtypeOptions, setReportSubtypeOptions] = useState([]);
    const [reportDescription, setReportDescription] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const isNextDisabled = reportType === '' || (reportType !== '' && reportSubtype === '' && reportSubtypeOptions.length > 0);

    useEffect(() => {
        setIsOpen(props.open)
    }, [props.open])

    const handleReportTypeChange = (event) => {
        setReportType(event.target.value);
        setReportSubtype('');
        setReportSubtypeOptions([]);
        if (event.target.value === 'Spam_or_Misleading') {
            setReportSubtypeOptions(['Fraudulent content', 'Irrelevant content']);
        } else if (event.target.value === 'Inappropriate_Content') {
            setReportSubtypeOptions(['Offensive content']);
        } else if (event.target.value === 'Hate_Speech_or_Discrimination') {
            setReportSubtypeOptions(['Hate speech']);
        } else if (event.target.value === 'Harassment_or_Bullying') {
            setReportSubtypeOptions(['Bullying']);
        } else if (event.target.value === 'Misinformation') {
            setReportSubtypeOptions(['False information']);
        } else if (event.target.value === 'Sexual_Content') {
            setReportSubtypeOptions(['Nudity']);
        } else if (event.target.value === 'Promotes_Terrorism') {
            setReportSubtypeOptions(['Terrorist content']);
        } else if (event.target.value === 'Violence_or_Self-Harm') {
            setReportSubtypeOptions(['Violent content', 'Self-harm']);
        } else if (event.target.value === 'Legal_Issue') {
            setReportSubtypeOptions(['Illegal content']);
        } else if (event.target.value === 'Child_Safety_Concerns') {
            setReportSubtypeOptions([]);
        }
    };

    const handleReportSubtypeChange = (event) => {
        setReportSubtype(event.target.value);
    };

    const handleReportDescriptionChange = (event) => {
        setReportDescription(event.target.value);
    };

    const handleNext = () => {
        if (step === 1 && reportType !== '') {
            setStep(2);
        }
    };

    const handleReport = async () => {
        setLoading(true);
        if (session) {
            /**
             *  Will add Api Request using version 2 
             */

            try {

                if (false /* response */) {
                    setStep(3)
                    setSuccess(true);
                } else {
                    setError(true);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        } else {
            setError(true);
            setLoading(false);
        }
    };


    const handleClose = () => {
        setIsOpen(false);
        setStep(1);
        setReportType('');
        setReportTypeOptions([]);
        setReportSubtype('');
        setReportSubtypeOptions([]);
        setReportDescription('');
        setSuccess(false);
        setError(false);
        setLoading(false);
        props.onClose();
    };

    useEffect(() => {
        setReportTypeOptions([
            { value: 'Inappropriate_Content', label: 'Inappropriate Content', des: 'Content that is considered not suitable or proper in a particular setting' },
            { value: 'Hate_Speech_or_Discrimination', label: 'Hate Speech or Discrimination', des: 'Speech or behavior that expresses violence or prejudice against a particular group' },
            { value: 'Harassment_or_Bullying', label: 'Harassment or Bullying', des: 'Unwanted aggressive behavior intended to harm or disturb' },
            { value: 'Spam_or_Misleading', label: 'Spam or Misleading', des: 'Unsolicited messages sent in bulk or information intended to deceive' },
            { value: 'Misinformation', label: 'Misinformation', des: 'False or inaccurate information, especially that which is deliberately intended to deceive' },
            { value: 'Sexual_Content', label: 'Sexual Content', des: 'Content that involves sexual activity or erotic matter' },
            { value: 'Promotes_Terrorism', label: 'Promotes Terrorism', des: 'Content that encourages or supports acts of violence intended to create fear for political purposes' },
            { value: 'Violence_or_Self-Harm', label: 'Violence or Self-Harm', des: 'Content that depicts or encourages harm to oneself or others' },
            { value: 'Legal_Issue', label: 'Legal Issue', des: 'Content that involves a matter or problem concerning the law' },
            { value: 'Child_Safety_Concerns', label: 'Child Safety Concerns', des: 'Content that poses a threat to the safety or well-being of children' },
        ]);
    }, []);

    let getObjLable = reportTypeOptions.find(obj => obj.value === reportType);

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className='h-[90vh] overflow-hidden bg-gray-100 dark:bg-gray-800 w-96'>
                    <h3 className='karnak text-base px-6 py-3 font-semibold text-black dark:text-white'>{step === 3 ? 'Thank you for Reporting' : "Report this post"}</h3>
                    <div className='h-[calc(100%-100px)] overflow-y-auto rb-scrollbar border-y dark:border-gray-700 border-gray-300'>
                        <DialogContent sx={{ width: 370, py: 0 }}>
                            {step === 1 &&
                                <DialogContentText id="alert-dialog-description">
                                    <FormControl component="fieldset">
                                        <RadioGroup aria-label="report-type" name="report-type" value={reportType} onChange={handleReportTypeChange}>
                                            {reportTypeOptions.map((option) => (
                                                <>
                                                    <FormControlLabel variant="standard" key={option.value} value={option.value} control={<Radio size='small' color='accent' />}
                                                        label={<span className='ml-2 text-gray-950 dark:text-gray-50 cheltenham'>{option.label}
                                                            <Tooltip title={<p className='p-1 text-[12px] max-w-[200px]'>{option.des}</p>} placement="bottom">
                                                                <span className='ml-1'><BsPatchQuestion /></span>
                                                            </Tooltip></span>} />
                                                    {reportType === option.value && reportSubtypeOptions.length > 0 &&
                                                        <div className='ml-10 w-[300px]'> <FormControl size='small' fullWidth>
                                                            <InputLabel id="report-subtype-label"><span className='bg-gray-100 px-2 dark:bg-gray-800'>Choose One</span></InputLabel>
                                                            <Select
                                                                labelId="report-subtype-label"
                                                                id="report-subtype"
                                                                size='small'
                                                                fullWidth
                                                                value={reportSubtype}
                                                                defaultValue='Choose One'
                                                                onChange={handleReportSubtypeChange}
                                                            >
                                                                {reportSubtypeOptions.map((option) => (
                                                                    <MenuItem key={option || Math.random(30)} value={option}>{option}</MenuItem>
                                                                ))}
                                                            </Select>

                                                        </FormControl></div>
                                                    }</>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </DialogContentText>
                            }
                            {step === 2 &&
                                <DialogContentText className='mt-10 mb-5' id="alert-dialog-description">
                                    <div className='relative'>
                                        <TextField
                                            onChange={handleReportDescriptionChange}
                                            autoFocus
                                            margin="dense"
                                            id="report-description"
                                            placeholder='Provide more details (optional)'
                                            label="More details (optional)"
                                            type="text"
                                            multiline={true}
                                            rows={4}
                                            fullWidth
                                            inputProps={{ maxLength: 500 }}
                                        />
                                        <p className='text-[10px] styime text-right'>{reportDescription.length}/500</p>
                                    </div>
                                </DialogContentText>
                            }
                            {step === 3 &&
                                <DialogContentText id="alert-dialog-description">
                                    <div className='flex mb-5 justify-center w-full'>
                                        <Image loading='eager' quality={100} src='/static/images/report-static-bg-thank-imge.svg' width={300} height={300} />
                                    </div>
                                    <p className='mb-2 font-normal border-b border-gray-300 dark:border-gray-700'>
                                        <span className='font-semibold text-base text-gray-800 dark:text-gray-200 cheltenham'>Reason: </span>
                                        <span className='ml-2 text-sm'>{getObjLable.label}</span>
                                    </p>
                                    {reportDescription !== '' && (
                                        <p className='mb-2 font-normal border-b border-gray-300 dark:border-gray-700'>
                                            <span className='font-semibold text-base text-gray-800 dark:text-gray-200 cheltenham'>Additional Details:</span>
                                            <span className='ml-2 text-sm'>{reportDescription}</span>
                                        </p>
                                    )}
                                </DialogContentText>
                            }
                            {step < 3 &&
                                <div className='mt-8'>
                                    <p className='text-xs text-zinc-700 dark:text-zinc-300'>At {process.env.APP_NAME}, our dedicated staff conducts round-the-clock reviews of flagged content and channels to assess compliance with our Community Guidelines. Accounts are penalised for Community Guidelines violations, and serious or repeated violations can lead to account termination.</p>
                                    <Button size='small' color="accent" className='my-1'>
                                        <Link className='px-1' href='/t/community-guidelines'>Report Channel</Link>
                                    </Button>
                                </div>
                            }
                        </DialogContent>
                    </div>
                    <DialogActions>
                        <div className='mt-1'>
                            <Button disabled={loading} onClick={handleClose} size='small' color="primary">
                                {step === 3 ? 'Close' : 'Cancel'}
                            </Button>
                            {step < 2 &&
                                <Button onClick={handleNext} disabled={isNextDisabled} size='small' color="accent">
                                    Next
                                </Button>
                            }
                            {step === 2 &&
                                <Button onClick={handleReport} size='small' color="accent" disabled={loading}>
                                    {loading ? 'Reporting...' : 'Report'}
                                </Button>
                            }
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}


export { ArticleReportModal };
