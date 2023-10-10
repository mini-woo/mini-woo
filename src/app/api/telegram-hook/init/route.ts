import {NextRequest, NextResponse} from "next/server";
import {initWebhook, SECRET_HASH} from "@/lib/bot";

export async function POST(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams

        if (query.get("secret_hash") === SECRET_HASH) {
            await initWebhook()
        } else {
            console.log("Unauthorized init call denied!")
            return NextResponse.json('error', {status: 401})
        }
        return NextResponse.json('ok', {status: 200})
    } catch (error: unknown) {
        console.error("Error init telegram bot")
        console.log(error)
        return NextResponse.json('error', {status: 500})
    }
}