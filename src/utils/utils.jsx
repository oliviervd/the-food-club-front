import {useQuery} from "@tanstack/react-query";

export function fetchAPI(endpoint) {
    const {data, isLoading, status} = useQuery({
        queryKey:[endpoint],
        queryFn: () =>
            fetch(`https://p01--cms--2y8cq25kbv7n.code.run/api/${endpoint}/`,{
                credentials: 'include',
                method: 'GET'
            }).then((req)=>req.json())
    })
    return data
}

