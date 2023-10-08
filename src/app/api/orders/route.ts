import {NextRequest, NextResponse} from "next/server";
import woo from "@/lib/woo";
import bot from "@/lib/bot";

export async function POST(request: NextRequest) {

    const body = await request.json();

    //request.body telegram_chat_id (or user_id)

    //TODO: register order
    const wooOrderId = "123456789";
    //TODO: create lib/invoice 
    //https://core.telegram.org/bots/api#createinvoicelink
    const invoice = {
        provider_token: "Stripe TEST MODE",//process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN,
        start_parameter: "time-machine-sku",
        title: "Working Time Machine",
        description:
            "Want to visit your great-great-great-grandparents? Make a fortune at the races? Shake hands with Hammurabi and take a stroll in the Hanging Gardens? Order our Working Time Machine today!",
        currency: "usd", //process.env.TELEGRAM_PAYMENT_CURRENCY, //https://core.telegram.org/bots/payments#supported-currencies
        photo_url:
            "https://img.clipartfest.com/5a7f4b14461d1ab2caaa656bcee42aeb_future-me-fredo-and-pidjin-the-webcomic-time-travel-cartoon_390-240.png",
        is_flexible: true,
        prices: [
            { label: "Working Time Machine", amount: 4200 },
            { label: "Gift wrapping", amount: 1000 },
        ], //TODO: create prices from body.products
        payload: JSON.stringify({
            woo_order_id: wooOrderId,
        }),
        need_name: true,
        need_phone_number: true,
        //need_shipping_address: true
    };

    const invoiceLink = bot.createInvoiceLink(invoice);

    return NextResponse.json({"invoice_link": invoiceLink, "order_id": wooOrderId});
}