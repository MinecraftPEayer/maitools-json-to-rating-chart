"use client";

import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";

const LinkPage = () => {
    const [displayText, setDisplayText] = useState('Please wait...');

    let code = useSearchParams().get("code");
    if (!code) {
        const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=identify`;

        window.location.href = AUTH_URL;
        return;
    }
    useEffect(() => {
        (async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_URL}/api/auth/link?code=${code}`,
            );

            console.log(response.data);

            window.opener.postMessage(
                `userData__${JSON.stringify(response.data)}`,
                "*",
            );

            setDisplayText('Login completed, you can close this tab now.');
            window.close();
        })();
    }, []);

    return <div>{displayText}</div>;
};

export default LinkPage;
