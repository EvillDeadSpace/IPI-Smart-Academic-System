// Auth related types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: "STUDENT" | "PROFESSOR" | "ADMIN";
  major?: {
    id: number;
    name: string;
    code: string;
  };
  subjects?: Array<{
    id: number;
    name: string;
    code: string;
  }>;
}

export interface RegisterStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  indexNumber: string;
  dateOfBirth: string;
  majorId: number;
}

export interface RegisterProfessorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  title?: string;
  office?: string;
  subjectIds?: number[];
}
