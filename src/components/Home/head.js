// @app/components/Home/head.js
'use client';
import { SgBtn } from "../Buttons";
import { BiSearchAlt } from 'react-icons/bi';

/**
 * Renders a sign-in button that displays a sign-in modal when clicked.
 * @returns {JSX.Element} The sign-in button component.
 */
export const SignBtn = () => {
    function SignOpen() {
        document.getElementById('SignINUP').style.display = 'block';
    };
    return (
        <SgBtn onclick={SignOpen} class={'px-6'} name='Get Started' />
    );
};

/**
 * Renders a search bar component.
 * @returns {JSX.Element} Search bar component.
 */
export const SearchBar = () => {
    return (
        <div className="relative">
            <input
                type="text"
                className="md:w-[350px] w-5 border rounded-full border-gray-400 bg-transparent h-9 px-5 pr-16 text-sm focus:outline-none"
                placeholder="Search"
            />
            <button
                type="submit"
                className="absolute right-0 top-0 mt-1 mr-4 bg-transparent"
            >
                <BiSearchAlt className="text-gray-600 h-4 w-4 fill-current" />
            </button>
        </div>
    );
};
