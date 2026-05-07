import express from "express";

import * as productController from "../controllers/productController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, productController.createProduct);

router.get("/", protect, productController.getProducts);

router.get("/:id", protect, productController.getProductById);

router.put("/:id", protect, productController.updateProduct);

router.delete("/:id", protect, productController.deleteProduct);

router.post("/:id/adjust-stock",protect,productController.adjustStock
);

export default router;