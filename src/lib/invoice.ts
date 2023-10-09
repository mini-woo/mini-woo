import bot from "@/lib/bot";
import woo from "@/lib/woo";

//TODO: use this after fix bug when use invoice.createLink in api/orders route.js

/* @Doc
process.env.SHOPPING_OPTIONS example: 
[
	{
		"id": "unicorn",
		"title": "Unicorn express",
		"prices": [{ "label": "Unicorn", "amount": 2000 }]
	},
	{
		"id": "slowpoke",
		"title": "Slowpoke mail",
		"prices": [{ label: "Slowpoke", "amount": 100 }]
	},
]
as scaped string -> "[\r\n\t{\r\n\t\tid: \"unicorn\",\r\n\t\ttitle: \"Unicorn express\",\r\n\t\tprices: [{ label: \"Unicorn\", amount: 2000 }],\r\n\t},\r\n\t{\r\n\t\tid: \"slowpoke\",\r\n\t\ttitle: \"Slowpoke mail\",\r\n\t\tprices: [{ label: \"Slowpoke\", amount: 100 }],\r\n\t},\r\n]"
*/
const DEFAULT_SHOPPING_OPTIONS = process.env.SHOPPING_OPTIONS || 
`
[
	{
		"id": "free-express",
		"title": "Express (Free Delivery!)",
		"prices": [
            { 
                "label": "Express", 
                "amount": 0
            }
        ]
	}
]
`;
const shippingOptions = JSON.parse(DEFAULT_SHOPPING_OPTIONS);

//TODO: FIXME and set is_flexible = True
bot.on("shipping_query", ctx => {
    //https://core.telegram.org/bots/api#shippingquery
    console.log(`handle shipping_query`);
	ctx.answerShippingQuery(true, shippingOptions, undefined);
});

bot.on("pre_checkout_query", ctx => {
    //https://core.telegram.org/bots/api#precheckoutquery
    console.log(`handle pre_checkout_query`);
    ctx.answerPreCheckoutQuery(true);
});

async function getPreCheckOrderAnswer(orderId: string) {
    try {
        const res = await woo.get(`orders/${orderId}`);
        if (res.status != 200) {
            const strbody = await res.text();
            console.log(`[Error] handle pre_checkout_query_answer, ${res.status} | ${strbody}`);
        } else {
            // const strbody = await res.text();
            console.log(`[RESPONSE] handle pre_checkout_query_answer, ${res.status}`);
            return true;
            // const order = JSON.parse(strbody || '{"date_paid": true}');        
            // if (!order.date_paid) { //check if order is not paid before
            //     return true;
            // }
        }
    } catch (reason) {
        console.log(`[Error] register order in woo, ${reason}`);
    }

    return false;
}

bot.on("successful_payment", ctx => {
    //https://core.telegram.org/bots/api#successfulpayment
    console.log(`handle successful_payment`);
    console.log(`payload successful_payment ${JSON.stringify(ctx.message.successful_payment)}`);

    const successful_payment = ctx.message.successful_payment;
    const order_info = successful_payment.order_info || {};
    const line_items = JSON.parse(successful_payment.invoice_payload);
    console.log(`line_items successful_payment ${JSON.stringify(line_items)}`);

    const order = {
        set_paid: true,
        line_items: line_items,
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

    try {
        woo.post(`orders`, order)
        .then(res => res.json()).then(json => {
            console.log(`[Ok] handle successful_payment ${json}`);
        }).catch(reason => console.log(`[Error] handle successful_payment ${reason}`));
    } catch (reason) {
        console.log(`[Error] successful_payment ${reason}`);
    }

});

async function createInvoiceLink(body: any) {
    const prices = Array.from(body.items).map((item: any) => {
        return {
            label: `${item.product_name} (x${item.count})`,
            amount: parseInt(item.unit_price) * item.count, //TODO: FIXME: get product price from woo or directly get order total price and use
        }
    });

    const line_items = Array.from(body.items).map((item: any) => {
        return {
            product_id: item.id,
            quantity: item.count
        }
    });

    const telegramInvoice = {
        provider_token: process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN || '1877036958:TEST:a06a637816e2c91246ad38b1eac33815ebd1c408', //TODO: add how to generate in README
        title: `Order Invoice`, //TODO: env
        description: `payment invoice for order placed with telegram (mini-woo)`, //TODO: env
        currency: process.env.TELEGRAM_PAYMENT_CURRENCY || "usd", //TODO: add to README https://core.telegram.org/bots/payments#supported-currencies
        photo_url: undefined, //TODO: env
        is_flexible: false, //TODO: env
        prices: prices,
        payload: JSON.stringify(line_items),
        need_name: true,
        need_phone_number: true,
        need_shipping_address: true
    };

    //https://core.telegram.org/bots/api#createinvoicelink
    return await bot.telegram.createInvoiceLink(telegramInvoice);
}

const invoice = {
    createInvoiceLink,
}

export default invoice;