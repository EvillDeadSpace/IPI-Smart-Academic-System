import { Router } from "express";
import { DocumentRequestController } from "../controllers/document-request.controller";

const router = Router();
const controller = new DocumentRequestController();

// Create new document request
router.post("/", (req, res) => controller.createRequest(req, res));

// Get all requests (admin) or filter by studentId
router.get("/", (req, res) => controller.getRequests(req, res));

// Get single request
router.get("/:id", (req, res) => controller.getRequestById(req, res));

// Approve request (admin)
router.post("/:id/approve", (req, res) => controller.approveRequest(req, res));

// Reject request (admin)
router.post("/:id/reject", (req, res) => controller.rejectRequest(req, res));

// Delete request (student)
router.delete("/:id", (req, res) => controller.deleteRequest(req, res));

export default router;
