import { getProduct } from "@/lib/services/productService";
import withErrorHandler from "@/lib/services/utils/withErrorHandler";
import { successResponse } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
    const url = request.nextUrl.origin;
    const id = params.id;
    const data = await getProduct(id);
    data.image![0].path = `${url}/${data.image![0].path}`
  
    return successResponse(data);
  });