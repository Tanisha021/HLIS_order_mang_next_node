"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import { viewCart } from "@/app/store/slices/ProductSlice"; 
import { useRouter } from "next/navigation";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();
    const cartItems = useSelector((state) =>  state.product.cartItems);
  const { loading, error } = useSelector((state) => state.product);
  console.log("cartItems", cartItems);
//   console.log("cartItems", cartItems.length);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token ) {
      router.push("/not-found");
      return;
    }
    dispatch(viewCart({token }));
  }, [dispatch]);

  const grandTotal = cartItems?.reduce((acc, item) => acc + item.total_price, 0);
//   grandtotal to flaot 2
    const grandTotalFloat = parseFloat(grandTotal).toFixed(2);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {cartItems?.length ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cart_id}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-black">{item.product_name}</h2>
                <p className="text-sm text-gray-600">Price: ₹{item.product_price}</p>
                <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-800 font-medium">
                  Total: ₹{item.total_price}
                </p>
              </div>
            </div>
          ))}

          <Link
            href="/checkout"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Proceed to Checkout
          </Link>
          <div className="text-right font-semibold text-xl">
            Grand Total: ₹{grandTotalFloat}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center">
            <p className="mb-4">Your cart is empty.</p>
            <Link href="/product" className="bg-blue-600 text-white px-4 py-2 rounded">
              Go to Products
            </Link>
          </div>
        )
      )}
    </div>
  );
}
