import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

function generateRandomString(length: number): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
}

const GET = async (request: NextRequest) => {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return NextResponse.json(
            { error: "Missing code parameter" },
            { status: 400 },
        );
    }

    try {
        let resp = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
                client_secret: process.env.CLIENT_SECRET!,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        let accessToken = resp.data.access_token;
        let userDataResponse = await axios.get(
            "https://discord.com/api/users/@me",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );
        let userData = userDataResponse.data;

        let userToken = generateRandomString(32);
        let checkAvailable = false;
        while (!checkAvailable) {
            userToken = generateRandomString(32);
            console.log(`Checking availability for token: ${userToken}`);
            checkAvailable = (
                await axios.get(
                    `${process.env.BOT_API_URL}/api/user/check?token=${userToken}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.BOT_API_KEY}`,
                        },
                    },
                )
            ).data.available;
        }

        await axios.post(
            `${process.env.BOT_API_URL}/api/user/authenticate`,
            {
                id: userData.id,
                token: userToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.BOT_API_KEY}`,
                },
            },
        );

        return NextResponse.json({
            id: userData.id,
            username: userData.username,
            avatar: userData.avatar,
            token: userToken,
        });
    } catch (e: any) {
        console.error(e.response.data);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 401 },
        );
    }
};

export { GET };
