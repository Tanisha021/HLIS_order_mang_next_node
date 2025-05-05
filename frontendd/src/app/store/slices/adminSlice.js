import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { secureAxios } from "@/app/utilities/secureFetch";


export const adminlogin = createAsyncThunk('auth/adminlogin', async (data, { rejectWithValue }) => {
    try {
        const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
        const url = "http://localhost:3000/v1/admin/login";

        
        const response = await secureAxios(url, data, 'POST', api_key);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateStatusShipping = createAsyncThunk('auth/updateStatusShipping', async (request_data) => {
    const { order_id, status, token } = request_data;
    console.log("token1 update ",token)
    console.log("request_data--updateStatsu",request_data)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/admin/update-status`;
    const send_data = { order_id, status };
    const response = await secureAxios(url,send_data,'POST',api_key,token)
    console.log("response",response)
    return response
});

export const showOrdersAdmin = createAsyncThunk('auth/showOrdersAdmin', async (token) => {
    console.log("token1",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/admin/show-orders`;
    const data = {}
    const response = await secureAxios(url,data,'GET',api_key,token)
    console.log("response",response)
    return response 

});
export const getProductsList = createAsyncThunk('product/getProductsList', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/admin/product-listing";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response

});

export const getCategories = createAsyncThunk('product/getCategories', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-category-list";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response

});

export const deleteProductAdmin = createAsyncThunk('auth/deleteProduct', async (request_data) => {
    const { product_id, token } = request_data;
    
    console.log("request_data--deleteProduct",request_data)
    console.log("product_id",product_id)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/admin/delete-product";
    const send_data = {
        product_id
    }
    const response = await secureAxios(url,send_data,'POST',api_key,token)
    console.log("response",response)
    return response
    
});
export const editProductDetails = createAsyncThunk('auth/editProduct',async(request_data)=>{
    const {product_id,product_name, product_description,product_price,token} = request_data;
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/admin/edit-product`;
    const data={
        product_id,product_name, product_description,product_price
    }

    const response = await secureAxios(url,data,'POST',api_key,token)
    return response;
})

export const logoutUser = createAsyncThunk('product/logout', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/admin/logout";

    const response = await secureAxios(url, {}, 'POST', api_key, token);
    console.log("response",response)
    return response

});
export const viewDetails = createAsyncThunk('product/viewDetails', async ({id,token}) => {

    console.log("id",id)
    console.log("tokennn-viewDeatl",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/get-product-details/${id}`;
    const data = {}
    const response = await secureAxios(url,data,'POST',api_key,token)
    console.log("response",response)
    return response

});
export const createProduct = createAsyncThunk('product/createProduct', async (request_data) => {
    const {token, product_name,product_price,product_description,image_link,category_id} = request_data;
    console.log("requated",product_name)
    const send_data = {
        product_name,product_price,product_description,image_link,category_id
    }
    console.log("here");
    console.log("send data: ",send_data);
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/admin/create-product`;
    const response = await secureAxios(url,send_data,'POST',api_key,token)
    console.log("response",response)
    return response

});

const initialState = {
    admin: null,
    token:null,
    loading: false,
    error: null,
    orderList: null,
    productList: null,
    categories: null,
    productDetails: null,
    created_order:null
};

const adminSlice = createSlice({
    name: "adminauth",
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            
            .addCase(adminlogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminlogin.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.admin = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    state.error = null;
                    localStorage.setItem("admin_token", action.payload.data.user_token);
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload.message;
                }
            })
            .addCase(adminlogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.admin = null;
                    state.error = null
                    localStorage.removeItem("admin_token");
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.admin = null;
                state.token = null; 
            })
            .addCase(showOrdersAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(showOrdersAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.orderList = action.payload.data;
                if (action.payload?.code === 200) {
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })

            .addCase(showOrdersAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateStatusShipping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStatusShipping.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    console.log("action.payload",action.payload)
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(updateStatusShipping.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProductsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductsList.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.productList = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(getProductsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProductAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductAdmin.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action.payload --delte",action.payload)
                if (action.payload?.code === 200) {
                    state.productList = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(deleteProductAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action.payload --edit",action.payload)
                if (action.payload?.code === 200) {
                    state.productList = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(editProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.categories = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(viewDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(viewDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    console.log("action.payload --view",action.payload)
                    // state.productDetails = action.payload.data;
                    // console.log("state.productDetails",state.productDetails)
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(viewDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    console.log("action.payload --create",action.payload)
                    state.created_order = action.payload.data;
                    state.error = null;
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            


    },
});


export default adminSlice.reducer;
