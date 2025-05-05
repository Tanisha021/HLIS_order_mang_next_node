const database = require("../../../../config/database");
const common = require("../../../../utilities/common");
const response_code = require("../../../../utilities/response-error-code");
const { t } = require("localizify");

class UserModel {

    async getProductsList() {
        try {
            const getProductsQuery = `
                SELECT p.product_id, p.product_name, p.product_price,  MIN(pi.image_name) AS image_name,c.category_name
                FROM tbl_products p
                left JOIN tbl_product_images pi ON p.product_id = pi.product_id
                left join tbl_category c on c.category_id = p.category_id GROUP BY p.product_id, p.product_name, p.product_price, c.category_name;
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
    
    async getCategoryList() {
        try {
            const getCategorysQuery = `
                select category_id, category_name from tbl_category;`;
    
            const [categories] = await database.query(getCategorysQuery);
    
            if (categories.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_category_found') 
                };
            }
            
            return {
                code: response_code.SUCCESS,
                message: t('category_listed_successfully'),
                data: categories
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED, 
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }


    async addToCart(request_data, user_id) {
        console.log("ehllo pogie",request_data.product_id, request_data.qty, user_id);
        try{
            if (!request_data.product_id || request_data.qty<=0) {
                console.log("here")
                return {
                    code: response_code.BAD_REQUEST,
                    message: t('product_id_and_qty_required')
                };
            }else{
                const checkCart = await common.check_cart_item(request_data.product_id, user_id);
                if(checkCart){
                    const data = {
                        qty: request_data.qty,
                        user_id: user_id,
                        product_id: request_data.product_id
                    }
                    const updateCart = await common.update_cart(data);
                    if(updateCart){
                        return {
                            code: response_code.SUCCESS,
                            message: t('cart_updated_successfully'),
                            data: request_data.product_id
                        };
                    }else{
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: t('cart_update_failed'),
                            data: null
                        };
                    }
                }else{
                    const data = {
                        user_id: user_id,
                        product_id: request_data.product_id,
                        qty: request_data.qty
                    }
                    const [result] = await database.query("INSERT INTO tbl_cart SET ?", data);
                    if(result.affectedRows > 0){
                        return {
                            code: response_code.SUCCESS,
                            message: t('product_added_to_cart'),
                            data: request_data.product_id
                        };
                }else{
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('product_add_to_cart_failed'),
                        data: null
                    };
                }
            }

        }
    }catch (error) {
        console.log(error);
        return {
            code: response_code.OPERATION_FAILED,
            message: t('some_error_occurred'),
            data: error.message
        };
    }
    
    }

    async getCartItems(user_id) {
        try {
            const getCartQuery = `
                SELECT c.cart_id, p.product_id, p.product_name, p.product_price, c.qty,
                (c.qty * p.product_price) AS total_price
                FROM tbl_cart c
                LEFT JOIN tbl_products p ON c.product_id = p.product_id
                WHERE c.user_id = ?;
            `;
    
            const [cartItems] = await database.query(getCartQuery, [user_id]);
    
            if (cartItems.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_cart_items_found')
                };
            }
    
            return {
                code: response_code.SUCCESS,
                message: t('cart_items_found_successfully'),
                data: cartItems
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async placeOrder(request_data, user_id) {
        try{
            const cart_data = await common.get_cart_items(user_id);
            let sub_total = 0;

            if(cart_data){
                const order_num = common.generateOrderNum(8);
                console.log(order_num)
                const order_data={
                    order_num: order_num,
                    user_id: user_id,
                    status:'pending'
                }
                const [result_order] = await database.query(`INSERT INTO tbl_order SET ?`, [order_data]);
                 if(result_order.affectedRows > 0){
                    const order_id = result_order.insertId;
                    for(const prod of cart_data){
                        const [price] = await database.query(`SELECT product_price FROM tbl_products WHERE product_id = ?`, [prod.product_id]);
                        if(!price || price.length === 0){
                            return {
                                code: response_code.NOT_FOUND,
                                message: t('product_not_found'),
                                data: null
                            };
                        }

                        const cost = price[0].product_price * prod.qty;
                        console.log("cost", cost)
                        sub_total += cost;
                        console.log("subtaotal", cost, sub_total)
                        const order_details_data = {
                            order_id: order_id,
                            product_id: prod.product_id,
                            qty: prod.qty,
                            price: cost
                        }
                        const order_details = await common.insert_into_order(order_details_data);

                        if(order_details){
                            const shipping_charge = 100;
                            const grand_total = sub_total + shipping_charge;

                            const data_to_update={
                                status: 'confirmed',
                                sub_total: sub_total,
                                grand_total: grand_total,
                                shipping_charge: shipping_charge,
                                payment_type: request_data.payment_type,
                                address_id: request_data.address_id,
                            }
                            const resp_order_update = await common.update_order(data_to_update,order_id);
                            if(resp_order_update){
                                await database.query(`DELETE FROM tbl_cart WHERE user_id = ?`, [user_id]);
                                return {
                                    code: response_code.SUCCESS,
                                    message: t('order_placed_successfully'),
                                    data: {
                                        order_id,
                                        order_num,
                                        grand_total
                                    }
                                };
                            }else{
                                return {
                                    code: response_code.OPERATION_FAILED,
                                    message: t('error_updating_order'),
                                    data: null
                                }
                            }
                    }else{
                        return {
                            code: response_code.OPERATION_FAILED,
                            message: t('error_adding_order_details'),
                            data: null
                        }
                    }

                 }
            }else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('error_adding_order_data'),
                    data: null
                }
            }

        }else{
            return {
                code: response_code.NOT_FOUND,
                message: t("no_data_provided_to_place_order"),
                data: null
            }
        }
    }catch(error) {
        console.log(error);
        return {
            code: response_code.OPERATION_FAILED,
            message: t('some_error_occurred'),
            data: error.message
        };
    }
    }

    async addDeliveryAddress(request_data, user_id) {
        try{
            const data = {
                user_id: user_id,
                address_line: request_data.address_line,
                city: request_data.city,
                state: request_data.state,
                country: request_data.country,
                pincode: request_data.pincode
            }
            const [result] = await database.query(`INSERT INTO tbl_user_delivery_address SET ?`, [data]);
            if(result.affectedRows > 0){
                return {
                    code: response_code.SUCCESS,
                    message: t('address_added_successfully'),
                    data: null
                };
            }else{
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('address_add_failed'),
                    data: null
                };
            }
        }catch(error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async getUserInfo(user_id) {
        try{
            if(user_id){
                const [data] = await database.query(`select u.full_name, u.email_id, u.code_id, u.phone_number, u.about, cc.country_code,cc.counrty_name from tbl_user as u 
                    left join tbl_country_code cc on cc.code_id = u.code_id where user_id = ?`, [user_id]);
                if(data && Array.isArray(data) && data.length > 0){
                    let order_data = await common.get_order_details(user_id);
                    const userData = {
                        full_name: data[0].full_name,
                        email_id: data[0].email_id,
                        code_id: data[0].code_id,
                        country_code: data[0].country_code,
                        country_name: data[0].counrty_name,
                        phone_number: data[0].phone_number,
                        about: data[0].about
                    };
                    if(order_data && order_data.length > 0){
                        userData.orders = order_data;
                    }else{
                        userData.orders = [];
                    }

                    return{
                        code: response_code.SUCCESS,
                        message: t('user_found_successfully'),
                        data: userData
                    }

                }else{
                    return {
                        code: response_code.NOT_FOUND,
                        message: t('user_not_found'),
                        data: null
                    };
                }
        
            }else{
                return {
                    code: response_code.BAD_REQUEST,
                    message: t('user_id_required'),
                    data: null
                };
            }

        }catch(error) {
            console.log(error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async updateProfile(request_data,user_id){
        try{
            const updated_fields = {}
            if(request_data.full_name){
                updated_fields.full_name = request_data.full_name;
            }
            if(request_data.profile_pic){
                updated_fields.profile_pic = request_data.profile_pic;
            }
            if(request_data.about){
                updated_fields.about = request_data.about;
            }
            if(Object.keys(updated_fields).length > 0){
                const [result] = await database.query(`UPDATE tbl_user SET ? WHERE user_id = ?`, [updated_fields, user_id]);
                if(result.affectedRows > 0){
                    return {
                        code: response_code.SUCCESS,
                        message: t('profile_updated_successfully'),
                        data: null
                    };
                }else{
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('profile_update_failed'),
                        data: null
                    };
                }
            }else{
                return {
                    code: response_code.BAD_REQUEST,
                    message: t('no_fields_to_update'),
                    data: null
                };
            }
        }catch(error){
            console.log(error.message);
            return {
                code: response_code.OPERATION_FAILED,
                message: "Internal Server Error",
                data: null
            }
        }
    }

    async get_delivery_address(user_id){
        try{
            const [address_result] = await database.query(`select address_id, address_line, city, state, pincode, country from tbl_user_delivery_address where user_id = ? and is_deleted = 0;`, [user_id]);
            if(address_result && address_result.length > 0){
                return {
                    code: response_code.SUCCESS,
                    message: t('delivery_address_found'),
                    data: address_result
                }
            } else{
                return {
                    code: response_code.NOT_FOUND,
                    message: t('delivery_address_not_found'),
                    data: null
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
}
module.exports = new UserModel();
