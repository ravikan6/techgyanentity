"use client";

import { useEffect, useState } from "react";

const AuthorBanner = ({ id }) => {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            const res = await fetch(`/api/image_url?id=${id}`);
            const data = await res.json();
            setBanner(data.data);
            setLoading(false);
        }
        fetchBanner();
    }, [id]);

    return (
        <>
            {loading ? <div className="w-full h-40 bg-gray-200 animate-pulse"></div> :
                <><img draggable src={banner?.url} alt="Banner" className="w-full h-40 object-cover" />
                    {JSON.stringify(banner)}
                </>}
        </>
    )
}

export { AuthorBanner }