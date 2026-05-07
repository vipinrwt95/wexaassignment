import { Response } from "express";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

export const createProduct = async (req: AuthRequest, res: Response) => {
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

    if (!name || !sku) {
      return res.status(400).json({
        success: false,
        message: "Name and SKU are required",
      });
    }

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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists for this organization",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({
      organizationId: req.user?.organizationId,
    }).sort({ createdAt: -1 });

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

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: req.user?.organizationId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
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

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user?.organizationId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists for this organization",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user?.organizationId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};