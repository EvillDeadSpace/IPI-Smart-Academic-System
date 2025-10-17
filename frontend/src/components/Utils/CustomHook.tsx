import { useState } from 'react'
import { API_ENDPOINTS } from '../../constants/storage'

export const useChatSubmit = () => {
    const [word, setWord] = useState<string>('')
    const [messages, setMessages] = useState<
        { text: string; isUser: boolean }[]
    >([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Funkcija koja se poziva prilikom slanja forme
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (word.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: word, isUser: true },
            ])
            setWord('')
        }

        setIsLoading(true)

        try {
            let response
            let result

            try {
                // Pokušaj prvo primarni URL (lokalni u dev, PythonAnywhere u prod)
                response = await fetch(API_ENDPOINTS.NLP_SEARCH, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ word }),
                    signal: AbortSignal.timeout(5000), // 5 sekundi timeout
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                result = await response.json()
            } catch (primaryError) {
                console.log(
                    'Primary NLP service failed, trying fallback...',
                    primaryError
                )

                // Fallback na PythonAnywhere ako lokalni ne radi
                response = await fetch(
                    'https://amartubic.pythonanywhere.com/search',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ word }),
                    }
                )
                result = await response.json()
            }

            // Dodaj AI odgovor u niz poruka
            if (result.response && result.response.length > 0) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.response, isUser: false },
                ])
            } else if (result.error) {
                // Poruka greške sa API-a
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.error, isUser: false },
                ])
            } else {
                // Fallback poruka
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: 'Izvinjavam se, nisam mogao da odgovorim na vaše pitanje.',
                        isUser: false,
                    },
                ])
            }
        } catch (error) {
            console.error('There was an error!', error)
        } finally {
            setIsLoading(false)
        }
    }
    return { word, setWord, messages, isLoading, handleSubmit }
}
