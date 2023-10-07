const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL!!
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!!
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!!

function get(api: string, query: any) {
    return call("GET", api, query, undefined)
}
function call(method: string, api: string, query: any, body: any) {
    const  headers = {
        "Content-Type": "application/json"
    };

    let url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/${api}`.replace("//","/");
    query.set("consumer_secret", CONSUMER_SECRET);
    query.set("consumer_key", CONSUMER_KEY);
    url = url + "?" + query.toString();

    let init = {body, method, headers};
    return fetch(url, init)
}

const woo = {
    get
}

export default woo