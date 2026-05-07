import express from "express";

import * as productController from "../controllers/productController";

import { protect } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/", protect,productController.createProduct);

router.get("/", protect, productController.getProducts);

export default router;