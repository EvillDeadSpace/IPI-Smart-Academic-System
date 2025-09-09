export const STORAGE_KEYS = {
    STUDENT_EMAIL: 'student mail',
    STUDENT_NAME: 'student name',
    STUDENT_TYPE: 'userType',
    USER_DETAILS: 'userDetails',
}

const BACKEND_URL = import.meta.env.PROD
    ? 'https://faculty-backend.onrender.com'
    : 'http://localhost:8080'

const NLP_URL = 'https://amartubic.pythonanywhere.com'

// Development use this 'http://127.0.0.1:5000'

export const API_ENDPOINTS = {
    USER_DETAILS: (email: string) => `${BACKEND_URL}/user/${email}`,
    STATUS_CHECK: `${NLP_URL}/status`,
    NLP_SEARCH: `${NLP_URL}/search`,
}
