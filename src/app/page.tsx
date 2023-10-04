"use client"
import './store-front.css'
import {useTelegram} from "@/providers/TelegramProvider";
import {useContext} from "@/providers/ContextProvider";
import StoreItem from "@/components/store-item";
import {useEffect} from "react";

export default function Home() {
    const {webApp, user} = useTelegram()
    const {state, dispatch} = useContext()

    useEffect(() => {
        if (state.cart.size == 0) {
            webApp?.MainButton.setText("VIEW ORDER")
            webApp?.MainButton.onClick(() => {})
            webApp?.MainButton.show()
            webApp?.enableClosingConfirmation()
        }
        else {
            webApp?.MainButton.hide()
            webApp?.disableClosingConfirmation()
        }
    },[state.cart])
    return (
        <main className="store-products">
            <StoreItem id={1}/>
            <StoreItem id={2}/>
            <StoreItem id={22}/>
            <StoreItem id={33}/>
            <StoreItem id={432}/>
            <StoreItem id={444}/>
            <StoreItem id={10}/>
            <StoreItem id={20}/>
            <StoreItem id={220}/>
            <StoreItem id={330}/>
            <StoreItem id={4320}/>
            <StoreItem id={4440}/>
        </main>
    )
}
