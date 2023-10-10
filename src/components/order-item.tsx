"use client"
import {useAppContext} from "@/providers/context-provider";

export default function OrderItem({id}: { id: number }) {
    const {state, dispatch} = useAppContext()

    const cartItem = state.cart.get(id)!!
    const product = cartItem.product
    const image = product.images[0] ?
        {src: product.images[0].src, alt: product.images[0].alt || ""} :
        {src: "/no-image.png", alt: "no image", style: {filter: "invert(0.5)"}}

    return (
        <div className="order-item"
             onClick={() => dispatch({type: "item", product})}
        >
            <div className="order-item-photo">
                <img
                    {...image}
                    width={40}
                    height={40}
                />
            </div>
            <div className="order-item-label">
                <div className="order-item-title">
                    <div>
                        {product.name}
                    </div>
                    <span className="order-item-counter">
                        {cartItem.count}x
                    </span>
                </div>
                {/*<div className="order-item-description" dangerouslySetInnerHTML={{__html: product.short_description}}></div>*/}
            </div>
            <div className="order-item-price" dangerouslySetInnerHTML={{__html: product.price_html}}></div>
        </div>
    )
}
