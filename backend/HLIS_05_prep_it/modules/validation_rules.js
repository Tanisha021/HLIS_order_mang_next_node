const checkValidatorRules = {

    signUp:{
        full_name: "required|string",
        email_id: "required|email",
        password_: "required|string|min:6",
        code_id: "required",
    },
    validateOTP:{
        phone_number: "required|regex:/^[0-9]{10}$/",
        otp: "required|string",
    }
    
};

module.exports = checkValidatorRules;

