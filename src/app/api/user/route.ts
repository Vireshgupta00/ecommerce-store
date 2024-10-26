import { createUser, getUserList } from "@/lib/services/userService";
import withErrorHandler from "@/lib/services/utils/withErrorHandler";
import { successResponse } from "@/lib/utils";
import { IUser } from "@/models/User";
import { NextRequest } from "next/server";

export const POST = withErrorHandler(async (request: NextRequest) => {

    const body = await request.json();

    const newData: IUser = {
        userName: body.userName,
        email: body.email,
        password: body.password       
    };

    const data = await createUser(newData);

    return successResponse(data);
});

export const GET = withErrorHandler(async (request: NextRequest) => {
    const pageStr = request.nextUrl.searchParams.get("page");
    const sizeStr = request.nextUrl.searchParams.get("size");

    const page = pageStr ? parseInt(pageStr) : 1;
    const size = sizeStr ? parseInt(sizeStr) : 10;

    const data = await getUserList({ page, size });

    return successResponse(data);
});