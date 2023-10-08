import {Markup, Telegraf} from "telegraf";
import {message} from "telegraf/filters"
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

bot.on(message("text"), (ctx) => ctx.reply("Hi, I`m Mini Woo. It`s nice to meet you!:) /help"));
bot.help((ctx) => ctx.reply("Test /start or /add_menu command!"))
bot.command('add_menu', (ctx) =>
    ctx.setChatMenuButton({
        text: "Store",
        type: "web_app",
        web_app: {url: BASE_PATH},
    }))


//TODO: move to lib/invoice
bot.on("shipping_query", async (ctx) => {
    const payload = ctx.update.shipping_query.invoice_payload
    console.log("payload", payload)
    const zone = JSON.parse(payload).shippingZone
    const res = await woo.get(`shipping/zones/${zone}/methods`)
    const methods: any[] = await res.json()
    const shippingOptions = methods.filter((method) => method.enabled).map((method) => {
        return {
            id: method.method_id,
            title: method.method_title,
            prices: [{label: "Free", amount: 0}], //TODO: set price from shipping method
        }
    })
    if (shippingOptions.length)
        ctx.answerShippingQuery(true, shippingOptions, undefined)
    else
        ctx.answerShippingQuery(false, undefined, "No shipping option available at your zone!")
});//https://core.telegram.org/bots/api#shippingquery

bot.on("pre_checkout_query", ctx => {
    console.log(ctx)
    //check if woo order exists and paid false, get order_id from invoice_payload.woo_order_id
    ctx.answerPreCheckoutQuery(true)
});//https://core.telegram.org/bots/api#precheckoutquery

bot.on(message("successful_payment"), ctx => {
    console.log(ctx)
    const payload = JSON.parse(ctx.update.message.successful_payment.invoice_payload)
    const line_items = payload.items.map((item: any) => {
        return {
            "product_id": item.id,
            "quantity": item.count,
        }
    })
    woo.post("orders", {
        line_items
    }).then(() => console.log("successful order!"))
    ctx.reply("Your order successfully registered!")
    //update woo order set paid true, get order_id from invoice_payload.woo_order_id
});//https://core.telegram.org/bots/api#successfulpayment

export default bot
