import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();
// Routes
router.post("/", isAuthenticated, createCategory); // Create a new category
// router.get("/", getCategories); // Get all categories  for web
router.get("/getAllCategories", getCategories); // Get all categories  for mobile
router.get("/:id", getCategoryById); // Get category by ID
router.put("/:id", updateCategory); // Update category by ID
router.delete("/:id", isAuthenticated, deleteCategory); // Delete category by ID
export default router;
