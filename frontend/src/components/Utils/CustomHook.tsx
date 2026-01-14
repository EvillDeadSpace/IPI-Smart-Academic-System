import { useState } from 'react'
import { API_ENDPOINTS } from '../../constants/storage'

export const useChatSubmit = () => {
    const [word, setWord] = useState<string>('')
    const [messages, setMessages] = useState<
        { text: string; isUser: boolean }[]
    >([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    /**
     * Handles form submission and processes chat messages
     * @param event - React form event
     */
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
                // Attempt primary endpoint first (local in dev, PythonAnywhere in prod)
                response = await fetch(API_ENDPOINTS.NLP_SEARCH, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ word }),
                    signal: AbortSignal.timeout(5000), // 5 second timeout
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                result = await response.json()
            } catch {
                // Fallback to Render if primary endpoint fails
                response = await fetch(
                    'https://faculty-nlp.onrender.com/search',
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

            // Append AI response to message thread
            if (result.response && result.response.length > 0) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.response, isUser: false },
                ])
            } else if (result.error) {
                // Handle API error response
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.error, isUser: false },
                ])
            } else {
                // Display fallback message for unexpected responses
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: 'Izvinjavam se, nisam mogao da odgovorim na vaše pitanje.',
                        isUser: false,
                    },
                ])
            }
        } finally {
            setIsLoading(false)
        }
    }
    return { word, setWord, messages, isLoading, handleSubmit }
}
