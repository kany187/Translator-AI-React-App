import { useMutation } from '@tanstack/react-query'
import type { TranslateResponse } from '../services/translateService'
import translateService from '../services/translateService'

const useSendQuestion = (session_id: string) => {
    return useMutation<TranslateResponse, Error, string>({
        mutationFn: (question: string) =>
            translateService.post<TranslateResponse>(`/${session_id}`, {question})

    })
}

export default useSendQuestion
