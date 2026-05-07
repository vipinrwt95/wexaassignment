import mongoose, {
  Schema,
  Document,
  Types,
  Model,
} from "mongoose";

export interface IProduct extends Document {
  organizationId: Types.ObjectId;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
  lastUpdatedBy?: string;
lastUpdatedAt?: Date;
lastUpdateNote?: string;
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
      default: 0,
    },

    costPrice: {
      type: Number,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    lastUpdatedBy: {
  type: String,
},

lastUpdatedAt: {
  type: Date,
},

lastUpdateNote: {
  type: String,
  trim: true,
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

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>(
    "Product",
    productSchema
  );

export default Product;