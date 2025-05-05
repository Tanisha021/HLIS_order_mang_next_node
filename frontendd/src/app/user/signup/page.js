"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "@/app/store/slices/authSlice"; 

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const signupError = useSelector((state) => state.auth.error);
  const signupLoading = useSelector((state) => state.auth.loading);

  const formik = useFormik({
    initialValues: {
      email_id: "",
      phone_number: "",
      password_: "",
      full_name: "",
      code_id: "", 
    },
    validationSchema: Yup.object({
      email_id: Yup.string().email("Invalid email").required("Email is required"),
      phone_number: Yup.string().required("Phone number is required"),
      password_: Yup.string().min(6).required("Password is required"),
      full_name: Yup.string().required("Full name is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setLoading(true);
        const result = await dispatch(signUp(values));
        console.log("resutl",result)
        if (result.meta.requestStatus === "fulfilled") {
        //   const { user_token } = result.payload;
        //   if (user_token) {
        //     localStorage.setItem("user_token", user_token);
        //   }
          resetForm();
          router.push("/"); 
        } else {
          console.error("Signup failed:", result.payload);
        }
      } catch (err) {
        console.error("Signup Error:", err);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.full_name}
          />
          {formik.touched.full_name && formik.errors.full_name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.full_name}</div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email_id"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email_id}
          />
          {formik.touched.email_id && formik.errors.email_id && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email_id}</div>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone_number}
          />
          {formik.touched.phone_number && formik.errors.phone_number && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phone_number}</div>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password_"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password_}
          />
          {formik.touched.password_ && formik.errors.password_ && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password_}</div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Code ID</label>
          <input
            type="text"
            name="code_id"
            className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.code_id}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          {loading || signupLoading ? "Signing Up..." : "Sign Up"}
        </button>

        {signupError && (
          <div className="text-red-500 text-center mt-3">{signupError}</div>
        )}
      </form>
    </div>
  );
}
