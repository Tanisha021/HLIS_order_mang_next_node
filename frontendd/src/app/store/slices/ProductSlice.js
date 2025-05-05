import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { secureAxios } from "@/app/utilities/secureFetch";
export const getProductsList = createAsyncThunk('product/getProductsList', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-products-list";

    const response = await secureAxios(url, {}, 'GET', api_key, token);
    console.log("response",response)
    return response

});

export const viewDetails = createAsyncThunk('product/viewDetails', async ({id,token}) => {
    console.log("idd",id)
    console.log("token1",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/get-product-details/${id}`;
    const data = {}
    const response = await secureAxios(url,data,'POST',api_key,token)
    console.log("response",response)
    return response

});
export const addToCart = createAsyncThunk('product/addToCart', async ({product_id,qty,token}) => {
    // console.log("idd",id)
    console.log("token1",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/add-to-cart`;
    const data = {
        product_id: product_id,
        qty: qty
    }
    const response = await secureAxios(url,data,'POST',api_key,token)
    console.log("response",response)
    return response

});

export const viewCart = createAsyncThunk('product/viewCart', async ({token}) => {
    console.log("token1",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/get-cart-items`;
    const data = {}
    const response = await secureAxios(url,data,'GET',api_key,token)
    console.log("response",response)
    return response

});
export const getDeliveryAddress = createAsyncThunk('product/getDeliveryAddress', async ({token}) => {
    console.log("token11",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/get-delivery-address`;
    const data = {}
    const response = await secureAxios(url,data,'GET',api_key,token)
    console.log("response",response)
    return response

});
export const placeOrder = createAsyncThunk('product/placeOrder', async ({ payment_type, address_id, token}) => {
    // console.log("idd",id)
    console.log("token1",token)

    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/place-order`;
     const request_data = {
        payment_type,
        address_id
    };
    const response = await secureAxios(url,request_data,'POST',api_key,token)
    console.log("response",response)
    return response
});

export const viewHistory = createAsyncThunk('product/viewHistory', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/get-user-info";

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

export const filterProducts = createAsyncThunk('product/filterProducts', async (filtersToApply) => {
    // console.log("idd",id)
    const { token } = filtersToApply;
    console.log("token1",token)

    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/products-filter`;
    const categoryArray = Array.isArray(filtersToApply.category) 
        ? filtersToApply.category 
        : (filtersToApply.category ? [filtersToApply.category] : []);
    
    const filters = {
        search: filtersToApply.search.trim(),
        category:categoryArray,
        price_range: filtersToApply.max_price ? [0, Number(filtersToApply.max_price)] : null,
        page: 1
    }
    console.log("filters--",filters)
    const response = await secureAxios(url,filters,'POST',api_key,token)
    console.log("response",response)
    return response

});


const initialState = {
    products: [],
    productDetails: null,
    cart:null,
    cartItems: null,
    deliveryAddress: null,
    order: null,
    viewUserHistory: null,
    loading: false,
    error: null,
    categories: null,
    filters: {
        search: "",
        category: [],
        max_price: null,
        price_range: null,
        page: 1
    },
    filteredItems: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductsList.pending, (state) => {
                state.loading = true;
                console.log("loading")
            })
            .addCase(getProductsList.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data;
                console.log("products==",action.payload.data)
            })
            .addCase(getProductsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log("error",action.error.message)
            })
            .addCase(viewDetails.pending, (state) => {
                        state.loading = true;
                    })
            .addCase(viewDetails.fulfilled, (state, action) => {
                        state.loading = false;
                        state.productDetails = action.payload.data;
                        console.log("productDetails==",action.payload.data)
                    })

                    .addCase(viewDetails.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                    })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
                console.log("cart==",action.payload.data)
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(viewCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(viewCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.data;
                console.log("cartItems==",action.payload.data)
            })
            .addCase(viewCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getDeliveryAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDeliveryAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveryAddress = action.payload.data;
                console.log("deliveryAddress==",action.payload.data)
            })
            .addCase(getDeliveryAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(placeOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.data;
                console.log("order==",action.payload.data)
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(viewHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(viewHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.viewUserHistory = action.payload.data;
                console.log("viewUserHistory==",action.payload.data)
            })
            .addCase(viewHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data;
                console.log("categories==",action.payload.data)
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(filterProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(filterProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredItems = action.payload.data;
                console.log("filterProducts==",action.payload.data)
            })
            .addCase(filterProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

    }
});

export default productSlice.reducer;
