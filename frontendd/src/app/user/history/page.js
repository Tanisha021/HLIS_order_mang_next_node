"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import { viewHistory } from "@/app/store/slices/ProductSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { viewUserHistory, loading, error } = useSelector((state) => state.product);
  console.log("history", history);
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    console.log("after fetching token")
    console.log("give-token", token);
    if (!token) {
      router.push("/not-found");
      return;
    }
    dispatch(viewHistory(token));
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">User Profile</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {viewUserHistory && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p><strong>Name:</strong> {viewUserHistory.full_name}</p>
          <p><strong>Email:</strong> {viewUserHistory.email_id}</p>
          <p><strong>Phone:</strong> {viewUserHistory.country_code} {viewUserHistory.phone_number}</p>
          <p><strong>Country:</strong> {viewUserHistory.country_name}</p>
          <p><strong>About:</strong> {viewUserHistory.about || "N/A"}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <div className="grid gap-4">
        {viewUserHistory?.orders?.length > 0 ? (
            viewUserHistory.orders.map((order) => (
            <div
              key={order.order_id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Order Number:</strong> {order.order_num}</p>
              <p><strong>Subtotal:</strong> ₹{order.sub_total}</p>
              <p><strong>Shipping:</strong> ₹{order.shipping_charge}</p>
              <p><strong>Total:</strong> ₹{order.grand_total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.payment_type}</p>
              <p className="mt-2"><strong>Shipping Address:</strong></p>
              <p>{order.address_line}, {order.city}, {order.state}, {order.pincode}, {order.country}</p>
              <div className="mt-2">

              <Link href="/product" className="bg-blue-600 text-white px-4 py-2 rounded mt-8">
              Go to Products
            </Link>
            </div>
            </div>

          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
}
