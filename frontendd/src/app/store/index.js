import { configureStore } from "@reduxjs/toolkit";

import ProductRedeucer from "@/app/store/slices/ProductSlice";
import AuthReducer from "@/app/store/slices/authSlice";
import AdminReducer from "@/app/store/slices/adminSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      product: ProductRedeucer,
      auth: AuthReducer,
      adminauth: AdminReducer,
    },
  });
}