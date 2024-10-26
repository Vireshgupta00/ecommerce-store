import Product, { IProduct } from "@/models/Product";
import ProductSize, { IProductSize } from "@/models/ProductSize";
import connectDB from "../connect-db";
import { ErrorHandler } from "@/models/errorHandler";
import { getDuplicateMsg } from "@/utils/server_utils";
import { Types } from 'mongoose';

interface ProductFilter {
    page?: number;
    size?: number;
}


export async function createProduct(inputData: IProduct) {
    try {
        await connectDB();
        
        if (!inputData.sizeOptions || inputData.sizeOptions.length == 0) {
            throw ErrorHandler.create('Please add size options');
        }

const { sizeOptions, ...productData } = inputData;

const product = await Product.create(productData);

let quantity = 0;
const sizeIds = await Promise.all(
    sizeOptions.map(async (size) => {
        quantity += size.quantity || 0;
        const productSize = await ProductSize.create({
            ...size,
            productId: product._id,
        });
        return productSize._id;
    })
);

await Product.findByIdAndUpdate(
    product._id,
    { sizeOptions: sizeIds, totalQuantity: quantity },
    { new: true }
);

const updatedProduct = await Product.findById(product._id).populate(
    "sizeOptions"
);

return updatedProduct;
    } catch (error: any) {
        if (error.code === 11000) {
            throw ErrorHandler.create(`Product ${getDuplicateMsg(error)}`, 409);
        }
        throw ErrorHandler.create(error?.message);
    }
}

export async function getProductList(filter: ProductFilter = {}) {
    try {
        await connectDB();

        const page = filter.page ?? 1;
        const size = filter.size ?? 10;
        const skip = (page - 1) * size;

        const productList = await Product.find()
            .populate('sizeOptions')
            .skip(skip)
            .limit(size)
            .lean()
            .exec();

        const totalCount = await Product.countDocuments();

        return {
            productList,
            currentPage: page,
            totalPages: Math.ceil(totalCount / size),
            totalCount,
        };
    } catch (error: any) {
        throw ErrorHandler.create(error?.message);
    }
}

export async function getProduct(id: string) {
    try {
        await connectDB();

        const product = await Product.findById(id).populate('sizeOptions').lean().exec();

        if (!product) {
            throw ErrorHandler.create('Product not found', 404);
        }

        return product;
    } catch (error: any) {
        throw ErrorHandler.create(error?.message);
    }
}

export async function updateProductQuantity(productId: string, size: string, quantity: number) {
    try {
        await connectDB();
console.log('prodsize', productId, size, quantity);
        const productSize = await ProductSize.findOne({ productId: productId, _id:size });
console.log('psdf0', productSize)
        if (!productSize) {
            throw ErrorHandler.create('Product size not found', 404);
        }

        if (productSize.quantity < quantity) {
            throw ErrorHandler.create('Not enough quantity available', 400);
        }

        productSize.quantity -= quantity;
        await productSize.save();

        const sizes = await ProductSize.find({ productId });
        const totalQuantity = sizes.reduce((sum, size) => sum + size.quantity, 0);

        await Product.findByIdAndUpdate(
            productId,
            { totalQuantity },
            { new: true }
        );


        return productSize;
    } catch (error: any) {
        throw ErrorHandler.create(error?.message);
    }
}
