"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductsList, getCategories, filterProducts } from "@/app/store/slices/ProductSlice";
import { logoutUser } from "@/app/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, loading, error, categories, filteredItems } = useSelector((state) => state.product);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [currentFilters, setCurrentFilters] = useState({
    search: "",
    category: "",
    max_price: ""
  });
 
  const displayProducts = filtersApplied && filteredItems ? filteredItems : products;

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    console.log("token-frontend", token);
    if (!token) {
      router.push("/not-found");
      return;
    }
    dispatch(getProductsList(token));
    dispatch(getCategories(token));
  }, [dispatch, router]);

  const handleFilterChange = (filterType, value) => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    const updatedFilters = {
      ...currentFilters,
      [filterType]: value
    };

    const categoryArray = updatedFilters.category && updatedFilters.category !== "" 
      ? [parseInt(updatedFilters.category)] 
      : [];

    setCurrentFilters(updatedFilters);

    setFiltersApplied(true);

    dispatch(filterProducts({
      search: updatedFilters.search,
      category: categoryArray,
      max_price: updatedFilters.max_price,
      token
    }));
  };

  const resetFilters = () => {
    setFiltersApplied(false);
    setCurrentFilters({
      search: "",
      category: "",
      max_price: ""
    });
    
    const token = localStorage.getItem("user_token");
    if (token) {
      dispatch(getProductsList(token));
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("user_token");
    if (token) {
      await dispatch(logoutUser(token));
      router.push("/user/login");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
      <div className="flex gap-3 mb-4">
        <Link
          href={"/cart"}
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          View Cart
        </Link>
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
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold">Filter Products</h2>
          {filtersApplied && (
            <button 
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <select
          value={currentFilters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border rounded p-2 flex-grow md:flex-grow-0"
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search..."
          value={currentFilters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="border rounded p-2 flex-grow md:flex-grow-0"
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={currentFilters.max_price}
          onChange={(e) => handleFilterChange("max_price", e.target.value)}
          className="border rounded p-2 flex-grow md:flex-grow-0"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayProducts?.length ? (
          displayProducts.map((item) => (
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
                <Link
                  href={`/product/${item.product_id}`}
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  View Details
                </Link>
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