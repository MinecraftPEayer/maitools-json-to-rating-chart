import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

        return NextResponse.json({
            id: userData.id,
            username: userData.username,
            avatar: userData.avatar,
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
