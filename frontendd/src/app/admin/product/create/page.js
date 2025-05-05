"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getCategories } from "@/app/store/slices/adminSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const ProductSchema = yup.object().shape({
    product_name: yup.string().required("Product name is required"),
    product_price: yup.number().required("Price is required").positive("Price must be positive"),
    product_description: yup.string().required("Description is required"),
    category_id: yup.number().required("Category is required"),
    image_link: yup.string().required("Image name is required"),
  });

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, created_order, categories } = useSelector((state) => state.adminauth);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    console.log('Categories data:', categories);
  }, [categories]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAdminToken(token);
      dispatch(getCategories(token));
    }
  }, [router, dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("values",values)
    const submissionData = {
        ...values,
        category_id: Number(values.category_id),
        token: adminToken
      };
      await dispatch(createProduct(submissionData));
    setSubmitting(false);
    resetForm();
    router.refresh();
    router.push("/admin/product");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>

      <Formik
        initialValues={{
          product_name: "",
          product_price: "",
          product_description: "",
          category_id: "",
          image_link: "",
        }}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <Field name="product_name" className="border p-2 w-full rounded" />
              <ErrorMessage name="product_name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <Field name="product_price" type="number" className="border p-2 w-full rounded" />
              <ErrorMessage name="product_price" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Field as="textarea" name="product_description" className="border p-2 w-full rounded" />
              <ErrorMessage name="product_description" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Field as="select" name="category_id" className="border p-2 w-full rounded">
                <option value="">-- Select Category --</option>
                {categories?.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category_id" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Image Name</label>
              <Field name="image_link" className="border p-2 w-full rounded" />
              <ErrorMessage name="image_link" component="div" className="text-red-500 text-sm" />
            </div>

            {error && <div className="text-red-500">{error}</div>}
            {created_order && <div className="text-green-600">Product created successfully!</div>}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting || loading ? "Creating..." : "Create Product"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}