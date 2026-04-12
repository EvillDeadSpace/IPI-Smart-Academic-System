import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "../../../generated/prisma";

import prisma from "../../config/database";
import { AuthService } from "../../services/auth.service";
import { TEST_PROFESSOR, TEST_STUDENT } from "../test.constants";

jest.mock("../../config/database", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  jest.resetAllMocks();
});

describe("AuthService.Login TEST", () => {
  describe("when user doesn't exist", () => {
    it("should return null for invalid credentials", async () => {
      prismaMock.student.findFirst.mockResolvedValueOnce(null);
      prismaMock.professor.findFirst.mockResolvedValueOnce(null);

      const resultStudent = await AuthService.login({
        email: "amar@amar.com",
        password: "123123",
      });

      const resultProfessor = await AuthService.login({
        email: "123@123.com",
        password: "123123",
      });
      expect(resultStudent).toBeNull();
      expect(resultProfessor).toBeNull();
    });
  });

  describe("when user exists", () => {
    it("should return student for valid student credentials", async () => {
      prismaMock.student.findFirst.mockResolvedValueOnce(TEST_STUDENT);

      const result = await AuthService.login({
        email: TEST_STUDENT.email,
        password: TEST_STUDENT.password,
      });

      expect(result?.userType).toBe("STUDENT");
      expect(result?.email).toBe(TEST_STUDENT.email);
    });

    it("should return admin for valid admin credentials", async () => {
      process.env.ADMIN_EMAIL = "admin@ipi.com";
      process.env.ADMIN_PASSWORD = "admin123";

      const result = await AuthService.login({
        email: "admin@ipi.com",
        password: "admin123",
      });

      expect(result?.userType).toBe("ADMIN");
      expect(result?.email).toBe("admin@ipi.com");
    });

    it("should return professor for valid professor credentials", async () => {
      prismaMock.professor.findFirst.mockResolvedValueOnce(TEST_PROFESSOR);

      const result = await AuthService.login({
        email: TEST_PROFESSOR.email,
        password: TEST_PROFESSOR.password,
      });

      expect(result?.userType).toBe("PROFESSOR");
      expect(result?.email).toBe(TEST_PROFESSOR.email);
    });
  });
});
