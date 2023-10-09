import {NextRequest, NextResponse} from "next/server";
import invoice from "@/lib/invoice";

export async function POST(request: NextRequest) {

    const body = await request.json();

    console.log("register invoice req:", body);

    let invoiceLink = undefined;
    try {
        invoiceLink = await invoice.createInvoiceLink(body);
    } catch (reason) {
        console.log(`order register error ${reason}`);
    }

    return NextResponse.json({"invoice_link": invoiceLink});
}
