"use client"
import {useCallback, useEffect} from "react";
import {useTelegram} from "@/providers/telegram-provider";
import {useAppContext} from "@/providers/context-provider";
import StoreFront from "@/components/store-front";
import OrderOverview from "@/components/order-overview";
import ProductOverview from "@/components/product-overview";

export default function Home() {
    const {webApp, user} = useTelegram()
    const {state, dispatch} = useAppContext()

    const mainButtonCallback = useCallback(async () => {
        if (state.mode === "order") {
            console.log("checkout!")
            webApp?.MainButton.showProgress()
            const invoiceSupported = webApp?.isVersionAtLeast('6.1');
            const items = Array.from(state.cart.values()).map((item) => ({
                id: item.product.id,
                count: item.count
            }))
            const body = JSON.stringify({
                userId: user?.id,
                chatId: webApp?.initDataUnsafe.chat?.id,
                invoiceSupported,
                comment: state.comment,
                shippingZone: state.shippingZone,
                items
            })
            const res = await fetch("api/orders", {method: "POST", body})
            const result = await res.json()

            if (invoiceSupported) {
                webApp?.openInvoice(result.invoice_link, function (status) {
                    webApp?.MainButton.hideProgress()
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
            } else {
                webApp?.showAlert("Some feature not available please update your telegram app!")
            }
        } else dispatch({type: "order"})
    }, [webApp, state.mode, state.cart, state.comment, state.shippingZone])

    useEffect(() => {
        webApp?.MainButton.setParams({
            text_color: '#fff',
            color: '#31b545'
        }).onClick(mainButtonCallback)
        webApp?.BackButton.onClick(() => dispatch({type: "storefront"}))
    }, [webApp, mainButtonCallback])

    useEffect(() => {
        if (state.mode === "storefront")
            webApp?.BackButton.hide()
        else
            webApp?.BackButton.show()

        if (state.mode === "order")
            webApp?.MainButton.setText("CHECKOUT")
        else
            webApp?.MainButton.setText("VIEW ORDER")
    }, [state.mode])

    useEffect(() => {
        if (state.cart.size !== 0) {
            webApp?.MainButton.show()
            webApp?.enableClosingConfirmation()
        } else {
            webApp?.MainButton.hide()
            webApp?.disableClosingConfirmation()
        }
    }, [state.cart.size])

    return (
        <main className={`${state.mode}-mode`}>
            <StoreFront/>
            <ProductOverview/>
            <OrderOverview/>
        </main>
    )
}
