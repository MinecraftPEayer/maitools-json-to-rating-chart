import { NextRequest, NextResponse } from "next/server"

const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new NextResponse(buffer);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}

export { GET }