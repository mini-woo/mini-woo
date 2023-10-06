"use client"
import StoreItem, {StoreItemSkeleton} from "@/components/store-item";
import {fetchMoreProducts, fetchProducts, useAppContext} from "@/providers/context-provider";
import {useEffect, useRef} from "react";
import StoreCategories from "@/components/store-categories";

export default function StoreFront() {
    const {state, dispatch} = useAppContext()
    const observerTarget = useRef(null)

    useEffect(() => {
        fetchProducts(state, dispatch)
    }, [state.selectedCategoryId])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchMoreProducts(state, dispatch);
                    observer.unobserve(entries[0].target)
                }
            },
            {threshold: 0.1}
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, state])

    const items = state.loading && state.products.length === 0 ?
        Array(12).fill(<StoreItemSkeleton/>) :
        state.products.length === 0 ?
            [<div>Empty :(</div>] :
            state.products.map((product) => <StoreItem key={product.id} product={product}/>)

    return (
        <section className="store-products">
            <StoreCategories/>
            {items}
            {state.loading ?
                <div style={{width: "100%", textAlign: "center"}}>Loading...</div> :
                state.products.length !== state.page * 12 ?
                    <div style={{width: "100%", textAlign: "center"}}>End :)</div> :
                    <div style={{width: "100%", textAlign: "center"}} ref={observerTarget}>Continue...</div>
            }
        </section>
    )
}
