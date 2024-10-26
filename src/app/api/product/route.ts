import { createProduct, getProductList } from "@/lib/services/productService";
import withErrorHandler from "@/lib/services/utils/withErrorHandler";
import { errorResponse, successResponse } from "@/lib/utils";
import { mapToFile } from "@/models/FileDb";
import { IProduct } from "@/models/Product";
import { uploadFiles } from "@/utils/UploadFiles";
import { NextRequest } from "next/server";

export const POST = withErrorHandler(async (request: NextRequest) => {

    const formData = await request.formData();
    const body = JSON.parse(formData.get('data') as string);
    const newData: IProduct = {
        name: body.name,
        description:body.description,
        price: body.price,
        rating:body.rating,
        sizeOptions: body.sizeOptions
    };

    const image = formData.getAll('image') as File[]

    if (!image?.length || image.length == 0) {
        return errorResponse('Please upload 3 images', 400)
    } else {
        const fileNames = await uploadFiles(image, 'image');
        newData.image = fileNames.map(mapToFile);
    }

    const data = await createProduct(newData);

    return successResponse(data);
});

export const GET = withErrorHandler(async (request: NextRequest) => {

    const pageStr = request.nextUrl.searchParams.get("page");
    const sizeStr = request.nextUrl.searchParams.get("size");
    const page = pageStr ? parseInt(pageStr) : 1;
    const size = sizeStr ? parseInt(sizeStr) : 10;

    const data = await getProductList({ page, size });

    return successResponse(data);
});