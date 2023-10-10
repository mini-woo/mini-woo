"use client"
import {Product, useAppContext} from "@/providers/context-provider";

export default function StoreItem({product}: { product: Product }) {
    const {state, dispatch} = useAppContext()
    const id = product.id
    const cartItem = state.cart.get(id)
    const image = product.images[0] ?
        {src: product.images[0].src, alt: product.images[0].alt || ""} :
        {src: "/no-image.png", alt: "no image"}

    return (
        <div className={`store-product ${cartItem ? "selected" : ""}`}>
            <div
                onClick={() => dispatch({type: "item", product})}
            >
                <img
                    {...image}
                    width={74}
                    height={74}
                />
                <div className="store-product-label">
                    <span className="store-product-title">{product.name}</span>
                    <span className="store-product-price" dangerouslySetInnerHTML={{__html: product.price_html}}></span>
                </div>
            </div>
            <div className="store-product-counter">{cartItem?.count}</div>
            <div className="store-product-buttons">
                <button className="store-product-decr-button"
                        onClick={() => dispatch({type: "dec", product})}
                >
                </button>
                <button className="store-product-incr-button"
                        onClick={() => dispatch({type: "inc", product})}
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

