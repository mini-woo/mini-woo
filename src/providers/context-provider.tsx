'use client';

import * as React from 'react'

type Action =
    | { type: "mode", mode: Mode }
    | { type: "loading" }
    | { type: "products", products: Product[], hasMore: boolean, page: number, categoryId?: number }
    | { type: "categories", categories: Category[] }
    | { type: "select-cat", category: Category }
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
    count: number,
}

type State = {
    mode: Mode
    loading: boolean
    products: Product[]
    page: number
    hasMore: boolean
    categories: Category[]
    selectedCategory?: Category
    cart: Map<number, CartItem>
}

const StateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

function contextReducer(state: State, action: Action) {
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
            if (
                state.selectedCategory?.id !== action.categoryId ||
                state.page !== action.page - 1
            )
                return state;
            state.products.push(...action.products)
            state.page = action.page
            state.loading = false
            state.hasMore = action.hasMore
            break
        }
        case 'categories': {
            state.categories = action.categories
            break
        }
        case 'select-cat': {
            state.products = new Array(0)
            state.page = 0
            state.loading = true
            state.hasMore = true
            if (state.selectedCategory?.id === action.category.id)
                state.selectedCategory = undefined
            else
                state.selectedCategory = action.category
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
    return {
        ...state
    }
}

function ContextProvider({children}: {
    children: React.ReactNode
}) {
    const init: State = {
        mode: "storefront",
        loading: true,
        products: Array(0),
        page: 0,
        hasMore: true,
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

const PER_PAGE = 12

function fetchProducts(state: State, dispatch: Dispatch) {
    dispatch({type: "loading"})
    const page = (state.page + 1)
    const categoryId = state.selectedCategory?.id
    let url = "api/products?per_page=" + PER_PAGE + "&page=" + page
    if (categoryId)
        url = url + "&category=" + categoryId
    fetch(url, {method: "GET"}).then((res) =>
        res.json().then((products) => {
            const hasMore = products.length === PER_PAGE
            dispatch({type: "products", products, page, hasMore, categoryId})
        })
    )
}

function fetchCategories(dispatch: Dispatch) {
    fetch("api/categories?per_page=30", {method: "GET"}).then((res) =>
        res.json().then((categories) => dispatch({type: "categories", categories}))
    )
}

export {ContextProvider, useAppContext, fetchProducts, fetchCategories}