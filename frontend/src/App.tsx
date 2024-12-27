import './App.css'

import { ChatProvider } from './Context'
import HeroSite from './components/HeroSite'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotFound from './components/Pages/NotFound'

function App() {
    return (
        <>
            <ChatProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HeroSite></HeroSite>} />
                        <Route path="*" element={<NotFound />} />{' '}
                    </Routes>
                </Router>
            </ChatProvider>
        </>
    )
}

export default App
