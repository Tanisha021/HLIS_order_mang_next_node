"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { adminlogin } from "@/app/store/slices/adminSlice";
import { useState } from "react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.adminauth);
    console.log("Auth state:", authState); 
    console.log("Auth state error:", authState.error);
    console.log("Auth state loading:", authState.loading);
    console.log("Auth state token:", authState.token);
  const formik = useFormik({
    initialValues: {
      email_id: "",
      password_: "",
    },
    validationSchema: Yup.object({
      email_id: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password_: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const result = await dispatch(adminlogin(values));
        console.log("Login result:", result);
        console.log("Login payload:", result.payload);
        console.log("Login meta:", result.meta.requestStatus);
        if (result.meta.requestStatus === "fulfilled" && result.payload?.code === 200) {
          router.push("/admin"); 
        } else {
          console.error("Login failed:", result.payload?.message);
        }
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email_id"
            placeholder="Enter your email"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email_id}
          />
          {formik.touched.email_id && formik.errors.email_id && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email_id}</div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password_"
            placeholder="Enter your password"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password_}
          />
          {formik.touched.password_ && formik.errors.password_ && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password_}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {authState.error && (
          <div className="text-red-500 text-sm text-center mt-2">
            {authState.error}
          </div>
        )}
      </form>
    </div>
  );
}
