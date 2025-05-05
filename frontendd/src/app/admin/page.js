"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { showOrdersAdmin,updateStatusShipping } from "../store/slices/adminSlice";
// import { logoutUser } from "@/app/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Admin() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {orderList, loading, error} = useSelector((state) => state.adminauth);
    console.log("orderList-------", orderList);
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    console.log("token-frontend", token);
    if (!token) {
      router.push("/not-found");
      return;
    }
    dispatch(showOrdersAdmin(token));
  }, [dispatch, router]);

  const handleStatusChange = (order_id, newStatus) => {
    const token = localStorage.getItem("admin_token");
    dispatch(updateStatusShipping({ order_id, status: newStatus, token }))
      .then(() => {
        dispatch(showOrdersAdmin(token)); 
      });
  };
  
  const handleLogout = async () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      await dispatch(logoutUser(token));
      router.push("/user/login");
    }
  };
  const statusOptions = ['pending', 'confirmed', 'shipped', 'completed', 'failed'];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Show  Orders</h1>
      <div className="flex gap-3 mb-4">
        <Link
          href={"/admin/product"}
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          View Products
        </Link> 
        {/* 
        <Link
          href={"/user/history"}
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          View History
        </Link>
        <button
          onClick={handleLogout}
          className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button> */}
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="overflow-x-auto">
  {orderList?.length ? (
    <table className="min-w-full bg-white border rounded-lg">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-3 border">Order ID</th>
          <th className="p-3 border">Order Number</th>
          <th className="p-3 border">Status</th>
          <th className="p-3 border">Total (₹)</th>
          <th className="p-3 border">Payment Type</th>
          <th className="p-3 border">Customer</th>
          <th className="p-3 border">Address</th>
        </tr>
      </thead>
      <tbody>
        {orderList.map((order) => (
          <tr key={order.order_id} className="border-t hover:bg-gray-50">
            <td className="p-3 border">{order.order_id}</td>
            <td className="p-3 border">{order.order_num || "N/A"}</td>
            {/* <td className="p-3 border capitalize">{order.status}</td> */}
            <td className="p-3 border">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
            <td className="p-3 border">{order.grand_total}</td>
            <td className="p-3 border uppercase">{order.payment_type}</td>
            <td className="p-3 border">{order.full_name} <br /><span className="text-xs text-gray-500">{order.email_id}</span></td>
            <td className="p-3 border">
              {order.address_line}, {order.city}, {order.state} - {order.pincode}, {order.country}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    !loading && <p className="text-center mt-4">No orders available</p>
  )}
</div>

    </div>
  );
}