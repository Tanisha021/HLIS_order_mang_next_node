const database = require("../config/database");
// const cryptLib = require("cryptlib");
const crypto = require("crypto");
const constants = require("../config/constant");
const { default: localizify } = require('localizify');
const { t } = require("localizify");
const nodemailer = require("nodemailer");
const response_code = require("../utilities/response-error-code");
const key = Buffer.from(process.env.HASH_KEY, 'hex');
const iv = Buffer.from(process.env.HASH_IV, 'hex');

class Common {
    generateToken(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    generateOTP(){
        console.log("Hello");
        return Math.floor(1000 + Math.random() * 9000);
    }

    // async response(res, message) {
    //     return res.json(message);
    // }

    async response(res, message){
        const encrypted = this.encrypt(message);
        return res.status(200).send(encrypted);
    }
    // -------------------------------USER---------------------------------------------
    async checkEmail(email){
        try{
            const [results] = await database.query(`SELECT user_id from tbl_user where email_id = ? and is_active = 1 and is_deleted = 0`, [email]);
            if(results && Array.isArray(results) && results.length > 0 && results[0] !== null && results[0].user_id){
                return false;
            } else {
                return true;
            }
        } catch(error){
            console.log(error.message);
            return false
        }
    }

    async insertDevice(deviceData) {
        try{
            const [res] = await database.query(`INSERT INTO tbl_device_info SET ?`, deviceData);
            return !!res.insertId;
        } catch(error){
            return false;
        }
      }
    
      async getUserInfo(user_id) {
        try {
            let sql = `SELECT u.user_id, u.full_name, u.email_id, d.device_type FROM tbl_user AS u 
left join tbl_device_info AS d ON u.user_id = d.user_id WHERE u.user_id = ? AND u.is_active = 1 AND u.is_deleted = 0 ;`;
    
            const [res] = await database.query(sql, [user_id]);
            return res[0];
        } catch (error) {
            return false;
        }
    }

    async getUser(data) {
        try {
            let sql = `SELECT user_id, email_id, password_, is_active FROM tbl_user WHERE ${data} AND is_active = 1 AND is_deleted = 0 ORDER BY user_id DESC`;
            console.log("sqlll",sql)
            const res = await database.query(sql);
            if (res[0].length > 0) {
                return res[0][0]; 
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateUserData(user_id, data) {
        try {
            console.log("updateUserData called with:", { user_id, data });
            
            let sql = `UPDATE tbl_user SET ? WHERE user_id = ?`;
            const [result] = await database.query(sql, [data, user_id]);

            console.log("SQL update result:", result);
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }

    async getDeviceData(user_id){
        try{
            const [result] = await database.query(`SELECT device_type, time_zone, device_token, os_version, app_version from tbl_device_info where user_id = ?`, [user_id]);
            if(result && result.length > 0 && Array.isArray(result)){
                return result[0];
            } else{
                return false;
            }
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async checkExistingUser(email) {
        try {
            const checkUser = `SELECT * FROM tbl_user WHERE email_id = ? and is_deleted = 0`;
            const [user] = await database.query(checkUser, [email]);
            return user.length > 0;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    async updateUserInfo(user_id, user_data) {
        if (!user_id || Object.keys(user_data).length === 0) {
            throw new Error("Invalid update request: No data provided.");
        }

        let fields = Object.keys(user_data).map(field => `${field} = ?`).join(', ');
        let values = Object.values(user_data);
        values.push(user_id);

        const updateQuery = `UPDATE tbl_user SET ${fields} WHERE user_id = ?`;

        try {
            const [result] = await database.query(updateQuery, values);

            console.log("Update Result:", result);

            if (result.affectedRows === 0) {
                console.warn("No rows updated - Either user not found or no changes made");
                return null;
            }

            const selectUserQuery = `
                SELECT user_id, latitude, longitude, gender, current_weight_kg, target_weight_kg, 
                       current_height_cm, activity_level, is_profile_completed, goal_id, isstep_
                FROM tbl_user 
                WHERE user_id = ?
            `;

            const [updatedUser] = await database.query(selectUserQuery, [user_id]);

            console.log("Updated User Data:", updatedUser);

            return updatedUser.length > 0 ? updatedUser[0] : null;

        } catch (error) {
            console.error("Error in updateUserInfo:", error);
            throw error;
        }
    }

    async getUserDetailLogin(user_id) {
        console.log("User ID:", user_id);

        const selectUserQuery = "SELECT * FROM tbl_user WHERE user_id = ? ";

        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
            console.log("User", user);

            if (user.length > 0) {

                return user[0];
            } else {
                return t('no_data_found');
            }
        } catch (error) {
            console.error("Error in getUserDetailLogin:", error);
            return error.message || error;
        }
    }


    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        }
        return {
            code: false,
            message: ""
        };
    }


    async check_cart_item(prod_id, user_id){
        try{
            const [cart_data] = await database.query(`SELECT cart_id, product_id, qty from tbl_cart where product_id = ? and user_id = ?`, [prod_id, user_id]);

            if(cart_data && cart_data.length > 0 && Array.isArray(cart_data)){
                return cart_data[0];
            } else{
                return false;
            }
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async update_cart(data){
        try{
            const [resp] = await database.query(`UPDATE tbl_cart SET qty = ? where user_id = ? and product_id = ?`, [data.qty, data.user_id, data.product_id]);

            return resp.affectedRows > 0;
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async get_cart_items(user_id){
        try{
            const [res] = await database.query(`select user_id, product_id, qty, cart_id from tbl_cart where user_id = ?`, [user_id]);
            if(res && res.length > 0 && Array.isArray(res)){
                return res;
            } else{
                return false
            }
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    async insert_into_order(data){
        try{
            const [rows] = await database.query(`INSERT INTO tbl_order_details SET ? `, [data]);
            return rows.affectedRows > 0;
        } catch(error){
            console.log(error.message);
            return false;
        }
    }

    generateOrderNum(length){
        if(length <= 0){
            throw new Error("Order Number length must be greater than 0");
        }
        const digits = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    async update_order(data,order_id){
        try{
            const [rows] = await database.query(`UPDATE tbl_order SET ? where order_id=?`, [data,order_id]);            
            return rows.affectedRows > 0;
        } catch(error){
            console.log(error.message);
            return false;
        }
    }
    // -------------------ADMIN-----------------------------------------------
    async checkEmailAdmin(email){
        try{
            const [results] = await database.query(`SELECT admin_id from tbl_admin where email_id = ? and is_active = 1 and is_deleted = 0`, [email]);
            console.log("results",results)
            if(results && Array.isArray(results) && results.length > 0 && results[0] !== null && results[0].user_id){
                return false;
            } else {
                return true;
            }
        } catch(error){
            console.log(error.message);
            return false
        }
    }

    async getAdmin(data) {
        try {
            let sql = `SELECT admin_id, email_id, password_, is_active FROM tbl_admin WHERE ${data} AND is_active = 1 AND is_deleted = 0 ORDER BY admin_id DESC`;
            console.log("sqlll",sql)
            const res = await database.query(sql);
            if (res[0].length > 0) {
                return res[0][0]; 
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateAdminData(admin_id, data) {
        try {
            console.log("updateUserData called with:", { admin_id, data });
            
            let sql = `UPDATE tbl_admin SET ? WHERE admin_id = ?`;
            const [result] = await database.query(sql, [data, admin_id]);

            console.log("SQL update result:", result);
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }

    async getAdminInfo(admin_id) {
        try {
            let sql = `SELECT admin_id, full_name, email_id FROM tbl_admin admin_id = ? AND is_active = 1 AND is_deleted = 0 ;`;
    
            const [res] = await database.query(sql, [admin_id]);
            return res[0];
        } catch (error) {
            return false;
        }
    }


    async sendMail(subject, to_email, htmlContent) {
        try {
            if (!to_email || to_email.trim() === "") {
                throw new Error("Recipient email is empty or undefined!");
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: constants.mailer_email,
                    pass: constants.mailer_password
                }
            });

            const mailOptions = {
                from: constants.from_email,
                to: to_email,
                subject: subject,
                html: htmlContent,
                text: "Please enable HTML to view this email.",
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(info)
                ;
            return { success: true, info };
        } catch (error) {
            console.log(error);
            return { success: false, error };
        }
    }

    // async encrypt(data) {
    //     try {
    //         console.log(data, 'encry');

    //         return cryptLib.encrypt(JSON.stringify(data), constants.encryptionKey, constants.encryptionIV);
    //     } catch (error) {
    //         return error;
    //     }
    // }

    // decryptPlain(data) {
    //     console.log('data======c', data);

    //     const decData = cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
    //     return decData

    // }

    // decryptString(data) {
    //     console.log('data======c', data);
    //     try {

    //         if (data) {
    //             return cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
    //         } else {
    //             return;
    //         }
    //     } catch (error) {
    //         return error;
    //     }
    // }
    // encrypt(data){
    //     return cryptolib.encrypt(JSON.stringify(data));
    // }

    encrypt(requestData) {
        try {
            if (!requestData) {
                return null;
            }
            const data = typeof requestData === "object" ? JSON.stringify(requestData) : requestData;
            const cipher = crypto.createCipheriv('AES-256-CBC', key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            return encrypted;
        } catch (error) {
            console.error("Encryption error:", error);
            return error;
        }
    }

    decrypt(requestData) {
        console.log("11",requestData)
        try {
            if (!requestData) {
                return {};
            }
            const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);
            let decrypted = decipher.update(requestData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            console.log("--------- DECRYPT: ", decrypted);
            return this.isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
        } catch (error) {
            console.log("Error in decrypting: ", error);
            return requestData;
        }
    }

    isJson(str) {
        try {
            const parsed = JSON.parse(str);
            return typeof parsed === 'object' && parsed !== null;
        } catch (e) {
            return false;
        }
    }
}


module.exports = new Common;
