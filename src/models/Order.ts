import createModel from "@/lib/services/utils/createModel";
import mongoose, { Model, Schema } from "mongoose";
import { IProductSize } from "./ProductSize";
import { IUser } from "./User";
import { IProduct } from "./Product";

export interface IOrderItem {
    product: IProduct | string;
    quantity: number;
    sizeId: IProductSize | string;
}

export interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface IOrder {
    id?: mongoose.Types.ObjectId | string;
    user?: IUser | string;
    items: IOrderItem[];
    total: number;
    status: string;
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    paymentStatus: string;
}

interface IOrderMethods {}

type OrderModel = Model<IOrder, {}, IOrderMethods>;

const orderSchema = new Schema<IOrder, OrderModel, IOrderMethods>({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    size: { type: mongoose.Types.ObjectId,ref: 'ProductSize', required: true },
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, {timestamps: true});

export default createModel<IOrder, OrderModel>("Order", orderSchema);
