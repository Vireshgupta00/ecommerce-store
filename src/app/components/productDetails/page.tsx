'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSingleProduct } from "@/redux/slices/productSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductDetails = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams?.get('id');
    const { singleProductState: { loading, data: product } } = useAppSelector((state) => state.product);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        if (productId) {
            dispatch(fetchSingleProduct(productId));
        }
    }, [dispatch, productId]);

    const handleAddToCart = () => {
        if (!product || !selectedSize) {
            alert("Please select a size before adding to cart");
            return;
        }

        const cartItem = {
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1
        };
        console.log('cartitem', cartItem)
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = cart.findIndex((item: any) => item.id === cartItem.id && item.size === cartItem.size);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert("Item added to cart");
        router.push('/components/cart');
    };

    const handleBuyNow = () => {
        const isAuthenticated = false;
        if (isAuthenticated) {
            router.push('/components/checkout');
        } else {
            router.push('/components/login');
        }
    };

    if (loading || !product) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        <div className="h-[400px] w-[400px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                            <img className="w-full h-full object-cover rounded-lg" src={product.image![0].path} alt={product.name} />
                        </div>
                    </div>
                    <div className="md:flex-1 px-4">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {product.description}
                        </p>
                        <div className="flex mb-4">
                            <div className="mr-4">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Select Size:</span>
                            <div className="flex items-center mt-2">
                                <select 
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-white"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="">Select a size</option>
                                    {product.sizeOptions!.map((size) => (
                                        <option key={size._id} value={JSON.stringify({ id: size._id, size: size.size })}>
                                            {size.size} - {size.quantity} available
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex -mx-2 mb-4">
                            <div className="w-1/2 px-2">
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700 transition duration-300"
                                >
                                    Add to Cart
                                </button>
                            </div>
                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
