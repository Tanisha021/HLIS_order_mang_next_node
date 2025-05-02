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
                                   { id: userDetails.id },
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
    
    

    // async deleteBlog(request_data) {
    //     try {
    //         const { blog_id } = request_data;
    //         const deleteBlogQuery = `Update tbl_blog set is_delete=1 WHERE blog_id = ?`;
    //         const [result] = await database.query(deleteBlogQuery, [blog_id]);

    //         if (result.affectedRows === 0) {
    //             return {
    //                 code: response_code.NOT_FOUND,
    //                 message: t('task_not_found')
    //             };
    //         }

    //         return {
    //             code: response_code.SUCCESS,
    //             message: t('task_deleted_successfully'),
    //             data:blog_id
    //         };
    //     } catch (error) {
    //         return {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('some_error_occurred'),
    //             data: error.message
    //         };
    //     }
    // }

    // async updateBlog(request_data,id) {
    //     const blog_id = id;
    //     try {
    //         const { content, title, status } = request_data;
    //         console.log("request_data",typeof request_data)

    //         console.log("title", request_data.title)
    //         console.log("content",content)
    //         console.log("status",status)

    //         if(!blog_id) {
    //             return {
    //                 code: response_code.BAD_REQUEST,
    //                 message: t('blog_id_required')
    //             };
    //         }
    //         const blogData = await common.get_blog_by_id(blog_id);
    //         console.log("blogData1",blogData);
    //         if (blogData.code !== response_code.SUCCESS || !blogData.data) {
    //             return {
    //                 code: response_code.NOT_FOUND,
    //                 message: t('blog_not_found_or_deleted'),
    //                 data: null
    //             };
    //         }

    //         const update_data = {};

    //         if(title){
    //             update_data.title = title;
    //         }
    //         if(content){
    //             update_data.content = content;
    //         }
    //         if (status !== undefined && status !== null) { 
    //             update_data.status = status;
    //         }
    //         console.log("update_data",update_data)
    //         if(Object.keys(update_data).length === 0) {
    //             return {
    //                 code: response_code.BAD_REQUEST,
    //                 message: t('no_update_data_provided')
    //             };
    //         }

    //         await database.query('UPDATE tbl_blog SET ? WHERE blog_id = ?', [update_data, blog_id]);

    //         return {
    //             code: response_code.SUCCESS,
    //             message: t('task_updated_successfully'),
    //             data: { blog_id, ...update_data }
    //         };
    //     } catch (error) {
    //         console.error("Error in updateBlog:", error);
    //         return {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('some_error_occurred'),
    //             data: error.message
    //         };
    //     }
    // }
    
}
module.exports = new AdminModel();