const common = require("../../../../utilities/common");
const database = require("../../../../config/database");
const response_code = require("../../../../utilities/response-error-code");
const {default: localizify} = require('localizify');
const { t } = require("localizify");
const moment = require("moment");
const jwt = require('jsonwebtoken');
let bcrypt = require("bcrypt");
class UserModel {
    
    async signUp(request_data) {
        try{
            const checkEmailUnique = await common.checkEmail(request_data.email_id);
            if (checkEmailUnique) {
                const signUpData = {
                    full_name: request_data.full_name,
                    email_id: request_data.email_id,
                    code_id: request_data.code_id,
                    phone_number: request_data.phone_number,
                    password_: bcrypt.hashSync(request_data.password_, 10),
                    is_step:'3',
                    is_profile_complete: '1'
                };
                
        
                const sql = "INSERT INTO tbl_user SET ?";
                const [data] = await database.query(sql, [signUpData]);
        
                if (!data.insertId) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('user_registration_failed'),
                        data: null
                    };
                }
        
                const user_id = data.insertId;
                const user_token = jwt.sign(
                    { id: user_id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                )

                const deviceData = {
                    user_id,
                    device_type: request_data.device_type,
                    time_zone: request_data.time_zone,
                    ...(request_data.os_version != undefined && request_data.os_version != "") && { os_version: request_data.os_version },
                    ...(request_data.app_version != undefined && request_data.app_version != "") && { app_version: request_data.app_version },
                  };
                
                const deviceInsert = await common.insertDevice(deviceData);
                if (!deviceInsert) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('device_insertion_failed'),
                        data: null
                    };
                }

                const userInfo = await common.getUserInfo(user_id);
               

                if(!userInfo) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('user_info_failed'),
                        data: null
                    };
                }

                const responseData = {
                    userInfo: userInfo,
                    user_token: user_token
                };


                const generated_otp = common.generateOTP();
                console.log("Generated OTP:", generated_otp);
                const otp_data = {
                    user_id: user_id,
                    verify_with: request_data.verify_with,
                    otp: generated_otp
                };  

                const insertOtpQuery = "INSERT INTO tbl_otp SET ?";
                const [insertResult] = await database.query(insertOtpQuery, otp_data);
                console.log("Insert OTP Result:", insertResult); 
                return {
                    code:response_code.SUCCESS,
                    message: "Signup successfully" ,
                    data: responseData
                };
            } else {
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('email_already_exists'),
                    data: null
                };
            }

            
        }catch(error){
            console.error("Error in signUp:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    // async validateOTP(request_data) {
    //     try {
    //                    const { phone_number, otp } = request_data;
    //                    const selectUserQuery = `
    //                        SELECT u.user_id, o.otp,u.is_step, o.expiry_time
    //                         FROM tbl_user AS u
    //                         JOIN tbl_otp AS o ON o.user_id = u.user_id
    //                         WHERE u.phone_number = ? AND u.is_active = 1 AND u.is_deleted = 0;
    //                    `;
    //                    const [userResult] = await database.query(selectUserQuery, [phone_number]);
               
    //                    if (userResult.length === 0) {
    //                        return {
    //                            code: response_code.NOT_FOUND,
    //                            message: t('phone_number_not_registered')
    //                        };
    //                    }
               
    //                    const user = userResult[0];
    //                    const user_id = user.user_id;
    //                    console.log("istep",user.is_step);
    //                    console.log("istep type",typeof user.is_step);
    //                    if (user.is_step !== '1') {
    //                     return {
    //                         code: response_code.OPERATION_FAILED,
    //                         message: t('please_signup_first')
    //                     };
    //                 }
               
    //                    if (!user.otp) {
    //                        return {
    //                            code: response_code.OPERATION_FAILED,
    //                            message: t('otp_not_found')
    //                        };
    //                    }
    //                     const currentTime = new Date();
    //                     const expiryTime = new Date(user.expiry_time);
                        
    //                     if (currentTime > expiryTime) {
    //                         return {
    //                             code: response_code.OPERATION_FAILED,
    //                             message: t('otp_expired')
    //                         };
    //                     }
                       
    //                    if (otp == user.otp) {
    //                        const updateUserQuery = `
    //                           DELETE FROM tbl_otp WHERE user_id = ? AND otp = ? AND is_active = 1 AND is_deleted = 0
    //                        `;
    //                         await database.query(updateUserQuery, [user_id]);

    //                         const deviceToken = common.generateToken(40);
                
    //                         await database.query(
    //                             `UPDATE tbl_device_info SET device_token = ? WHERE user_id = ?`, 
    //                             [deviceToken, user_id]
    //                         );
                            
    //                         await database.query(
    //                             `UPDATE tbl_user SET is_step = '2' WHERE user_id = ?`, 
    //                             [user_id]
    //                         );
                            

    //                      return {
    //                         code: response_code.SUCCESS,
    //                         message: "OTP verified successfully",
    //                         data: {
    //                              device_token: deviceToken
    //                         }
    //                     };
    //                    } else {
    //                        return {
    //                            code: response_code.OPERATION_FAILED,
    //                            message: t('invalid_otp')
    //                        };
    //                    }
               
    //                } catch (error) {
    //                    return {
    //                        code: response_code.OPERATION_FAILED,
    //                        message: t('some_error_occurred'),
    //                        data: error.message
    //                    };
    //                }
    // };

        async login(request_data) {
            try{
                const emailExists = await common.checkEmail(request_data.email_id);

                if (emailExists) {
                    return {
                        code: response_code.OPERATION_FAILED,
                        message: t('invalid_email'),
                        data: null
                    };
                }

                let sql = `email_id = '${request_data.email_id}' and is_deleted = 0`;
                let userDetails = await common.getUser(sql)
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
                    

                    // let deviceData = {
                    //     user_id: userDetails.user_id,
                    //     device_token: request_data.device_token,
                    //     device_type: request_data.device_type,
                    //     ...(request_data.device_type != undefined && request_data.device_type != "") && { device_type: request_data.device_type },
                    //     ...(request_data.os_version != undefined && request_data.os_version != "") && { os_version: request_data.os_version },
                    //     ...(request_data.app_version != undefined && request_data.app_version != "") && { app_version: request_data.app_version },
                    //    };
        
                    //    const deviceInsert = await common.insertDevice(deviceData);
                    //    if (!deviceInsert) {
                    //        console.warn("Failed to insert device data during login");
                    //    }
        
                    let updateData = {
                        last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                        is_login: 1
                    };

                    
                    await common.updateUserData(userDetails.user_id, updateData);
                    let userInfo = await common.getUserInfo(userDetails.user_id);
                    
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
            }
            catch(error){
                console.error("Error in login:", error);
                return {
                    code: response_code.OPERATION_FAILED,
                    message: t('some_error_occurred'),
                    data: error.message
                };
            }

        }

        async logout(user_id){
            try{
                const user_data = await common.getUserInfo(user_id);
                if(user_data){
                    const device_data = await common.getDeviceData(user_id);
                    if(device_data){
                        const updated_device_data = {
                            device_type: null,
                            time_zone: "",
                            device_token: "",
                            os_version: "",
                            app_version: ""
                        }
    
                        const [result] = await database.query(`UPDATE tbl_device_info SET ? where user_id = ?`, [updated_device_data, user_id]);
                        if(result.affectedRows > 0){
                            const [data] = await database.query(`UPDATE tbl_user set is_login = 0 where user_id = ?`, [user_id]);
                            if(data.affectedRows > 0){
                                return{
                                    code: response_code.SUCCESS,
                                    message: "Logout Success",
                                    data: user_id
                                }
                            } else{
                                return{
                                    code: response_code.OPERATION_FAILED,
                                    message: "Failed to Update User Login Status",
                                    data: null
                                }
                            }
                        } else{
                            return{
                                code: response_code.OPERATION_FAILED,
                                message: "Device details update failed",
                                data: null
                            }
                        }
    
                    } else{
                        return {
                            code: response_code.NOT_FOUND,
                            message: "Device Data Not Found",
                            data: null
                        }
                    }
                } else{
                    return {
                        code: response_code.NOT_FOUND,
                        message: "User Not Found",
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