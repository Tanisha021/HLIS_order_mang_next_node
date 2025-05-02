const database = require("../../../../config/database");
const common = require("../../../../utilities/common");
const response_code = require("../../../../utilities/response-error-code");
const { t } = require("localizify");

class UserModel {

    async getProductsList() {
        try {
            const getProductsQuery = `
                SELECT p.product_id, p.product_name, p.product_price, pi.image_name,c.category_name
                FROM tbl_products p
                left JOIN tbl_product_images pi ON p.product_id = pi.product_id
                left join tbl_category c on c.category_id = p.category_id ;
            `;
    
            const [products] = await database.query(getProductsQuery);
    
            if (products.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_products_found')
                };
            }
    
            return {
                code: response_code.SUCCESS,
                message: t('products_listed_successfully'),
                data: products
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async getProductById(id) {
        try {
            const product_id = id;
            const getProductQuery = `

                SELECT p.product_id, p.product_name, p.product_price, p.product_description, pi.image_name,c.category_name
                FROM tbl_products p
                left JOIN tbl_product_images pi ON p.product_id = pi.product_id
                left join tbl_category c on c.category_id = p.category_id
                WHERE p.product_id = ?;
            `;
    
            const [productData] = await database.query(getProductQuery, [product_id]);
    
            if (productData.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('product_not_found'),
                    data:null
                };
            }
    
            const product = {
                product_id: productData[0].product_id,
                name: productData[0].product_name,
                price: productData[0].product_price,
                description: productData[0].product_description,
                images: productData.map(row => row.image_name)
            };
    
            return {
                code: response_code.SUCCESS,
                message: t('product_found_successfully'),
                data: product
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }
    
    async itemFiltering(request_data) {
        let page = request_data.page <= 0 ? 1 : request_data.page;
        const limit = 10;
        const start = (page - 1) * limit;
    
        let conditions = [];
    
        if (request_data.category && Array.isArray(request_data.category) && request_data.category.length > 0) {
            conditions.push(`p.category_id IN (${request_data.category.join(",")})`);
        }
    
        if (request_data.search && request_data.search.trim() !== '') {
            conditions.push(`(p.product_name LIKE '%${request_data.search.trim()}%')`);
        }
    
        if (request_data.price_range && Array.isArray(request_data.price_range) && request_data.price_range.length === 2) {
            const minPrice = request_data.price_range[0];
            const maxPrice = request_data.price_range[1];
            conditions.push(`p.product_price BETWEEN ${minPrice} AND ${maxPrice}`);
        }
    
        conditions.push("p.is_deleted = 0");
    
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    
        const final_query = `
        SELECT p.product_id, p.product_name, p.product_price, pi.image_name, c.category_name
        FROM tbl_products p
        LEFT JOIN tbl_product_images pi ON p.product_id = pi.product_id
        LEFT JOIN tbl_category c ON c.category_id = p.category_id
        ${whereClause}
        LIMIT ${start}, ${limit}`;


        console.log(final_query);
    
        try {
            const [results] = await database.query(final_query);
            return {
                code: response_code.SUCCESS,
                message: t('data_found'),
                data: results
            };
        } catch (error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                data: error
            };
        }
    }
    

    
    // async createBlog(request_data) {
    //     try {
    //         const { title, content, tag_id } = request_data;

    //         const blogData = {title,content}
    //         const insertBlogQuery = `insert into tbl_blog set ?`
    //         const [blogResult] = await database.query(insertBlogQuery, [blogData]);
    //         const blog_id = blogResult.insertId;

    //         if(Array.isArray(tag_id) && tag_id.length > 0) {
    //             const insertTagsQuery = `insert into tbl_rel_blog_tags (blog_id, tag_id) values ?`;

    //             const tagValues = tag_id.map(tag => [blog_id, tag]);
    //             await database.query(insertTagsQuery, [tagValues]);
    //         }

    //         return{
    //             code: response_code.SUCCESS,
    //             message: t('task_created_successfully'),
    //             data: { blog_id, title, content, tag_ids: tag_id || [] }
    //         }

    //     } catch (error) {
    //         return {
    //             code: response_code.OPERATION_FAILED,
    //             message: t('some_error_occurred'),
    //             data: error.message
    //         };
    //     }
    // }

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
module.exports = new UserModel();
