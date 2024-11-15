import { FC, useState } from 'react'
import Lottie from 'lottie-react'
import animation from '../assets/wired-gradient-981-consultation-hover-conversation.json'

const Chat: FC = () => {
    const [data, setData] = useState<{ results: string[] } | null>(null) // Type as needed
    const [query, setQuery] = useState<string>('') // State for user input
    const [messages, setMessages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false) // State for loading

    // Function to handle input field changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (query.trim()) {
            // Add new message to the messages array
            setMessages([...messages, query])
            // Reset the input field
            setQuery('')
        }

        setIsLoading(true) // Set loading to true before fetching data

        try {
            const response = await fetch('http://127.0.0.1:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            })
            const result = await response.json()
            console.log(result) // Log the result to the console
            setData(result as { results: string[] })
        } catch (error) {
            console.error('There was an error!', error)
        } finally {
            setIsLoading(false) // Set loading to false after fetching data
        }
    }

    return (
        <>
            <div className="lottie-container">
                <Lottie animationData={animation} className="lottie-icon" />
            </div>
            <div className="chat-window">
                <div className="chat-content">
                    {messages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        data?.results?.map((result: string, index: number) => (
                            <p key={index}>{result}</p>
                        ))
                    )}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Enter your query"
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Chat
