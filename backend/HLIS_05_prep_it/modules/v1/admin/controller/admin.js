const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const adminModel = require("../models/admin-model");
// const authModel = require("../models/auth-model");
const Validator = require('Validator')
const {default: localizify} = require('localizify');
const validationRules  = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");
const { item_id } = require("../../../../language/en");

class Admin {
    async login_admin(req, res) {
        let requested_data = req.body;
        try{
            const request_data = common.decrypt(requested_data);
        const rules = validationRules.login_admin;

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
            
            const responseData = await adminModel.login_admin(request_data);

            return common.response(res, responseData);
        }catch(error){
            console.error("Error in login:", error);
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }

    }

      async createProduct(req, res) {
          let requested_data = req.body;
          try{
              const request_data = common.decrypt(requested_data);
              const rules = validationRules.createProduct;
  
          let message = {
              required: req.language.required,
                product_name: t('product_name'),
                product_price: t('product_price'),
                product_description: t('product_description'),
                category_id: t('category_id')
          };
      
          let keywords = {
                product_name: t('product_name'),
                product_price: t('product_price'),
                product_description: t('product_description'),
                category_id: t('category_id')
          };
  
          const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
          console.log("Valid",valid);
          if (!valid) return;
          
          const responseData = await adminModel.createProduct(request_data);
          return common.response(res, responseData);
  
          }catch(error){
              console.error("Error in signup:", error);
              return common.response(res, {
                  code: response_code.OPERATION_FAILED,
                  message: t('rest_keywords_something_went_wrong') + error
              });
          }
      }

      async editProduct(req, res) {
          let requested_data = req.body;
          try{
              const request_data = common.decrypt(requested_data);
              const rules = validationRules.editProduct;
  
          let message = {
              required: req.language.required,
              string: t('must_be_string'),
              numeric: t('must_be_numeric')
          };
      
          let keywords = {
                'product_name': t('rest_keywords_product_name'),
                'product_price': t('rest_keywords_product_price'),
                'product_description': t('rest_keywords_product_description')
          };
  
          const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
          console.log("Valid",valid);
          if (!valid) return;
          
          const responseData = await adminModel.editProduct(request_data);
          return common.response(res, responseData);
  
          }catch(error){
              console.error("Error in signup:", error);
              return common.response(res, {
                  code: response_code.OPERATION_FAILED,
                  message: t('rest_keywords_something_went_wrong') + error
              });
          }
      }
      async deleteProduct(req, res) {
          let requested_data = req.body;
          try{
              const request_data = common.decrypt(requested_data);
              const rules = validationRules.deleteProduct;
  
          let message = {
              required: req.language.required,
                integer: t('must_be_integer')

          };
      
          let keywords = {
              "product_id": t('rest_keywords_product_id')
          };
  
          const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
          console.log("Valid",valid);
          if (!valid) return;
          
          const responseData = await adminModel.deleteProduct(request_data);
          return common.response(res, responseData);
  
          }catch(error){
              console.error("Error in signup:", error);
              return common.response(res, {
                  code: response_code.OPERATION_FAILED,
                  message: t('rest_keywords_something_went_wrong') + error
              });
          }
      }

          async productListing(req, res) {
            let requested_data = req.body;
            try{
                const request_data = common.decrypt(requested_data);
                  const responseData = await adminModel.productListing(request_data);
          
                  return common.response(res, responseData);
          
              } catch (error) {
                  return common.response(res, {
                      code: response_code.OPERATION_FAILED,
                      message: t('rest_keywords_something_went_wrong') + error
                  });
              }
          }
          async showOrders(req, res) {
            let requested_data = req.body;
            try { 
                const request_data = common.decrypt(requested_data);
                const rules = validationRules.showOrders
    
                const valid = middleware.checkValidationRules(req, res, request_data, rules)
                if (!valid) return;
                const responseData = await adminModel.showOrders(request_data);
                return common.response(res, responseData);
    
            } catch (error) {
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }

        async updateStatus(req, res) {
            let requested_data = req.body;
            try{
                const request_data = common.decrypt(requested_data);
                const rules = validationRules.updateStatus;
    
            let message = {
                required: req.language.required,
                numeric: t('must_be_numeric'),
                string: t('must_be_string'),
                in: t('invalid_value_provided')
  
            };
        
            let keywords = {
                'order_id': t('rest_keywords_product_id'),
                'status': t('rest_keywords_status')
            };
    
            const valid = middleware.checkValidationRules(req,res,request_data,rules,message, keywords)
            console.log("Valid",valid);
            if (!valid) return;
            
            const responseData = await adminModel.updateStatus(request_data);
            return common.response(res, responseData);
    
            }catch(error){
                console.error("Error in signup:", error);
                return common.response(res, {
                    code: response_code.OPERATION_FAILED,
                    message: t('rest_keywords_something_went_wrong') + error
                });
            }
        }

    



};
module.exports = new Admin();