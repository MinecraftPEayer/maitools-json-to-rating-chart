import { NextRequest, NextResponse } from "next/server";
import MaimaiDXNETDataFetcher from "@/lib/MaimaiDXNETDataFetcher";

export async function GET(request: NextRequest) {
    try {
        const fetcher = MaimaiDXNETDataFetcher.getInstance();
        const { searchParams } = new URL(request.url);
        const friendCode = searchParams.get("friendCode");

        if (!friendCode) {
            return NextResponse.json(
                { error: "No friend code provided" },
                { status: 400 },
            );
        }

        if (!fetcher.isLoggedIn()) {
            await fetcher.login();
        }

        const userInfo = await fetcher.getUserInfo(friendCode);

        return NextResponse.json(userInfo);
    } catch (error) {}
}
