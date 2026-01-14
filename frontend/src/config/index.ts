// Environment-based configuration
// import.meta.env.PROD is true in production build, false in development
export const BACKEND_URL = import.meta.env.PROD
    ? 'https://ipi-smart-academic-system-dzhc.vercel.app'
    : 'http://localhost:3001'

export const NLP_URL = import.meta.env.PROD
    ? 'https://faculty-nlp.onrender.com'
    : 'http://127.0.0.1:5000'

// Log environment mode (helps with debugging)
console.log('🌍 Environment:', import.meta.env.MODE)
console.log('📡 Backend URL:', BACKEND_URL)
console.log('🤖 NLP URL:', NLP_URL)
