import { useMutation } from '@tanstack/react-query'
import translateService from '../services/translateService'
import type { StartResponse } from '../services/translateService'

const useStartSession = () => {
    return useMutation<StartResponse, Error>({
        mutationFn: () => translateService.post<StartResponse>('/start')
    })
}

export default useStartSession
