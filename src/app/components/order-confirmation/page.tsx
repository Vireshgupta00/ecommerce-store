'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const OrderConfirmation = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const id = searchParams.get('orderId');
        if (id) {
            setOrderId(id);
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen flex items-center justify-center py-8 px-4">
            <div className="bg-white dark:bg-gray-900 rounded-md shadow-md p-8 max-w-md text-center">
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                    Order Confirmed!
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Thank you for your purchase. Your order has been successfully placed and will be delivered soon.
                </p>

                <div className="flex justify-center items-center gap-2 mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                        Order ID: <strong>{orderId || 'Not available'}</strong>
                    </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You will receive a confirmation email with your order details shortly.
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
