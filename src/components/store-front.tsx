"use client"
import StoreItem, {StoreItemSkeleton} from "@/components/store-item";
import {fetchProducts, useContext} from "@/providers/context-provider";
import {useEffect} from "react";

export default function StoreFront() {
    const {state, dispatch} = useContext()

    useEffect(() => {
        fetchProducts(dispatch)
    }, [])
    
    const items = state.products.length === 0 ?
        Array(12).fill(<StoreItemSkeleton/>) :
        state.products.map((product) => <StoreItem key={product.id} product={product}/>)

    return (
        <section className="store-products">
            {items}
        </section>
    )
}
