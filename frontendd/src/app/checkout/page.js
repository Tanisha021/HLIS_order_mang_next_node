"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryAddress, placeOrder } from "@/app/store/slices/ProductSlice"
import Link from "next/link";
import { login } from "../store/slices/authSlice";

export default function Checkout() {
    const router = useRouter();
    const dispatch = useDispatch();

    let {
        loading,
        error,
        deliveryAddress,
        order
    } = useSelector((state) => state.product);

    const [selectedAddress, setSelectedAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        console.log("token--andar", token)
        if (!token) {
            router.push('/user/login');
            return;
        }
        dispatch(getDeliveryAddress({token}));
    }, [dispatch, router]);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select a delivery address");
            return;
        }

        setIsPlacingOrder(true);
        const token = localStorage.getItem('user_token');
        await dispatch(placeOrder({
            payment_type: paymentMethod,
            address_id: selectedAddress,
            token
        }));
        setIsPlacingOrder(false);

        setTimeout(()=>{
            order = null;
            router.push("/product");
        }, [6000]);

    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
                <Link href="/cart" className="mt-4 text-blue-500 hover:underline">
                    Back to Cart
                </Link>
            </div>
        );
    }

    if (order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-xl mb-6">Your order number is: {order.order_num}</p>
                <p className="text-lg mb-8">Total amount: ₹{order.grand_total.toFixed(2)}</p>
                <Link 
                    href="/products" 
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Back to Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Delivery Address</h2>
                
                {deliveryAddress?.length > 0 ? (
                    <div className="space-y-3">
                        {deliveryAddress.map((address) => (
                            <div 
                                key={address.address_id} 
                                className={`p-3 border rounded-md cursor-pointer ${
                                    selectedAddress === address.address_id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200'
                                }`}
                                onClick={() => setSelectedAddress(address.address_id)}
                            >
                                <p className="font-medium">{address.address_line}</p>
                                <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} - {address.pincode}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 mb-2">
                        No delivery addresses found.
                    </div>
                )}

                <Link 
                    href="/addresses" 
                    className="mt-3 inline-block text-blue-500 hover:underline text-sm"
                >
                    + Add New Address
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="cod">Cash on Delivery</option>
                    <option value="debit">Debit Card</option>
                    <option value="credit">Credit</option>
                </select>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddress}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                    isPlacingOrder || !selectedAddress
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>
    );
}