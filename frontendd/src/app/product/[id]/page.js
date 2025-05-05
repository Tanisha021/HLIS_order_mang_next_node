"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import { useRouter, useParams } from "next/navigation";
import { viewDetails,addToCart } from "@/app/store/slices/ProductSlice";
import Link from "next/link";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const [cartLoading, setCartLoading] = useState(false);

  const productDetail = useSelector((state) => state.product.productDetails);
  console.log("productDetail", productDetail);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  
    const handle_add_to_cart = async()=>{
        const token = localStorage.getItem("user_token");
        console.log("after fetching token")
        console.log("give-token", token);
        if (!token) {
            router.push("/login");
            return;
          }
          setCartLoading(true);
          try{
            await dispatch(addToCart({product_id: productDetail.product_id,
                qty,
                token}));
            setCartLoading(false);
          }catch(error){
            console.log("error",error)
            setCartLoading(false);
          }
    }


    useEffect(() => {
        // Fetch product details when component mounts
        const fetchProductDetails = async () => {
          if (id) {
            const token = localStorage.getItem("user_token");
            if (!token) {
              router.push("/login"); // Changed to '/login' instead of '/not-found'
              return;
            }
            await dispatch(viewDetails({ id, token }));
          }
        };
        
        fetchProductDetails();
      }, [dispatch, id, router]);

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
                <Link href="/products" className="mt-4 text-blue-500 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    if (!productDetail) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-gray-500 text-xl">Product not found</div>
                <Link href="/product" className="mt-4 text-blue-500 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }
  return (
    <div>
      <h1>Product Details</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {productDetail && (
        <div className="border p-4 rounded bg-gray-200">
          <div className="flex gap-4 overflow-x-auto mb-3">
            {Array.isArray(productDetail?.images) &&
              productDetail.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:3000/public/images/${img}`}
                  alt={`Product ${index}`}
                  className="h-32 rounded"
                />
              ))}
          </div>
          <h2 className="font-medium text-lg text-black">{productDetail?.name}</h2>
          <p className="text-gray-600 mb-3">Description: {productDetail?.description}</p>
          <p className="text-gray-600 mb-3">Price: ₹{productDetail?.price}</p>


          <div className="flex items-center mb-6">
  <span className="mr-4 text-gray-700 font-medium">Quantity:</span>
  <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-300">
    <button 
      onClick={() => setQty(prev => Math.max(1, prev - 1))}
      className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
      disabled={qty <= 1}
      aria-label="Decrease quantity"
    >
      <span className="transform translate-y-[-1px]">−</span>
    </button>
    
    <div className="w-20 h-12 bg-white flex items-center justify-center text-lg font-medium text-gray-800">
      {qty}
    </div>
    
    <button 
      onClick={() => setQty(prev => prev + 1)}
      className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
      aria-label="Increase quantity"
    >
      <span className="transform translate-y-[-1px]">+</span>
    </button>
  </div>
</div>

                        <button 
                            onClick={handle_add_to_cart}
                            disabled={cartLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                                cartLoading 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
                        </button>

          <Link
            href="/product"
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm inline-block"
          >
            Go back to list
          </Link>
        </div>
      )}
    </div>
  );
}
