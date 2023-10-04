"use client"
import {useEffect} from "react";
import {useTelegram} from "@/providers/TelegramProvider";
import {useContext} from "@/providers/ContextProvider";
import StoreFront from "@/components/store-front";
import OrderOverview from "@/components/order-overview";

export default function Home() {
    const {webApp, user} = useTelegram()
    const {state, dispatch} = useContext()

    useEffect(() => {
        if (state.mode === "order") {
            webApp?.MainButton.setParams({
                text: "CHECKOUT",
            })
            webApp?.BackButton.show()
            webApp?.BackButton.onClick(() => {
                dispatch({type: "mode", mode: "storefront"})
            })
        } else if (state.cart.size !== 0) {
            webApp?.MainButton.setParams({
                text: "VIEW ORDER",
                text_color: '#fff',
                is_visible: true,
                color: '#31b545'
            }).onClick(() => {
                dispatch({type: "mode", mode: "order"})
            })
            webApp?.BackButton.hide()
            webApp?.enableClosingConfirmation()
        } else {
            webApp?.MainButton.hide()
            webApp?.disableClosingConfirmation()
        }
    }, [state.mode, state.cart.size])

    return (
        <main className={`${state.mode}-mode`}>
            <StoreFront/>
            <OrderOverview/>
        </main>
    )
}
