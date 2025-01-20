import './App.css'

import { ChatProvider } from './Context'
import HeroSite from './components/HeroSite'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotFound from './components/Auth/NotFound'
import MainBoard from './components/Dashboard/MainBoard'

function App() {
    return (
        <>
            <ChatProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HeroSite></HeroSite>} />
                        <Route path="*" element={<NotFound />} />{' '}
                        <Route path="/dashboard" element={<MainBoard />} />{' '}
                    </Routes>
                </Router>
            </ChatProvider>
        </>
    )
}

export default App
