import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Toaster from './components/ui/Toast'
import { AuthProvider } from './Context'
import { ChatProvider } from './contexts/ChatContext'
import './index.css'
import AppRoutes from './routes/AppRoutes'

function AppContent() {
    const location = useLocation()

    // Paths where header should be hidden (authenticated dashboards)
    const DASHBOARD_PATHS = ['/dashboard', '/profesor', '/admin']

    const shouldHideHeader = DASHBOARD_PATHS.some((path) =>
        location.pathname.startsWith(path)
    )

    return (
        <div className="min-h-screen flex flex-col">
            {!shouldHideHeader && <Header />}
            <main className="flex-1">
                <AppRoutes />
            </main>
        </div>
    )
}

function App() {
    return (
        <div className="overflow-x-hidden hide-scrollbar">
            <Router>
                <AuthProvider>
                    <ChatProvider>
                        <AppContent />
                        <Toaster />
                    </ChatProvider>
                </AuthProvider>
            </Router>
        </div>
    )
}

export default App
