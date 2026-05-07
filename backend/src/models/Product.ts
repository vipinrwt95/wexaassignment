import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  organizationId: Types.ObjectId;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

const productSchema = new Schema<IProduct>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    quantityOnHand: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: undefined,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index(
  { organizationId: 1, sku: 1 },
  { unique: true }
);

export default mongoose.model<IProduct>("Product", productSchema);