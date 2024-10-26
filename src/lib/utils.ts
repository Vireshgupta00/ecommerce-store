import { NextResponse } from "next/server";

export function errorResponse(
    message: string,
    statusCode: number = 500,
    data: any = null,
  ): NextResponse {
    const mErrorResponse = {
      status: false,
      message,
      ...(data && {data}),
    };
  
    return new NextResponse(JSON.stringify(mErrorResponse), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  export function successResponse(
    data: any = null,
    message: string = 'Successful!',
    statusCode: number = 200,
  ): NextResponse {
    const mSuccessResponse = {
      status: true,
      message,
      data,
    };
  
    return new NextResponse(JSON.stringify(mSuccessResponse), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }