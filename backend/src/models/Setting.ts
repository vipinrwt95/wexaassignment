import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ISetting extends Document {
  organizationId: Types.ObjectId;
  defaultLowStockThreshold: number;
}

const settingSchema = new Schema<ISetting>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
    },

    defaultLowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", settingSchema);

export default Setting;