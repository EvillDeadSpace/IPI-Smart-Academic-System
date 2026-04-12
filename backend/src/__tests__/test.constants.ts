import { StudentStatus } from "../../generated/prisma";

export const TEST_STUDENT = {
  id: 1,
  firstName: "Amar",
  lastName: "Tubic",
  email: "amar@amar.com",
  password: "123123",
  indexNumber: "123321",
  dateOfBirth: new Date(),
  currentYear: 1,
  status: StudentStatus.ACTIVE,
  majorId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  major: {
    id: 1,
    name: "RC1",
    code: "RC2",
  },
};

export const TEST_PROFESSOR = {
  id: 1,
  firstName: "Professor",
  lastName: "TestProf",
  email: "professor@test.com",
  userType: "PROFESSOR",
  subjects: [
    {
      subject: {
        id: 1,
        name: "Matematika",
        code: "123",
      },
    },
  ],
  password: "123123",
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "Profa",
  office: "RC2",
};
