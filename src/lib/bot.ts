import {Markup, Telegraf} from "telegraf";
import {message} from "telegraf/filters"
import {LabeledPrice} from "@telegraf/types";
import woo from "@/lib/woo";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!!
export const SECRET_HASH = process.env.TELEGRAM_BOT_SECRET!!
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || `https://${process.env.NEXT_PUBLIC_VERCEL_URL!!}`
export const WEBHOOK_URL = `${BASE_PATH}/api/telegram-hook?secret_hash=${SECRET_HASH}`

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
    ctx.reply(
        "Let's get started ;)",
        Markup.inlineKeyboard([Markup.button.webApp("View Store", BASE_PATH)]),
    )
});
bot.help((ctx) => ctx.reply("Test /start or /menu command!"))
bot.command('menu', (ctx) =>
    ctx.setChatMenuButton({
        text: "Store",
        type: "web_app",
        web_app: {url: BASE_PATH},
    }))
bot.on(message("text"), (ctx) => ctx.reply("Hi, I`m Mini Woo. It`s nice to meet you!:) /help"));

bot.on("shipping_query", async (ctx) => {
    const payload = JSON.parse(ctx.update.shipping_query.invoice_payload)
    const shippingOptions = (await woo.getShippingMethods(payload.shippingZone))
        .filter((method) => method.enabled)
        .map((method) => {
            return {
                id: method.method_id,
                title: method.method_title,
                prices: [{label: "Free", amount: 0}], //TODO: set price from shipping method
            }
        })
    console.log("shippingOptions", shippingOptions)
    if (shippingOptions.length)
        ctx.answerShippingQuery(true, shippingOptions, undefined)
    else
        ctx.answerShippingQuery(false, undefined, "No shipping option available at your zone!")
});

bot.on("pre_checkout_query", async (ctx) => {
    const payload = JSON.parse(ctx.update.pre_checkout_query.invoice_payload)
    const order_info = ctx.update.pre_checkout_query.order_info!!
    const update = {
        shipping: {
            first_name: order_info.name,
            last_name: order_info.name,
            address_1: order_info.shipping_address?.street_line1,
            address_2: order_info.shipping_address?.street_line2,
            city: order_info.shipping_address?.city,
            state: order_info.shipping_address?.state,
            postcode: order_info.shipping_address?.post_code,
            country: order_info.shipping_address?.country_code,
        },
        billing: {
            first_name: order_info.name,
            last_name: order_info.name,
            email: order_info.email,
            phone: order_info.phone_number,
            address_1: order_info.shipping_address?.street_line1,
            address_2: order_info.shipping_address?.street_line2,
            city: order_info.shipping_address?.city,
            state: order_info.shipping_address?.state,
            postcode: order_info.shipping_address?.post_code,
            country: order_info.shipping_address?.country_code,
        }
    }
    await woo.updateOrder(payload.orderId, update)
    await ctx.answerPreCheckoutQuery(true);
});

bot.on(message("successful_payment"), async (ctx) => {
    const payload = JSON.parse(ctx.update.message.successful_payment.invoice_payload)
    const update = {
        set_paid: true,
    }
    await woo.updateOrder(payload.orderId, update)
});


export async function createInvoiceLink(
    orderId: number,
    orderKey: string,
    currency: string,
    prices: LabeledPrice[],
    shippingZone: number
) {
    const telegramInvoice = {
        provider_token: process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN!!,
        title: `Order Invoice ${orderId}`,
        description: `Payment invoice for ${orderKey}`,
        currency,//TODO: add to README https://core.telegram.org/bots/payments#supported-currencies
        photo_url: undefined, //TODO: env
        is_flexible: false, //TODO: env
        prices,
        payload: JSON.stringify({orderId, shippingZone}),
        need_name: true,
        need_email: true,
        need_phone_number: true,
        need_shipping_address: true
    };

    //https://core.telegram.org/bots/api#createinvoicelink
    return await bot.telegram.createInvoiceLink(telegramInvoice);
}

export default bot
