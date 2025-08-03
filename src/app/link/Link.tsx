"use client";

import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect } from "react";

const LinkPage = () => {
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
            window.close();
        })();
    }, []);

    return <div>Please wait...</div>;
};

export default LinkPage;
