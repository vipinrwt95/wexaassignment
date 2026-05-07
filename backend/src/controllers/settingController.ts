import { Request, Response } from "express";
import Setting from "../models/Setting";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user.organizationId;

    let settings = await Setting.findOne({ organizationId });

    if (!settings) {
      settings = await Setting.create({
        organizationId,
        defaultLowStockThreshold: 5,
      });
    }

    return res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const organizationId = (req as any).user.organizationId;
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

    const settings = await Setting.findOneAndUpdate(
      { organizationId },
      {
        defaultLowStockThreshold,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};