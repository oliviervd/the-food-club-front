import {useQuery} from "@tanstack/react-query";

export function fetchAPI(endpoint) {
    // fetch all data from a certain collection.
    const {data, isLoading, status} = useQuery({
        queryKey:[endpoint],
        queryFn: () =>
            fetch(`https://p01--cms--j4bvc8vdjtjb.code.run/api/${endpoint}/?limit=0`,{
                credentials: 'include',
                method: 'GET'
            }).then((req)=>req.json())
    })
    return data
}



