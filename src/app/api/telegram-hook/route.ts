import {NextRequest, NextResponse} from "next/server";
import bot, {SECRET_HASH} from "@/lib/bot";

export async function POST(request: NextRequest) {
    try {
        // Retrieve the POST request body that gets sent from Telegram
        const body = await request.json()
        const query = request.nextUrl.searchParams
        console.log("Telegram Req:", body)

        if (query.get("secret_hash") === SECRET_HASH) {
            await bot.handleUpdate(body)
        } else {
            console.log("Unauthorized call denied!")
            return NextResponse.json('error', {status: 401})
        }
        return NextResponse.json('ok', {status: 200})
    } catch (error: unknown) {
        console.error("Error handling bot update")
        console.log(error)
        return NextResponse.json('error', {status: 500})
    }
}