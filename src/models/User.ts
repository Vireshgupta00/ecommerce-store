import createModel from "@/lib/services/utils/createModel";
import mongoose, { Model, Schema } from "mongoose";

export interface IUser {
    _id?: mongoose.Types.ObjectId | string;
    userName?: string;
    email?: string;
    password?: string;
}

interface IUserMethods {}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
        userName: {
            type: String,
            required: [true, "Please provide user name"],
            unique: true
        },
        email:{
            type: String,
            required: [true, "Please provide email"],
            unique: true
        },
        password:{
            type: String,
            required: true
        }
}, {timestamps: true});

export default createModel<IUser, UserModel>("User", userSchema);