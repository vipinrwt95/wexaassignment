import { Response } from "express";

import Product from "../models/Product";
import Organization from "../models/Organization";
import { AuthRequest } from "../middleware/authMiddleware";

export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const organizationId = req.user?.organizationId;

    const organization = await Organization.findById(
      organizationId
    );

    const defaultThreshold =
      organization?.defaultLowStockThreshold ?? 5;

    const products = await Product.find({
      organizationId,
    }).sort({ createdAt: -1 });

    const totalProducts = products.length;

    const totalQuantityOnHand = products.reduce(
      (sum, product) => {
        return sum + (product.quantityOnHand || 0);
      },
      0
    );

    const lowStockItems = products
      .filter((product) => {
        const threshold =
          product.lowStockThreshold ?? defaultThreshold;

        return product.quantityOnHand <= threshold;
      })
      .map((product) => {
        const threshold =
          product.lowStockThreshold ?? defaultThreshold;

        return {
          id: product._id,
          name: product.name,
          sku: product.sku,
          quantityOnHand: product.quantityOnHand,
          lowStockThreshold: threshold,
        };
      });

    return res.json({
      success: true,
      summary: {
        totalProducts,
        totalQuantityOnHand,
        lowStockCount: lowStockItems.length,
      },
      lowStockItems,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};