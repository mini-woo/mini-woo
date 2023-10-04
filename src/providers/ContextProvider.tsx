'use client';

import * as React from 'react'

type Action =
    | { type: "mode", mode: Mode }
    | { type: "inc", id: number }
    | { type: "dec", id: number }

type Dispatch = (action: Action) => void

type Mode = 'storefront' | 'order'

export type Item = {
    id: number,
    count: number,
}


type State = {
    mode: Mode
    cart: Map<number, Item>
}

const StateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

function contextReducer(state: State, action: Action) {
    console.log("dispatch", {action, state})
    switch (action.type) {
        case 'mode': {
            state.mode = action.mode
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
            // @ts-ignore
            throw new Error(`Unhandled action type: ${action.type}`)
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
        cart: new Map<number, Item>(),
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

function useContext() {
    const context = React.useContext(StateContext)
    if (context === undefined) {
        throw new Error('useContext must be used within a ContextProvider')
    }
    return context
}

export {ContextProvider, useContext}