import createModel from "@/lib/services/utils/createModel";
import mongoose, { Model, Schema } from "mongoose";
import { IProductSize } from "./ProductSize";
import { FileDb } from "./FileDb";

export interface IProduct {
    id?: mongoose.Types.ObjectId | string;
    name?: string;
    description?: string;
    price?: number;
    image?: FileDb[];
    rating?: number;
    sizeOptions?: IProductSize[];
    totalQuantity?: number;
}

interface IProductMethods {}

type ProductModel = Model<IProduct, {}, IProductMethods>;

const productSchema = new Schema<IProduct, ProductModel, IProductMethods>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: [
        {
            path:{
                type: String,
                required: [true, 'Please provide product image']
            }
        }
    ],
    rating: { type: Number },
    sizeOptions: [{ type: mongoose.Types.ObjectId, ref: 'ProductSize' }],
    totalQuantity: Number
}, {timestamps: true});

export default createModel<IProduct, ProductModel>("Product", productSchema);
