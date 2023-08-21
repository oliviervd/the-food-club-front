import {useQuery} from "@tanstack/react-query";

export function fetchAPI(endpoint) {
    const {data, isLoading, status} = useQuery({
        queryKey:[endpoint],
        queryFn: () =>
            fetch(`https://p01--admin-cms--qbt6mytl828m.code.run/api/${endpoint}/`,{
                credentials: 'include',
                method: 'GET'
            }).then((req)=>req.json())
    })
    return data
}

