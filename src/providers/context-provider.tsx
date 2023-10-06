'use client';

import * as React from 'react'

type Action =
    | { type: "mode", mode: Mode }
    | { type: "loading" }
    | { type: "products", products: Product[] }
    | { type: "page", products: Product[] }
    | { type: "categories", categories: Category[] }
    | { type: "select-cat", id: number }
    | { type: "inc", id: number }
    | { type: "dec", id: number }

type Dispatch = (action: Action) => void

type Mode = 'storefront' | 'order'

export type CartItem = {
    id: number,
    count: number,
}

export type Product = {
    id: number,
    name: string,
    description: string,
    price: string,
    regular_price: string,
    sale_price: string,
    price_html: string,
    images: any[],
}

export type Category = {
    id: number,
    name: string,
}

type State = {
    mode: Mode
    loading: boolean
    products: Product[]
    page: number
    categories: Category[]
    selectedCategoryId?: number
    cart: Map<number, CartItem>
}

const StateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

function contextReducer(state: State, action: Action) {
    console.log("dispatch", {action, state})
    switch (action.type) {
        case 'mode': {
            state.mode = action.mode
            break
        }
        case 'loading' : {
            state.loading = true
            break
        }
        case 'products': {
            state.products = action.products
            state.page = 1
            state.loading = false
            break
        }
        case 'page': {
            state.products.push(...action.products)
            state.page = (state.page + 1)
            state.loading = false
            break
        }
        case 'categories': {
            state.categories = action.categories
            break
        }
        case 'select-cat': {
            state.selectedCategoryId = action.id
            break
        }
        case 'inc': {
            const count = state.cart.get(action.id)?.count || 0
            state.cart.set(action.id, {id: action.id, count: count + 1})
            break
        }
        case 'dec': {
            const count = state.cart.get(action.id)?.count || 0
            if (count <= 1)
                state.cart.delete(action.id)
            else
                state.cart.set(action.id, {id: action.id, count: count - 1})
            break
        }
        default: {
            throw new Error(`Unhandled action: ${action}`)
        }
    }
    console.log(state)
    return {
        ...state
    }
}

function ContextProvider({
                             children,
                         }: {
    children: React.ReactNode
}) {
    const init: State = {
        mode: "storefront",
        loading: true,
        products: [],
        page: 1,
        categories: [],
        cart: new Map<number, CartItem>(),
    }
    const [state, dispatch] = React.useReducer(contextReducer, init)
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const context = {state, dispatch}
    return (
        <StateContext.Provider value={context}>
            {children}
        </StateContext.Provider>
    )
}

function useAppContext() {
    const context = React.useContext(StateContext)
    if (context === undefined) {
        throw new Error('useContext must be used within a ContextProvider')
    }
    return context
}

function fetchProducts(state: State, dispatch: Dispatch) {
    dispatch({type: "loading"})
    let url = "api/products?per_page=12"
    if (state.selectedCategoryId)
        url = url + "&category=" + state.selectedCategoryId
    fetch(url, {method: "GET"}).then((res) =>
        res.json().then((products) => dispatch({type: "products", products}))
    )
}

function fetchMoreProducts(state: State, dispatch: Dispatch) {
    console.log("XXX:" + state.page)
    if (state.products.length !== state.page * 12 || state.loading)
        return
    dispatch({type: "loading"})
    let url = "api/products?per_page=12&page=" + (state.page + 1)
    if (state.selectedCategoryId)
        url = url + "&category=" + state.selectedCategoryId
    fetch(url, {method: "GET"}).then((res) =>
        res.json().then((products) => dispatch({type: "page", products}))
    )
}

function fetchCategories(dispatch: Dispatch) {
    fetch("api/categories", {method: "GET"}).then((res) =>
        res.json().then((categories) => dispatch({type: "categories", categories}))
    )
}

export {ContextProvider, useAppContext, fetchProducts, fetchMoreProducts, fetchCategories}