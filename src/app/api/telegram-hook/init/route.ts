import {NextRequest, NextResponse} from "next/server";
import bot, {WEBHOOK_URL} from "../bot";

export async function POST(request: NextRequest) {
    const result = await bot.telegram.setWebhook(WEBHOOK_URL)
    return NextResponse.json(result)
}

export async function GET(request: NextRequest) {
    const result = await bot.telegram.getWebhookInfo()
    return NextResponse.json(result)
}

export async function DELETE(request: NextRequest) {
    const result = await bot.telegram.deleteWebhook()
    return NextResponse.json(result)
}