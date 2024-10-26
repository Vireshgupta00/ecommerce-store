import { errorResponse } from "@/lib/utils";
import { ErrorHandler } from "@/models/errorHandler";
import { NextRequest, NextResponse } from "next/server";

function withErrorHandler(fn: Function) {
  return async function (request: NextRequest, extData: any) {
    try {
      return await fn(request, extData);
    } catch (error: any) {
        console.error('withErrorHandler');
        console.error('time: ', new Date());
        console.error(error.stack);
        if (error instanceof ErrorHandler) {
          return errorResponse(error.message, error.statusCode);
        }
        return errorResponse(error.message);
    }
  };
}

export default withErrorHandler;