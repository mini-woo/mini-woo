import {NextRequest, NextResponse} from "next/server";
import { createInvoiceLink } from "@/lib/bot";
import woo from "@/lib/woo";

export async function POST(request: NextRequest) {

    const body = await request.json();

    const line_items = Array.from(body.items).map((item: any) => {
        return {
            product_id: item.id,
            quantity: item.count
        }
    });

    const order = await woo.createOrder(line_items, body.comment)

    const prices = order.line_items.map((item: any) => {
        return {
            label: `${item.name} (x${item.quantity})`,
            amount: parseInt(item.total)
        }
    });

    const invoiceLink = await createInvoiceLink(order.id, order.order_key, order.currency, prices, body.shippingZone);

    return NextResponse.json({"invoice_link": invoiceLink});
}
