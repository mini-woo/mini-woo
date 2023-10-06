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
                console.log("checkout!!!")
            })
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
    }, [state.mode, state.cart.size])

    return (
        <main className={`${state.mode}-mode`}>
            <StoreFront/>
            <ProductOverview/>
            <OrderOverview/>
        </main>
    )
}
