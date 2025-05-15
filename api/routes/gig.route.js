import express from "express";
import {
  createGig,
  deleteGig,
  getAllGigs,
  getGigById,
  updateGig,
  searchGigs,
} from "../controllers/gig.controller.js";
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post("/", createGig);
router.delete("/:id", deleteGig);
router.get("/", getAllGigs);
router.get("/:id", getGigById);
router.put("/:id", updateGig);
router.get("/search", searchGigs);


export default router;

