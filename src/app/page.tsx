"use client"
import {useEffect} from "react";
import {useTelegram} from "@/providers/telegram-provider";
import {useAppContext} from "@/providers/context-provider";
import StoreFront from "@/components/store-front";
import OrderOverview from "@/components/order-overview";
import ProductOverview from "@/components/product-overview";

export default function Home() {
    const {webApp, user} = useTelegram()
    const {state, dispatch} = useAppContext()

    useEffect(() => {
        webApp?.BackButton.onClick(() => {
            dispatch({type: "storefront"})
        })
        if (state.mode === "storefront")
            webApp?.BackButton.hide()
        else
            webApp?.BackButton.show()

        if (state.mode === "order") {
            webApp?.MainButton.setParams({
                text: "CHECKOUT",
            }).onClick(() => {
                const invoiceSupported = webApp?.isVersionAtLeast('6.1');
                if (invoiceSupported) {
                    console.log("invoice supported");

                    const items = Array.from(state.cart.values()).map((item) => {
                        return {
                            id: item.product.id,
                            product_name: item.product.name,
                            unit_price: item.product.price,
                            count: item.count
                        }
                    })
                    const body = JSON.stringify({
                        userId: user?.id,
                        chatId: webApp?.initDataUnsafe.chat?.id,
                        comment: state.comment,
                        shippingZone: state.shippingZone,
                        items
                    })

                    fetch("api/orders", {method: "POST", body}).then((res) =>
                        res.json().then((result) => {
                            webApp?.openInvoice(result.invoice_link, function(status) {
                                if (status == 'paid') {
                                    console.log("[paid] InvoiceStatus " + result);
                                    webApp?.close();
                                } else if (status == 'failed') {
                                    console.log("[failed] InvoiceStatus " + result);
                                    webApp?.HapticFeedback.notificationOccurred('error');
                                } else {
                                    console.log("[unknown] InvoiceStatus" + result);
                                    webApp?.HapticFeedback.notificationOccurred('warning');
                                }
                            });
                        })
                    );
                } else {
                    console.log("invoice not supported")
                }
            });

        } else if (state.cart.size !== 0) {
            webApp?.MainButton.setParams({
                text: "VIEW ORDER",
                text_color: '#fff',
                is_visible: true,
                color: '#31b545'
            }).onClick(() => {
                dispatch({type: "order"})
            })
            webApp?.enableClosingConfirmation()
        } else {
            webApp?.MainButton.hide()
            webApp?.disableClosingConfirmation()
        }
    }, [state.mode, state.cart.size, state.cart, state.comment])

    return (
        <main className={`${state.mode}-mode`}>
            <StoreFront/>
            <ProductOverview/>
            <OrderOverview/>
        </main>
    )
}
