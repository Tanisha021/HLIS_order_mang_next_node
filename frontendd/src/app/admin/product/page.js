"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductsList,deleteProductAdmin } from "@/app/store/slices/adminSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {productList,loading,error } = useSelector((state) => state.adminauth);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    console.log("token-frontend", token);
    if (!token) {
      router.push("/not-found");
      return;
    }
    dispatch(getProductsList(token));
  }, [dispatch, router]);

    const handleDelete = (productId) => {
        const token = localStorage.getItem("admin_token");
        dispatch(deleteProductAdmin({ product_id: productId, token }))
        .then(() => {
            dispatch(getProductsList(token)); 
          })
    }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
        
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
    {/* create product link */}
        <div className="mb-4 text-center">
            <Link
            href={"/admin/product/create"}
            className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
            Create Product
            </Link>
        </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productList?.length ? (
          productList.map((item) => (
            <div
              key={item.product_id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {item.image_name ? (
                <img
                  src={item.image_name}
                  alt={item.product_name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.product_name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Category: <span className="font-medium">{item.category_name || 'N/A'}</span>
                </p>
                <p className="text-sm text-gray-700 mb-3">Price: ₹{item.product_price}</p>
              </div>
                <div className="flex justify-between p-4 bg-gray-100">
                <Link href={`/admin/product/edit/${item.product_id}`} className="text-blue-500 hover:underline">

                    Edit
                    </Link>
                    <button
                    onClick={() => handleDelete(item.product_id)}
                    className="text-red-500 hover:underline"
                    >
                    Delete
                    </button>
                
            </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center col-span-full">No products available</p>
        )}
      </div>
    </div>
  );
}