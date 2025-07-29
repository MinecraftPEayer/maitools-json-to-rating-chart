"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

const LinkPage = () => {
    let [userData, setUserData] = useState({
        id: "",
        username: "",
        avatar: "",
    });
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
            setUserData(response.data);

            window.opener.postMessage(
                `userData__${JSON.stringify(response.data)}`,
                "*",
            );
            window.close();
        })();
    }, []);

    return (
        <div>
            <p>ID: {userData.id}</p>
            <p>Username: {userData.username}</p>
            <Image
                src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`}
                alt="avatar"
                width={128}
                height={128}
            />
        </div>
    );
};

export default LinkPage;
