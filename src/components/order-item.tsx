"use client"
import {useAppContext} from "@/providers/context-provider";
import Image from "next/image";

export default function OrderItem({id}: { id: number }) {
    const {state, dispatch} = useAppContext()

    return (
        <div className="order-item">
            <div className="order-item-photo">
                <Image
                    style={{filter: "invert(0.5)"}}
                    src="/next.svg"
                    alt="test"
                    width={40}
                    height={40}
                />
            </div>
            <div className="order-item-label">
                <div className="order-item-title">Burger
                    <span className="order-item-counter">
                        {state.cart.get(id)?.count}x
                    </span>
                </div>
                <div className="order-item-description">Meat™</div>
            </div>
            <div className="order-item-price">$4.99</div>
        </div>
    )
}
