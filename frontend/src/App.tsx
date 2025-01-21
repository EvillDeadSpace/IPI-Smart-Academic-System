import './App.css'

import { ChatProvider } from './Context'
import HeroSite from './components/HeroSite'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotFound from './components/Auth/NotFound'
import MainBoard from './components/Dashboard/MainBoard'
import Login from './components/Auth/Login'
import Header from './components/Header/Header'

function App() {
    return (
        <>
            <ChatProvider>
                <Header />
                <Router>
                    <Routes>
                        <Route path="/samojaznam" element={<Header></Header>} />
                        <Route path="/" element={<HeroSite></HeroSite>} />
                        <Route path="*" element={<NotFound />} />{' '}
                        <Route path="/dashboard" element={<MainBoard />} />{' '}
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Router>
            </ChatProvider>
        </>
    )
}

export default App
