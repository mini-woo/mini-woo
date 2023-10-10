"use client"
import StoreItem, {StoreItemSkeleton} from "@/components/store-item";
import {fetchProducts, useAppContext} from "@/providers/context-provider";
import {useEffect} from "react";
import StoreCategories from "@/components/store-categories";
import InfiniteScroll from "@/components/infinite-scroll";

export default function StoreFront() {
    const {state, dispatch} = useAppContext()

    useEffect(() => {
        fetchProducts(state, dispatch)
    }, [state.selectedCategory])

    const items = state.loading && state.products.length === 0 ?
        Array(12).fill(0).map((value, index) => <StoreItemSkeleton key={`n${index}`}/>) :
        state.products.map((product) => <StoreItem key={product.id} product={product}/>)

    return (
        <section className="store-products">
            <StoreCategories/>
            {items}
            <InfiniteScroll
                callback={() => fetchProducts(state, dispatch)}
                hasMore={state.hasMore}
                loading={state.loading}
            />
        </section>
    )
}
