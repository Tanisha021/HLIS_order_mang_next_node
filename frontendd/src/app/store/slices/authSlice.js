import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { secureAxios } from "@/app/utilities/secureFetch";

export const signUp = createAsyncThunk('auth/signUp', async (data, { rejectWithValue }) => {
    try {
        const { email_id, phone_number, password_, code_id, full_name } = data;

        const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
        const url = "http://localhost:3000/v1/user/signup";

        const userData = { email_id, phone_number, password_, code_id, full_name };
        const response = await secureAxios(url, userData, 'POST', api_key);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
        const url = "http://localhost:3000/v1/user/login";

        
        const response = await secureAxios(url, data, 'POST', api_key);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const logoutUser = createAsyncThunk('auth/logout', async (token) => {
    console.log("here");
    console.log("token",token)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/logout";

    const response = await secureAxios(url, {}, 'POST', api_key, token);
    console.log("response",response)
    return response

});

const initialState = {
    user: null,
    token:null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;

                if(action.payload?.code==200){
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    state.error = null;
                    localStorage.setItem("user_token", action.payload.data.user_token);
                }
                else{
                    state.user = null;
                    state.token = null;
                    state.error = action.payload.message;
                }
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    state.error = null;
                    localStorage.setItem("user_token", action.payload.data.user_token);
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload.message;
                }
            })
            .addCase(login.rejected, (state, action) => {
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
                    state.user = null;
                    state.error = null
                    localStorage.removeItem("user_token");
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Still remove user data even if API call fails
                state.user = null;
                state.token = null;
                localStorage.removeItem("user_token");
            })
    },
});


export default authSlice.reducer;
