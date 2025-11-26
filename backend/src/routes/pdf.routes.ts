import { Router } from "express";
import { servePDF } from "../controllers/pdf.controller";

const router = Router();

// PDF serving endpoint
router.get("/:filename", servePDF);

export default router;
