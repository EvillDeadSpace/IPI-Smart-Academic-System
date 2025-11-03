import { Request, Response } from "express";
import { DocumentRequestService } from "../services/document-request.service";
import { DocumentType } from "../../generated/prisma";

const documentRequestService = new DocumentRequestService();

// NLP service URL for PDF generation
const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:5000";

export class DocumentRequestController {
  /**
   * POST /api/document-requests
   * Student creates a new document request
   */
  async createRequest(req: Request, res: Response) {
    try {
      const { studentId, documentType } = req.body;

      if (!studentId || !documentType) {
        return res
          .status(400)
          .json({ error: "studentId and documentType are required" });
      }

      // Validate document type
      if (!Object.values(DocumentType).includes(documentType)) {
        return res.status(400).json({ error: "Invalid document type" });
      }

      const request = await documentRequestService.createRequest(
        Number(studentId),
        documentType as DocumentType
      );

      return res.status(201).json(request);
    } catch (error: any) {
      console.error("Error creating document request:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to create request" });
    }
  }

  /**
   * GET /api/document-requests
   * Get all requests (admin) or student's own requests
   * Query param: ?studentId=123
   */
  async getRequests(req: Request, res: Response) {
    try {
      const { studentId } = req.query;

      const requests = await documentRequestService.getRequests(
        studentId ? Number(studentId) : undefined
      );

      return res.json(requests);
    } catch (error: any) {
      console.error("Error fetching document requests:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch requests" });
    }
  }

  /**
   * GET /api/document-requests/:id
   * Get single request by ID
   */
  async getRequestById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const request = await documentRequestService.getRequestById(Number(id));

      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      return res.json(request);
    } catch (error: any) {
      console.error("Error fetching request:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch request" });
    }
  }

  /**
   * POST /api/document-requests/:id/approve
   * Admin approves request and triggers PDF generation
   */
  async approveRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { adminEmail } = req.body;

      if (!adminEmail) {
        return res.status(400).json({ error: "adminEmail is required" });
      }

      // Fetch request details
      const request = await documentRequestService.getRequestById(Number(id));

      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      if (request.status !== "PENDING") {
        return res.status(400).json({ error: "Request is not pending" });
      }

      // Generate PDF URL (will be generated on-demand by PDF endpoint)
      let pdfUrl = "";
      const studentData: any = request.studentData || {};

      // Set PDF URL - actual generation happens when user downloads
      if (request.documentType === "HEALTH_CERTIFICATE") {
        pdfUrl = `/pdfs/health-cert-${id}.pdf`;
        console.log(
          `✅ Health certificate approved, PDF will be generated on download`
        );
      } else {
        pdfUrl = `/pdfs/${request.documentType.toLowerCase()}-${id}.pdf`;
        console.log(
          `ℹ️  Document type ${request.documentType} - placeholder PDF on download`
        );
      }

      // Update request status
      const updatedRequest = await documentRequestService.approveRequest(
        Number(id),
        adminEmail,
        pdfUrl
      );

      return res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error approving request:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to approve request" });
    }
  }

  /**
   * POST /api/document-requests/:id/reject
   * Admin rejects request
   */
  async rejectRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { adminEmail, reason } = req.body;

      if (!adminEmail) {
        return res.status(400).json({ error: "adminEmail is required" });
      }

      const request = await documentRequestService.rejectRequest(
        Number(id),
        adminEmail,
        reason
      );

      return res.json(request);
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to reject request" });
    }
  }

  /**
   * DELETE /api/document-requests/:id
   * Student deletes their own pending request
   */
  async deleteRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { studentId } = req.body;

      if (!studentId) {
        return res.status(400).json({ error: "studentId is required" });
      }

      const result = await documentRequestService.deleteRequest(
        Number(id),
        Number(studentId)
      );

      return res.json(result);
    } catch (error: any) {
      console.error("Error deleting request:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to delete request" });
    }
  }
}
