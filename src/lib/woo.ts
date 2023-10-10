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

async function getShippingMethods(zoneId: number) {
    const res = await woo.get(`shipping/zones/${zoneId}/methods`)
    const methods: any[] = await res.json()
    return methods;
}

const woo = {
    get, post, createOrder, updateOrder, getShippingMethods
}

export default woo