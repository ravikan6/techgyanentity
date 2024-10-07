"use client";

import { MdBookmarkAdded, MdMoreVert, MdOutlineBookmarkAdd } from "react-icons/md";
import { ButtonWrapper, IconButtonWrapper } from ".";
import { PiShareFat } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";

const _Bookmark = ({ is, options }) => {
    return (
        <ButtonWrapper options={options?.button} >
            {is ? <MdBookmarkAdded className=' w-4 h-4' /> : <MdOutlineBookmarkAdd className='w-4 h-4' />}
        </ButtonWrapper>
    )
}

const _Share = ({ options }) => {
    return (
        <ButtonWrapper options={options?.button} >
            <PiShareFat className="w-4 h-4" />
        </ButtonWrapper>
    )
}

const _MoreMenu = ({ options }) => {

    return (
        <ButtonWrapper options={options?.button} >
            <MdMoreVert className={`w-4 h-4 ${options?.icon?.className}`} {...options?.icon?.Props} />
        </ButtonWrapper>
    )
}

const _Cross = ({ options }) => {

    return (
        <IconButtonWrapper options={options?.button} >
            <AiOutlineClose className='w-4 h-4' />
        </IconButtonWrapper>
    )
}

export { _Bookmark, _Share, _MoreMenu, _Cross };