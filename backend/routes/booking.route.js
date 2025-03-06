import express from "express";
import { newBooking } from "../controllers/booking.controller.js";

const router = express.Router();
router.post("/newBooking", newBooking);

export default router;