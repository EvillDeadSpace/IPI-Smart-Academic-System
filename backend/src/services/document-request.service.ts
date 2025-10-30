import {
  PrismaClient,
  DocumentType,
  DocumentRequestStatus,
} from "../../generated/prisma";

const prisma = new PrismaClient();

export class DocumentRequestService {
  /**
   * Student creates a new document request
   */
  async createRequest(studentId: number, documentType: DocumentType) {
    // Fetch student data to store snapshot
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { major: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Create snapshot of student data for PDF generation
    const studentData = {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      indexNumber: student.indexNumber,
      dateOfBirth: student.dateOfBirth.toISOString(),
      currentYear: student.currentYear,
      majorName: student.major.name,
    };

    const request = await prisma.documentRequest.create({
      data: {
        studentId,
        documentType,
        status: DocumentRequestStatus.PENDING,
        studentData: studentData as any,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            indexNumber: true,
          },
        },
      },
    });

    return request;
  }

  /**
   * Get all requests (for admin) or student's own requests
   */
  async getRequests(studentId?: number) {
    const where = studentId ? { studentId } : {};

    const requests = await prisma.documentRequest.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            indexNumber: true,
            dateOfBirth: true,
            currentYear: true,
          },
        },
      },
      orderBy: { requestDate: "desc" },
    });

    return requests;
  }

  /**
   * Get single request by ID
   */
  async getRequestById(id: number) {
    const request = await prisma.documentRequest.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            indexNumber: true,
            dateOfBirth: true,
            currentYear: true,
          },
        },
      },
    });

    return request;
  }

  /**
   * Admin approves request and generates PDF
   */
  async approveRequest(id: number, adminEmail: string, pdfUrl: string) {
    const request = await prisma.documentRequest.update({
      where: { id },
      data: {
        status: DocumentRequestStatus.APPROVED,
        processedDate: new Date(),
        processedBy: adminEmail,
        pdfUrl,
      },
      include: {
        student: true,
      },
    });

    return request;
  }

  /**
   * Admin rejects request
   */
  async rejectRequest(id: number, adminEmail: string, reason?: string) {
    const request = await prisma.documentRequest.update({
      where: { id },
      data: {
        status: DocumentRequestStatus.REJECTED,
        processedDate: new Date(),
        processedBy: adminEmail,
        rejectionReason: reason,
      },
    });

    return request;
  }

  /**
   * Delete request (student can delete pending requests)
   */
  async deleteRequest(id: number, studentId: number) {
    const request = await prisma.documentRequest.findUnique({
      where: { id },
    });

    if (!request || request.studentId !== studentId) {
      throw new Error("Request not found or unauthorized");
    }

    if (request.status !== DocumentRequestStatus.PENDING) {
      throw new Error("Can only delete pending requests");
    }

    await prisma.documentRequest.delete({
      where: { id },
    });

    return { success: true };
  }
}
