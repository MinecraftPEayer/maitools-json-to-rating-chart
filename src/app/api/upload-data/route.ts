import { NextRequest } from "next/server";
import axios from "axios";

const POST = async (req: NextRequest) => {
    let data = await req.json();
    if (
        !data ||
        !data.userData ||
        !data.userData.id ||
        !data.userData.token ||
        !data.data
    ) {
        return new Response(JSON.stringify({ error: "Invalid request data" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        let response = await axios.post(
            `${process.env.BOT_API_URL}/api/user/data-upload`,
            data,
            { headers: { Authorization: `Bearer ${process.env.BOT_API_KEY}` } },
        );
        return new Response(
            JSON.stringify({ success: true, data: response.data }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.log("Error uploading data:", error);
        return new Response(
            JSON.stringify({ error: "Failed to upload data" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};

export { POST };
