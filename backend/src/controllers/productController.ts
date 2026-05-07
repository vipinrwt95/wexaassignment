import { Response } from "express";

import Product from "../models/Product";

import { AuthRequest } from "../middleware/authMiddleware";

export const createProduct = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    } = req.body;

    const product = await Product.create({
      organizationId: req.user?.organizationId,
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const products = await Product.find({
      organizationId: req.user?.organizationId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};