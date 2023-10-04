"use client"
import {useContext} from "@/providers/ContextProvider";
import Image from "next/image";

export default function StoreItem({id}: { id: number }) {
    const {state, dispatch} = useContext()
    return (
        <div className={`store-product ${state.cart.get(id) ? "selected" : ""}`}>
            <div className="store-product-counter">{state.cart.get(id)?.count}</div>
            <Image
                style={{filter: "invert(0.5)"}}
                src="/next.svg"
                alt="test"
                width={74}
                height={74}
            />
            <div className="store-product-label">
                <span className="store-product-title">Burger</span>
                <span className="store-product-price">$4.99</span>
            </div>
            <div className="store-product-buttons">
                <button className="store-product-decr-button"
                        onClick={() => dispatch({type: "dec", id})}
                >
                </button>
                <button className="store-product-incr-button"
                        onClick={() => dispatch({type: "inc", id})}
                >
                    <span className="button-item-label">Add</span>
                </button>
            </div>
        </div>
    )
}
