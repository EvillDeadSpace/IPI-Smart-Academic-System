export const STORAGE_KEYS = {
    STUDENT_EMAIL: 'student mail',
    STUDENT_NAME: 'student name',
    STUDENT_TYPE: 'userType',
    USER_DETAILS: 'userDetails',
}

export const API_ENDPOINTS = {
    USER_DETAILS: (email: string) => `http://localhost:8080/user/${email}`,
    STATUS_CHECK: 'http://127.0.0.1:5000/status',
}
