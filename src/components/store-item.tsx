"use client"
import {Product, useContext} from "@/providers/context-provider";

export default function StoreItem({product}: { product: Product }) {
    const {state, dispatch} = useContext()
    const id = product.id
    const cartItem = state.cart.get(id)

    return (
        <div className={`store-product ${cartItem ? "selected" : ""}`}>
            <div className="store-product-counter">{cartItem?.count}</div>
            <img
                src={product.images[0]?.src || "/next.svg"}
                alt={product.images[0]?.alt || "no image"}
                width={74}
                height={74}
            />
            <div className="store-product-label">
                <span className="store-product-title">{product.name}</span>
                <span className="store-product-price" dangerouslySetInnerHTML={{ __html: product.price_html }}></span>
                {/*<span className="store-product-price">${product.price}</span>*/}
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

export function StoreItemSkeleton() {
    return (
        <div className="store-product">
            <div className="store-product-skeleton"></div>
        </div>
    )
}

