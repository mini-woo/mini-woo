import {OrderInfo} from "@telegraf/types";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL!!
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!!
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!!

function put(api: string, body: any, query?: URLSearchParams) {
    return call("PUT", api, query, body);
}

function post(api: string, body: any, query?: URLSearchParams) {
    return call("POST", api, query, body);
}

function get(api: string, query?: URLSearchParams) {
    return call("GET", api, query, undefined)
}

function call(method: string, api: string, query?: URLSearchParams, body?: any) {
    const headers = {
        "Content-Type": "application/json"
    };

    let url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/${api}`.replace("//", "/");
    if (!query)
        query = new URLSearchParams()
    query.set("consumer_secret", CONSUMER_SECRET);
    query.set("consumer_key", CONSUMER_KEY);
    url = url + "?" + query.toString();
    if (body)
        body = JSON.stringify(body)

    let init = {body, method, headers};

    console.log(`Proxy woo: ${url} | ${JSON.stringify(init)}`);

    return fetch(url, init);
}

async function createOrder(line_items: any[], customer_note: string) {
    const body = {
        "set_paid": false,
        line_items,
        customer_note,
    }
    const res = await post("orders", body)
    return await res.json()
}

function updateOrder(orderId: number, update: any) {
    return put(`orders/${orderId}`, update)
}

function updateOrderInfo(orderId: number, orderInfo: OrderInfo) {
    const update = {
        shipping: {
            first_name: orderInfo.name,
            last_name: orderInfo.name,
            address_1: orderInfo.shipping_address?.street_line1,
            address_2: orderInfo.shipping_address?.street_line2,
            city: orderInfo.shipping_address?.city,
            state: orderInfo.shipping_address?.state,
            postcode: orderInfo.shipping_address?.post_code,
            country: orderInfo.shipping_address?.country_code,
        },
        billing: {
            first_name: orderInfo.name,
            last_name: orderInfo.name,
            email: orderInfo.email,
            phone: orderInfo.phone_number,
            address_1: orderInfo.shipping_address?.street_line1,
            address_2: orderInfo.shipping_address?.street_line2,
            city: orderInfo.shipping_address?.city,
            state: orderInfo.shipping_address?.state,
            postcode: orderInfo.shipping_address?.post_code,
            country: orderInfo.shipping_address?.country_code,
        }
    }
    return updateOrder(orderId, update)
}

function setOrderPaid(orderId: number) {
    const update = {
        set_paid: true,
    }
    return updateOrder(orderId, update)
}


async function getShippingOptions(zoneId: number) {
    const res = await woo.get(`shipping/zones/${zoneId}/methods`)
    const methods: any[] = await res.json()
    return methods.filter((method) => method.enabled)
        .map((method) => {
            return {
                id: method.method_id,
                title: method.method_title,
                prices: [{label: "Free", amount: 0}], //TODO: set price from shipping method
            }
        });
}

const woo = {
    get, createOrder, updateOrderInfo, setOrderPaid, getShippingOptions
}

export default woo