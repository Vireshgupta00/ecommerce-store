import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "./Product";
import createModel from "@/lib/services/utils/createModel";

export interface IProductSize {
    _id?: mongoose.Types.ObjectId | string;
    productId: IProduct | string;
    size: string;
    quantity: number;
}

interface IProductSizeMethods {}

type ProductSizeModel = Model<IProductSize, {}, IProductSizeMethods>;

const productSizeSchema = new Schema<IProductSize, ProductSizeModel, IProductSizeMethods>({
    productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
}, {timestamps: true});

export default createModel<IProductSize, ProductSizeModel>("ProductSize", productSizeSchema);
