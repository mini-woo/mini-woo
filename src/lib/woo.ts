const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL!!
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!!
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!!

function get(api: string, query?: URLSearchParams) {
    return call("GET", api, query)
}

function post(api: string, body: any, query?: URLSearchParams) {
    return call("GET", api, query, body)
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
    return fetch(url, init)
}

const woo = {
    get, post
}

export default woo