const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const userModel = require("../models/user-model");
const authModel = require("../models/auth-model");
const { default: localizify } = require('localizify');
const validationRules = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");
const { user_id } = require("../../../../language/en");


class User {

    async signUp(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.signUp;

        let message = {
            required: req.language.required,
            'email_id': t('email'),
            'phone_number.regex': t('mobile_number_numeric'),
            'password_.min': t('passwords_min'),
            'code_id': t('code_id'),
            'full_name': t('user_name'),
        };
    
        let keywords = {
            'email_id': t('email'),
            'phone_number.regex': t('mobile_number_numeric'),
            'password_.min': t('passwords_min'),
            'code_id': t('code_id'),
            'full_name': t('user_name'),
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await authModel.signUp(request_data);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async validateOTP(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.validateOTP;

        let message = {
            required: req.language.required,
            'phone_number.regex': t('mobile_number_numeric'),
            'otp': t('otp')
        };
    
        let keywords = {
            'phone_number.regex': t('mobile_number_numeric'),
            'otp': t('otp')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await authModel.validateOTP(request_data);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async login(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.login;

        let message={
            required: req.language.required,
            email: t('email'),
            'password_.min': t('passwords_min')
        }

        let keywords={
            'email_id': t('rest_keywords_email_id'),
            'password_':t('rest_keywords_password')
        }
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await authModel.login(request_data);

            return common.response(res, responseData);
        }catch(error){
            console.error("Error in login:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }

    }
    async logout(req, res) {
        try {
            const user_id = req.owner_id;
            console.log("User ID in controller:", user_id);
            const responseData = await authModel.logout(user_id);
    
            return common.response(res, responseData);
        } catch (error) {
            console.error("Error in logout:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async getProductsList(req, res) {
        try {
            const responseData = await userModel.getProductsList();
    
            return common.response(res, responseData);
    
        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async getProductById(req, res) {
        // let requested_data = req.body;
        const { id } = req.params
        if (!id) {
            return common.response(res, {
                code: response_code.BAD_REQUEST,
                message: t('blog_id_required')
            });
        }
        try { 
            const responseData = await userModel.getProductById(id);  
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async itemFiltering(req, res) {    
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.itemFiltering;

        let message = {
            required: req.language.required,
        };
    
        let keywords = {
        }; 

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        
        const responseData = await userModel.itemFiltering(request_data);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async getCategoryList(req, res) {
        try {
            const responseData = await userModel.getCategoryList();
    
            return common.response(res, responseData);
    
        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async addToCart(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.addToCart;

        let message = {
            required: req.language.required,
            'product_id': t('product_id'),
            'qty': t('qty'),
        };
    
        let keywords = {
            'product_id': t('product_id'),
            'qty': t('qty'),
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.addToCart(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async getCartItems(req, res) {
        try{
         
        const user_id = req.owner_id;
        const responseData = await userModel.getCartItems(user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    

    async placeOrder(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.placeOrder;

        let message = {
            required: req.language.required,
            integer: t('must_be_integer'),
            string: t('must_be_string'),
            in: t('invalid_value_provided'),
            min: t('minimum_value_required')
        };
    
        let keywords = {
            'payment_type': t('rest_keywords_payment_type'),
            'address_id': t('rest_keywords_address_id')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.placeOrder(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async addDeliveryAddress(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.addDeliveryAddress;
          
        let message = {
            required: req.language.required,
            integer: t('must_be_integer'),
            string: t('must_be_string'),
            "address_line": t('address_line'),
            "city": t('city'),
            "state": t('state'),
            "country": t('country'),
            "pincode": t('pincode'),
            "min": t('minimum_value_required'),
            "max": t('maximum_value_required')

        };
    
        let keywords = {
            "address_line": t('address_line'),
            "city": t('city'),
            "state": t('state'),
            "country": t('country'),
            "pincode": t('pincode'),
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.addDeliveryAddress(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async getUserInfo(req, res) {
        try{
        const user_id = req.owner_id;
        const responseData = await userModel.getUserInfo(user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async get_delivery_address(req, res) {
        try{
        const user_id = req.owner_id;
        const responseData = await userModel.get_delivery_address(user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    async updateProfile(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.updateProfile;
          
        let message = {
            required: req.language.required,
            string: t('must_be_string')
        };
    
        let keywords = {
            'full_name': t('rest_keywords_full_name'),
            'about': t('rest_keywords_about'),
            'profile_pic': t('rest_keywords_profile_pic')
        };

        const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
        console.log("Valid",valid);
        if (!valid) return;
        const user_id = req.owner_id;
        const responseData = await userModel.updateProfile(request_data,user_id);
        return common.response(res, responseData);

        }catch(error){
            console.error("Error in signup:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }
    

    // async createBlog(req, res) {
    //     let requested_data = req.body;
    //     try { 
    //         const request_data = common.decrypt(requested_data);
    //         const rules = validationRules.createBlog

    //         let message = {
    //             required: req.language.required,
    //             required: t('required'),
    //             title: t('title'),
    //             content: t('content'),
    //         }

    //         let keywords = {
    //             title: t('title'),
    //             content: t('content'),
    //         }

    //         const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);

    //         if (!valid) return;

    //         const responseData = await userModel.createBlog(request_data);

    //         // Send response
    //         return common.response(res, responseData);
    //     } catch (error) {
    //         return common.response(res, {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('rest_keywords_something_went_wrong') + error
    //         });
    //     }
    // }

    // async deleteBlog(req, res) {
    //     let requested_data = req.body;
    //     try { 
    //         const request_data = common.decrypt(requested_data);
    //         const rules = validationRules.deleteBlog

    //         const valid = middleware.checkValidationRules(req, res, request_data, rules)
    //         if (!valid) return;
    //         const responseData = await userModel.deleteBlog(request_data);
    //         return common.response(res, responseData);

    //     } catch (error) {
    //         return common.response(res, {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('rest_keywords_something_went_wrong') + error
    //         });
    //     }
    // }

    // async updateBlog(req, res) {
    //     const { id } = req.params
    //     const requested_data = req.body;
    //     if (!id) {
    //         return common.response(res, {
    //             code: response_code.BAD_REQUEST,
    //             message: t('blog_id_required')
    //         });
    //     }
    //     try { 
    //         const request_data = common.decrypt(requested_data);

    //         const rules = validationRules.updateBlog;

    //         const valid = middleware.checkValidationRules(req, res, request_data, rules)
    //         console.log("Valid", valid);
    //         if (!valid) return;
    //         const responseData = await userModel.updateBlog(request_data,id);
    //         return common.response(res, responseData);

    //     } catch (error) {
    //         return common.response(res, {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('rest_keywords_something_went_wrong') + error
    //         });
    //     }
    // }

    // async getTags(req, res) {
    //     let requested_data = req.body;
    //     try { 
    //         const request_data = common.decrypt(requested_data);
    //         const rules = validationRules.getTags

    //         const valid = middleware.checkValidationRules(req, res, request_data, rules)
    //         if (!valid) return;
    //         const responseData = await userModel.getTags(request_data);
    //         return common.response(res, responseData);

    //     } catch (error) {
    //         return common.response(res, {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('rest_keywords_something_went_wrong') + error
    //         });
    //     }
    // }

};
module.exports = new User();
