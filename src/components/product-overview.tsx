"use client"
import {useAppContext} from "@/providers/context-provider";

export default function ProductOverview() {
    const {state, dispatch} = useAppContext()
    if (!state.selectedProduct)
        return null
    const product = state.selectedProduct
    const id = product.id
    const cartItem = state.cart.get(id)
    const image = product.images[0] ?
        {src:  product.images[0].src, alt : product.images[0].alt || "" } :
        {src: "/next.svg" , alt: "no image"}

    return (
        <div className={`product-overview ${cartItem ? "selected" : ""}`}>
            <div className="product-counter">{cartItem?.count || 0}</div>
            <div className="product-photos">
                <img
                    className="product-photo"
                    {...image}
                />
                <img
                    className="product-photo"
                    {...image}
                />
            </div>
            <div className="product-label">
                <span className="product-title">{product.name}</span>
                <span className="product-price" dangerouslySetInnerHTML={{ __html: product.price_html }}></span>
            </div>
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
            <div className='product-description' dangerouslySetInnerHTML={{ __html: product.description }}></div>
        </div>
    )
}
