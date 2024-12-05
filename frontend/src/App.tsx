import './App.css'
import Chat from './components/Chat'
import { ChatProvider } from './Context'
function App() {
    return (
        <>
            <ChatProvider>
                <Chat />
            </ChatProvider>
        </>
    )
}

export default App
