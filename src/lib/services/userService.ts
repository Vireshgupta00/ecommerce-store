import User, { IUser } from "@/models/User";
import connectDB from "../connect-db";
import { ErrorHandler } from "@/models/errorHandler";
import { compare, hash } from "bcryptjs";

interface UserFilter {
    page?: number;
    size?: number;
    }
  
  export async function getUserList(filter: UserFilter = {}) {
    try {
      await connectDB();
  
      const page = filter.page ?? 1;
      const size = filter.size ?? 10;
      const skip = (page - 1) * size;
      let query: any = {};
        
      const userList = await User.find(query).skip(skip).limit(size).lean().exec();
  
      const totalCount = await User.find(query).countDocuments();
  
      return {
        userList,
        currentPage: page,
        totalPages: Math.ceil(totalCount / size),
        totalCount,
      };
    } catch (error: any) {
      throw ErrorHandler.create(error?.message);
    }
  }
export async function createUser(inputData: IUser) {
    try {
      await connectDB();
  
      inputData.password = await hash(inputData.password ?? '', 8);
      const isEmailExists = await User.findOne({ email: inputData.email });
  
      if (isEmailExists) {
        throw ErrorHandler.create("Email Already exists");
      }
    
      const user = await User.create(inputData);
  
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        throw ErrorHandler.create("User with name already exists", 409);
      }
      throw ErrorHandler.create(error?.message);
    }
  }

  export async function loginUser(email: string, password: string): Promise<IUser> {
    try {
      await connectDB();
  
      const user = await User.findOne({ email: email }).lean().exec();
      if (user) {
        if (!(await compare(password, user.password ?? ''))) {
          throw ErrorHandler.create("Invalid user or password!");
        }
        return user;
      } else {
        throw ErrorHandler.create("User not found");
      }
    } catch (error: any) {
      throw ErrorHandler.create(error?.message);
    }
  }