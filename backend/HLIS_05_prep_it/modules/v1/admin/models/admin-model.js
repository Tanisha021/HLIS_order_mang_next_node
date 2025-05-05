const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const {default: localizify} = require('localizify');
const { t } = require("localizify");
const jwt = require('jsonwebtoken');
let bcrypt = require("bcrypt");
const moment = require("moment");

class AdminModel {
    async login_admin(request_data) {
        try {
           const emailExists = await common.checkEmailAdmin(request_data.email_id);
           
                           if (!emailExists) {
                               return {
                                   code: response_code.OPERATION_FAILED,
                                   message: t('invalid_email'),
                                   data: null
                               };
                           }
                            const checkLoginQuery = `SELECT * FROM tbl_admin WHERE email_id = ? AND is_login = 1`;
                            const [loginCheckResult] = await database.query(checkLoginQuery, [request_data.email_id]);
                            if (loginCheckResult.length > 0) {
                                return {
                                    code: response_code.OPERATION_FAILED,
                                    message: t('user_already_logged_in'),
                                    data: null
                                };
                            }
           
                           let sql = `email_id = '${request_data.email_id}' and is_deleted = 0`;
                           let userDetails = await common.getAdmin(sql)
                           if (!userDetails) {
                               return {
                                   code: response_code.OPERATION_FAILED,
                                   message: t('user_not_found'),
                                   data: null
                               };
                           }
                           
                       if (bcrypt.compareSync(request_data.password_, userDetails.password_)) {
                           if (userDetails.is_active == 1) {
                   
                               const user_token = jwt.sign(
                                   { id: userDetails.admin_id },
                                   process.env.JWT_SECRET,

                                   { expiresIn: '1d' }
                               );
                               
                               let updateData = {
                                   last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                                   is_login: 1
                               };
           
                               
                               await common.updateAdminData(userDetails.admin_id, updateData);
                               let userInfo = await common.getUserInfo(userDetails.admin_id);
                            
                               const responseData = {
                                   userInfo: userInfo,
                                   user_token: user_token
                               };
                               return {
                                   code: response_code.SUCCESS,
                                   message:  t('text_login_success'),
                                   data: responseData
                               };
                   
                           } else {
                               return {
                                   code: response_code.INACTIVE_ACCOUNT,
                                   message:  t('text_invalid_password'),
                                   data: null
                               };
                           }
                       } else {
                           return {
                               code: response_code.OPERATION_FAILED,
                               message: 'text_invalid_password',
                               data: null
                           };
                       }
                       
        } catch (error) {
            console.error("Login error:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: error.sqlMessage || error.message
            };
        }
    }

    async createProduct(request_data) {
        try {
            const {
                product_name,
                product_price,
                product_description,
                category_id,
                image_link 
            } = request_data;
    
            const productData = {
                product_name,
                product_price,
                product_description,
                category_id
            };

            const insertProductQuery = `INSERT INTO tbl_products SET ?`;
            const [productResult] = await database.query(insertProductQuery, [productData]);
    
            const product_id = productResult.insertId;

            const imageData = {
                image_name: image_link,
                product_id
            };
    
            const insertImageQuery = `INSERT INTO tbl_product_images SET ?`;
            await database.query(insertImageQuery, [imageData]);
    
            return {
                code: response_code.SUCCESS,
                message: t('product_created_successfully'),
                data: {
                    product_id,
                    product_name,
                    product_price,
                    product_description,
                    category_id,
                    image_link
                }
            };
    
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async editProduct(request_data) {
        try {
            if(!request_data.product_id) {
                return {
                    code: response_code.BAD_REQUEST,
                    message: t('product_id_required'),
                    data: null
                }
            }
            const updated_fields = {};
            if (request_data.product_name) {
                updated_fields.product_name = request_data.product_name;
            }
            if (request_data.product_price) {
                updated_fields.product_price = request_data.product_price;
            }
            if (request_data.product_description) {
                updated_fields.product_description = request_data.product_description;
            }

            if (Object.keys(updated_fields).length === 0) {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t("no_data_provided_for_update"),
                    data: null
                }
            } else {
                const [upated_prods] = await database.query(`UPDATE tbl_products SET ? where product_id = ?`, [updated_fields, request_data.product_id]);

                if (upated_prods.affectedRows > 0) {
                    return {
                        code: response_code.SUCCESS,
                        message: t('update_product_success'),
                        data: { product_id: request_data.product_id }
                    }
                } else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('update_product_failed'),
                        data: null
                    }
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('internal_server_error'),
                data: null
            }
        }
    }

    async productListing() {
        try {
            const [products] = await database.query(`SELECT p.product_id, p.product_name, p.product_price, pi.image_name,c.category_name FROM tbl_products p left JOIN tbl_product_images pi ON p.product_id = pi.product_id left join tbl_category c on c.category_id = p.category_id where p.is_deleted = 0;`);

            if (products && products != null && Array.isArray(products) && products.length > 0) {
                return {
                    code: response_code.SUCCESS,
                    message: "Products Found",
                    data: products
                }

            } else {
                return {
                    code: response_code.NOT_FOUND,
                    message: "Products Not Found",
                    data: null
                }
            }

        } catch (error) {
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
}

async deleteProduct(request_data){
    try{
        if(!request_data.product_id){
            return {
                code: response_code.OPERATION_FAILED,
                message: t('no_product_id_provided'),
                data: null
            }
        } else{
            const data = await common.get_products_info(request_data.product_id);   
            if(data){ 
                const [res] = await database.query(`UPDATE tbl_products SET is_deleted = 1 where product_id = ?`, [request_data.product_id]);
                if(res.affectedRows > 0){
                    return {
                        code: response_code.SUCCESS,
                        message: t('delete_success'),
                        data: request_data.product_id
                    }
                } else{
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('delete_failed'),
                        data: null
                    }
                }
            } else{
                return {
                    code: response_code.NOT_FOUND,
                    message: t('product_already_deleted'),
                    data: null
                }
            }
        }

    } catch(error){
        console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
    }
}

async showOrders(request_data) {
    try {
        let page = (request_data.page && request_data.page > 0) ? request_data.page : 1;
        const limit = 10;
        const start = (page - 1) * limit;

        const [orders] = await database.query(`select o.order_id, o.order_num, o.sub_total, 
        o.shipping_charge, o.grand_total, o.status, o.payment_type, u.full_name,
        u.email_id, u.profile_pic, u.user_id, da.address_line, da.city, da.state, da.pincode, da.country from tbl_order o left join 
        tbl_user u on o.user_id = u.user_id 
        left join tbl_user_delivery_address da 
        on da.address_id = o.address_id where u.is_deleted = 0 and da.is_deleted = 0 LIMIT ? OFFSET ?;`, [limit, start]);

        if(orders && orders.length > 0){
            return {
                code: response_code.SUCCESS,
                message: t('orders_found'),
                data: orders
            }

        } else{
            return {
                code: response_code.NOT_FOUND,
                message: t('no_orders_found'),
                data: null
            }
        }

    } catch (error) {
        console.log(error.message);
        return {
            code: response_code.OPERATION_FAILED,
            message: "Internal Server Error",
            data: null
        }
    }
}

async updateStatus(request_data) {
    try {
        const order_data = await common.get_order_by_id(request_data.order_id);
        if (order_data) {
            if (request_data.status != order_data.status) {
                const [updated_data] = await database.query(`UPDATE tbl_order SET status = ? where order_id = ?`, [request_data.status, request_data.order_id]);
                if (updated_data.affectedRows > 0) {
                    return {
                        code: response_code.SUCCESS,
                        message: t('order_status_update_success'),
                        data: request_data.order_id
                    }
                } else {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('failed_to_update_data'),
                        data: null
                    }
                }
            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('provide_different_status_to_update'),
                    data: null
                }
            }
        } else {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('failed_to_get_order_detail'),
                data: null
            }
        }

    } catch (error) {
        console.log(error.message);
        return {
            code: response_code.OPERATION_FAILED,
            message: "Internal Server Error",
            data: null
        }
    }
}



}
    
    
    



module.exports = new AdminModel();