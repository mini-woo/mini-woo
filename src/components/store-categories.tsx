"use client"
import {fetchCategories, useAppContext} from "@/providers/context-provider";
import {useEffect} from "react";

export default function StoreCategories() {
    const {state, dispatch} = useAppContext()

    useEffect(() => {
        fetchCategories(dispatch)
    },[])

    const items = state.categories.map((category) =>
        <div style={state.selectedCategoryId === category.id ? {backgroundColor: "var(--accent-color)"} : {}}
             key={category.id}
             onClick={() => dispatch({type: "select-cat", id: category.id})}
        >{category.name}</div>
    )

    return (
        <div className="store-categories">
            {items}
        </div>
    )
}

