import { Router } from "express";
import { SemesterController } from "../controllers/semester.controller";

const router = Router();

router.get("/current", SemesterController.getCurrent);
router.get("/", SemesterController.getAll);
router.post("/", SemesterController.create);
router.put("/:id", SemesterController.update);
router.delete("/:id", SemesterController.delete);
router.patch("/:id/activate", SemesterController.activate);

export default router;
