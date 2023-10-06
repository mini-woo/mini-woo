import {NextRequest, NextResponse} from "next/server";
import woo from "@/lib/woo";

export async function GET(request: NextRequest) {
    const res = await woo.get('products/categories', request.nextUrl.searchParams)
    return NextResponse.json(await res.json())
}