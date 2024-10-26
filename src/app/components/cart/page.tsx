'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Cart = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const handleQuantityChange = (id: number, sizeObj: { id: string, size: string }, quantity: number) => {
        setCartItems((prev: any) =>
            prev.map((item: any) =>
                item.id === id && item.size.id === sizeObj.id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
        updateLocalStorage(cartItems);
    };

    const handleRemove = (id: number, sizeObj: { id: string, size: string }) => {
        const updatedCart = cartItems.filter((item: any) => !(item.id === id && item.size.id === sizeObj.id));
        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
    };

    const totalPrice = cartItems.reduce(
        (total: any, item: any) => total + item.price * item.quantity,
        0
    );

    const updateLocalStorage = (cart: any[]) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };
console.log('cartitems',cartItems)
    const handleCheckout = () => {
        if (status === "authenticated") {
            router.push("checkout");
        } else {
            router.push("/login?redirect=checkout");
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-300">
                        <p>Your cart is empty.</p>
                        <button
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={() => router.push("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cartItems.map((item: any) => (
                                console.log(item.size.id, "item.size.id"),
                                <div
                                    key={`${item.id}-${item.size.id}`}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={item.image[0].path}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg mr-4"
                                        />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {item.name}
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400">
                                            ₹{item.price.toFixed(2)}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Size: {JSON.parse(item.size).size}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                                                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-l"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 bg-gray-100 dark:bg-gray-700">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                                                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-r"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.id, item.size)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Total: ${totalPrice.toFixed(2)}
                            </h2>
                            <div className="space-x-4">
                                <button
                                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                                    onClick={() => router.push("/")}
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
