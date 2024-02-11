import {useQuery} from "@tanstack/react-query";
import {useEffect, useState, useRef} from "react";

export function fetchAPI(endpoint, locale) {
    // fetch all data from a certain collection based on a given locale and limit.
    const {data, isLoading, status} = useQuery({
        queryKey:[endpoint],
        queryFn: () =>
            fetch(`https://p01--cms--j4bvc8vdjtjb.code.run/api/${endpoint}/?locale=${locale}`,{
                credentials: 'include',
                method: 'GET'
            }).then((req)=>req.json())
    })
    return data
}

export function pricingLabel(input) {
    // function that translates string from Payload into Euro Symbols.
    switch (input) {
        case "one":
            console.log("€")
            return "€"
        case "two": return "€€"
        case "three": return "€€€"
        case "four": return "€€€€"
    }
}

export function colorWordInString(string, substring) {
    // based on a given substring, replace the style using a span.
    const words = string.split("");
    const styledWords = words.map((w) => {
        //if the word matches
        if (w === substring) {
            return `<span className="highlight">${w}</span>`;
        }
        //else
        return w;
    });

    const hightlightedTitle = styledWords.join("");
    return hightlightedTitle;
}


export function useIntersectionObserver({delay}) {
    // function that checks if an element is in the viewport
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            }
        )

        // delay added to the intersection observer
        const timerId = setTimeout(()=>{
            if (ref.current){
                observer.observe(ref.current)
            }
        }, delay)

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
            clearTimeout(timerId)
        }
    }, []);

    return [ref, isIntersecting]
}

export function FadeInComponent({children}) {
    const [ref, isIntersecting] = useIntersectionObserver(0)

    return (
        <div ref={ref} className={`fade-in-section ${isIntersecting ? 'is-visible' : ''}`}>
            {children}
        </div>
    )
}

export function isObject(input) {
    if (typeof input === "object" && input[1]) {
        return true;
    } else {
        return false;
    }
}