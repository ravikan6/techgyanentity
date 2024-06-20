'use client';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div>
            <h1>Settings Page</h1>
            {/* <div>
                <Link href="/settings/tab1">
                    <Button variant="contained">Tab 1</Button>
                </Link>
                <Link href="/settings/tab2">
                    <Button variant="contained">Tab 2</Button>
                </Link>
                <Link href="/settings/tab3">
                    <Button variant="contained">Tab 3</Button>
                </Link>
                <Link href="/settings/tab4">
                    <Button variant="contained">Tab 4</Button>
                </Link>
                <Link href="/settings/tab5">
                    <Button variant="contained">Tab 5</Button>
                </Link>
            </div> */}
            {children}
        </div>
    );
};

export default Layout;
