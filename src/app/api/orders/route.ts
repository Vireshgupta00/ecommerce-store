import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import Order from '@/models/Order';
import Product from '@/models/Product';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/connect-db';
import { updateProductQuantity } from '@/lib/services/productService';

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { items, shippingAddress,total,user } = await req.json();
    console.log("Received order data:", JSON.stringify({ items, shippingAddress }, null, 2));

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid or empty items array");
    }

    const orderItems = await Promise.all(items.map(async (item: any, index: number) => {
      console.log(`Processing item ${index}:`, JSON.stringify(item, null, 2));
      
      if (!item.productId) {
        throw new Error(`Missing productId for item at index ${index}. Item: ${JSON.stringify(item)}`);
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      console.log(item+"item.sizeid");
      await updateProductQuantity(item.productId, JSON.parse(item.size).id, item.quantity);
      return {
        product: item.productId,
        quantity: item.quantity,
        size: JSON.parse(item.size).id,
      };
    }));

    console.log("Processed order items:", orderItems);

    const order = new Order({
      user: user,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'cod',
      total: total,
    });
    console.log(order,"order");

    await order.save();

    return new Response(JSON.stringify({ message: "Order created successfully", orderId: order._id }), { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return new Response(JSON.stringify({ error: "Failed to create order", details: error.message }), { status: 400 });
  }
}
