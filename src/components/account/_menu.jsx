import Link from "next/link";
import { Button } from "../rui/_components";
import { MdAccountCircle, MdCreditCard, MdLock, MdOutlineAccountCircle, MdOutlineCreditCard, MdOutlineLock, MdOutlinePrivacyTip, MdOutlineSettingsSuggest, MdPrivacyTip, MdSettingsSuggest } from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { BsFillPersonVcardFill } from "react-icons/bs";


const AccountMenu = ({ path, session }) => {
    path = decodeURIComponent(path);
    const menu = [
        {
            title: 'Account',
            url: session?.user?.username ? `@${session?.user?.username}` : 'account',
            icon: MdOutlineAccountCircle,
            icon2: MdAccountCircle,
        },
        {
            title: 'Personal Information',
            url: 'personal-information',
            icon: AiOutlineIdcard,
            icon2: BsFillPersonVcardFill,
        },
        {
            title: 'Data & Privacy',
            url: 'data-privacy',
            icon: MdOutlinePrivacyTip,
            icon2: MdPrivacyTip,
        },
        {
            title: 'Security',
            url: 'security',
            icon: MdOutlineLock,
            icon2: MdLock,
        },
        {
            title: 'Billing & Subscription',
            url: 'billing-subscription',
            icon: MdOutlineCreditCard,
            icon2: MdCreditCard,
        },
        {
            title: 'Preferences & Settings',
            url: 'preferences-settings',
            icon: MdOutlineSettingsSuggest,
            icon2: MdSettingsSuggest,
        },
    ];
    const MenuBtnStyle = (link) => {
        return `mb-0.5 ml-2 rounded-full h-10m max-w-[240px] transition-colors w-full ${(path === link) ? 'bg-accentLight dark:bg-accentDark/80' : ''}`
    }

    return (
        <>
            {menu.map((link, index) => {
                return (
                    <div key={index} className={MenuBtnStyle(link?.url)}>
                        <Link href={`/account/${link?.url}`} className="" >
                            <Button fullWidth >
                                <div className="flex py-0.5 px-2 w-full space-x-7 items-center">
                                    {(path === link.url) ? <link.icon2 className="w-5 dark:text-white text-gray-100 fill-white h-5" /> : <link.icon className="w-5 dark:text-gray-200 text-gray-700 h-5" />}
                                    <span className={`text-base dark:text-gray-100 ${(path === link?.url) ? 'text-gray-200' : 'text-gray-800'} font-semibold truncate`}>{link?.title}</span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                )
            })}
        </>
    );
}

export { AccountMenu };