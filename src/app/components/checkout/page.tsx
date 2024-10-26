'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  size: {
    id: string;
    size: string;
  };
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    if (!item.id) {
      console.error('Attempted to add item without id to cart:', item);
      return;
    }
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: string | number) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return { cart, addToCart, removeFromCart, clearCart, calculateTotal };
};

const Checkout = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { cart, clearCart, calculateTotal } = useCart();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
        },
        phone: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(calculateTotal());
    }, [cart, calculateTotal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as object),
                    [child]: value
                }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log("Cart contents:", cart);

            const orderItems = cart.map(item => ({
                productId: item.id?.toString(),
                quantity: item.quantity,
                size: item.size,
                price: item.price
            }));

            console.log("Prepared orderItems:", orderItems);

            const orderData = {
                user: session?.user?.id,
                items: orderItems,
                shippingAddress: formData.address,
                total: total,
                paymentMethod: 'cod',
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone
            };

            console.log("Order data being sent:", JSON.stringify(orderData, null, 2));

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Order submission failed');
            }

            const data = await response.json();
            clearCart();
            console.log(data,"data");
            router.push(`order-confirmation?orderId=${data.orderId}`);
        } catch (error) {
            console.error('Error submitting order:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
            if (error instanceof Response) {
                error.text().then(text => console.error('Response text:', text));
            }
            alert(error instanceof Error ? error.message : 'There was an error placing your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Checkout</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Street Address
                        </label>
                        <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Enter your street address"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                City
                            </label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter your city"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                State
                            </label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter your state"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Country
                            </label>
                            <input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter your country"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter your zip code"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Payment Mode
                        </h3>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="cod"
                                name="payment"
                                value="cod"
                                defaultChecked
                                className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 dark:border-gray-700"
                            />
                            <label htmlFor="cod" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cash on Delivery (COD)
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Order Summary
                        </h3>
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between text-gray-700 dark:text-gray-300">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-gray-800 dark:text-white font-semibold mt-2">
                            <span>Total:</span>
                            <span>₹{total}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting ? "Placing Order..." : "Place Order"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
