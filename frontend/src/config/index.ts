export const BACKEND_URL = import.meta.env.PROD
    ? 'https://ipi-smart-academic-system-dzhc.vercel.app'
    : 'http://localhost:3001'

export const NLP_URL = import.meta.env.PROD
    ? 'https://amartubic.pythonanywhere.com'
    : 'http://127.0.0.1:5000'
