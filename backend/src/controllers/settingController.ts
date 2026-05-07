import { Response } from "express";
import Organization from "../models/Organization";
import { AuthRequest } from "../middleware/authMiddleware";

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.json({
      success: true,
      settings: {
        defaultLowStockThreshold:
          organization.defaultLowStockThreshold ?? 5,
      },
    });
  } catch (error: any) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;
    const { defaultLowStockThreshold } = req.body;

    if (
      defaultLowStockThreshold === undefined ||
      defaultLowStockThreshold === null ||
      defaultLowStockThreshold < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid default low stock threshold is required",
      });
    }

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      {
        defaultLowStockThreshold: Number(defaultLowStockThreshold),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        defaultLowStockThreshold:
          organization.defaultLowStockThreshold ?? 5,
      },
    });
  } catch (error: any) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};