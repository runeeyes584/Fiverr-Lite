import express from "express";
import {
  createGig,
  deleteGig,
  getAllGigs,
  getGigById
} from "../controllers/gig.controller.js";
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post("/", requireAuth, createGig);
router.delete("/:id", requireAuth, deleteGig);
router.get("/", getAllGigs);
router.get("/:id", getGigById);

export default router;

