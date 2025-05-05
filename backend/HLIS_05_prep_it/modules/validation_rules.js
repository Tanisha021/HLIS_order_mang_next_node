const checkValidatorRules = {

    login:{
        email_id: "required|email",
        password_: "required|string|min:6",
    },
    signUp:{
        full_name: "required|string",
        email_id: "required|email",
        password_: "required|string|min:6",
        code_id: "required",
    },
    validateOTP:{
        phone_number: "required|regex:/^[0-9]{10}$/",
        otp: "required|string",
    },
    addToCart:{
        product_id: "required|integer",
        qty: "required|integer|min:1",
    },
    placeOrder: {
        payment_type: "required|string|in:cod,debit,credit",
        address_id: "required|integer"
    },
    addDeliveryAddress:{
        address_line: "required|string",
        city: "required|string",
        state: "required|string",
        country: "required|string",
        pincode: "required|string|min:6|max:6",
    },
    updateProfile: {
        full_name: "string",
        profile_pic: "string",
        about: "string"
    },

    // ---------------ADMIN VALIDATION RULES------------------
    login_admin:{
        email_id: "required|email",
        password_: "required|string|min:6",
    },
    createProduct:{
        product_name: "required|string",
        product_price: "required|integer",
        product_description: "required|string",
        category_id: "required|integer",
    },
    editProduct:{
        product_id: "required|integer",
        product_name: "string",
        product_price: "numeric",
        product_description: "string",
    },
    deleteProduct:{
        product_id: "required|integer",
    },
    updateStatus:{
        order_id: "required|integer",
        status: "required|string|in:pending,confirmed,shipped,completed,failed",
    },


    
};

module.exports = checkValidatorRules;

