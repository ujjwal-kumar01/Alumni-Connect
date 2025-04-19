import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";

const router = Router();

// POST route for contact form submission
router.post("/submit", submitContact);

export default router;
