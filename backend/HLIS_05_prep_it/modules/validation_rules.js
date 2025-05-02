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
    }

    
};

module.exports = checkValidatorRules;

