import mongoose from "mongoose";
import { Types } from "mongoose";

export class FileDb {

    path?: string;

    _id?: mongoose.Types.ObjectId | string;
}

export const mapToFile = (path: string) => {
    const newFile = new FileDb();
    newFile._id = new Types.ObjectId();
    newFile.path = path;
    
    return newFile;
}