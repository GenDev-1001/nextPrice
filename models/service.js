import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";

const serviceSchema = new Schema(
  {
    id: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true, 
    },
    key: {
      type: String,
      default: () => uuid(),
    },
  },
  {
    timestamps: true,
  }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;

