import {CSSProperties, useEffect, useRef} from "react";

export default function InfiniteScroll({callback, hasMore, loading}: {
    callback: () => void,
    hasMore: boolean,
    loading: boolean
}) {
    const observerTarget = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    callback();
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
    }, [observerTarget, callback])

    const style = {
        width: "100%",
        height: "100%",
        minWidth: "20px",
        minHeight: "20px",
        textAlign: "center"
    } as CSSProperties


    if (loading) return <div style={style}>Loading...</div>


    if (!hasMore) return <div style={style}>No more.</div>

    return <div ref={observerTarget} style={style}>...</div>
}
