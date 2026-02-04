import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '../../constants/storage'

export default function useFetchStatus() {
    const { data: status = false } = useQuery({
        queryKey: ['nlpStatus'],
        queryFn: async () => {
            const response = await fetch(API_ENDPOINTS.STATUS_CHECK)
            const data = await response.json()
            return data.status
        },
        refetchInterval: 5000,
        retry: false,
    })

    return { status }
}
