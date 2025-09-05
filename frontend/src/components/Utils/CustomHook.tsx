import { useState } from 'react'

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
            const response = await fetch('http://127.0.0.1:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),
            })
            const result = await response.json()

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
