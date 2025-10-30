export const STORAGE_KEYS = {
    STUDENT_EMAIL: 'student mail',
    STUDENT_NAME: 'student name',
    STUDENT_TYPE: 'userType',
    USER_DETAILS: 'userDetails',
}

// Re-export environment-configured URLs from central config
import {
    BACKEND_URL as CONFIG_BACKEND_URL,
    NLP_URL as CONFIG_NLP_URL,
} from '../config'
export const BACKEND_URL = CONFIG_BACKEND_URL
export const NLP_URL = CONFIG_NLP_URL

// Development use this 'http://127.0.0.1:5000'

export const API_ENDPOINTS = {
    USER_DETAILS: (email: string) => `${BACKEND_URL}/user/${email}`,
    STATUS_CHECK: `${NLP_URL}/status`,
    NLP_SEARCH: `${NLP_URL}/search`,
}
