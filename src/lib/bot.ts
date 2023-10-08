import {Markup, Telegraf} from "telegraf";

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
    // ctx.setChatMenuButton({
    //     text: "Store",
    //     type: "web_app",
    //     web_app: {url: BASE_PATH},
    // })
});

bot.on("shipping_query", ctx =>
    console.log(ctx)//TODO fetch order by id from 
	//ctx.answerShippingQuery(true, shippingOptions, undefined),
); //https://core.telegram.org/bots/api#shippingquery
bot.on("pre_checkout_query", ctx => console.log(ctx));//ctx.answerPreCheckoutQuery(true)); //https://core.telegram.org/bots/api#precheckoutquery
bot.on("successful_payment", ctx => console.log(ctx));//https://core.telegram.org/bots/api#successfulpayment

export default bot
