const { default: localizify } = require('localizify');
const database = require("../config/database");
const { t } = require('localizify');
const common = require("../utilities/common");
const response_code = require("../utilities/response-error-code");
const en = require("../language/en");
const hn = require("../language/hn");
const ar = require("../language/ar");
const lodash = require('lodash');
const jwt = require('jsonwebtoken');

class headerAuth {

    validateApiKey(req, res, next) {
        var api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != "" ? req.headers['api-key'] : '');
        if (api_key != "") {
            try {
                var api_dec = common.decrypt(api_key).replace(/\0/g, '').replace(/[^\x00-\xFF]/g, "");
                console.log(api_dec);
                console.log(api_dec === process.env.API_KEY);
                if (api_dec === process.env.API_KEY) {
                    console.log("iF")
                    next();
                } else {
                    console.log("here");
                    const response_data = {
                        code: response_code.UNAUTHORIZED,
                        message: "Invalid API Key"
                    }
                    res.status(401).send(response_data);
                }
                // if(api_key === process.env.API_KEY){
                //     console.log("✅ API Key Valid. Proceeding to next middleware...");

                //     next();
                // } else{
                //     const response_data = {
                //         code: response_code.UNAUTHORIZED,
                //         message: "Invalid API Key"
                //     }
                //     res.status(401).send(response_data);
                // }

            } catch (error) {
                console.log("⚠️ Error in validateApiKey:", error);
                const response_data = {
                    code: response_code.UNAUTHORIZED,
                    message: "Invalid API Key"
                }

                res.status(401).send(response_data);
            }
        } else {
            console.log("❌ API Key is missing!");
            const response_data = {
                code: response_code.UNAUTHORIZED,
                message: "Invalid API Key"
            }
            res.status(401).send(response_data);
        }
    }

    extractMethod(request) {
        let url = request.originalUrl;
        let segment = []
        url.split('/').forEach(element => {
            if (!lodash.isEmpty(element)) {
                segment.push(element.trim());
            }
        });
        request.appVersion = segment[0]; //v1
        request.requestedModule = segment[1]; //user
        console.log("Extracted module:", request.requestedModule);
        request.requestMethod = segment[segment.length - 1]; //login
        console.log("Extracted request method:", request.requestMethod);


        return request;
    }

    async getRequestOwner(token) {
        try {
            console.log("Getting user from token:", token);
            const selectQuery = `SELECT * FROM tbl_device_info WHERE user_token = ?`;
            const [owner] = await database.query(selectQuery, [token]);
            console.log(owner);
            if (owner.length > 0) {
                return owner[0];
            } else {
                throw new Error("Invalid access token");
            }
        } catch (error) {
            throw error;
        }
    }
    async getRequestAdmin(token) {
        try {
            console.log("Getting user from token:", token);
            const selectQuery = `SELECT * FROM admin_ WHERE token = ?`;
            const [owner] = await database.query(selectQuery, [token]);
            console.log(owner);
            if (owner.length > 0) {
                return owner[0];
            } else {
                throw new Error("Invalid access token");
            }
        } catch (error) {
            throw error;
        }
    }

    async getUserFromToken(token) {
        console.log("Inside getUserFromToken, token:", token);
        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode", decode)
            return decode;
        } catch (error) {
            console.log(error.message);
            throw new Error("Invalid or Expired JWT Token");
        }
    }

    async header(req, res, next) {
        try {
            let headers = req.headers;

            var supportedLanguages = ['en', 'hn', 'ar'];
            let lng = (headers['accept-language'] && supportedLanguages.includes(headers['accept-language'])
                ? headers['accept-language']
                : 'en');

            process.env.LANGUAGE = lng;
            localizify.add('en', en)
                .add('ar', ar)
                .add('hn', hn);

            const byPassApi = ['forgot-password', 'resendOTP', 'login', 'signup', 'login_admin',
                , 'validate-forgot-password', 'verify-otp', 'reset-password', 'check-verification'];

            let headerObj = new headerAuth();
            req = headerObj.extractMethod(req);

            if (byPassApi.includes(req.requestMethod)) {
                return next();
            } else {
                console.log("here");
                console.log("token1", headers['authorization_token'])
                const token = headers['authorization_token'];
                console.log("tokennnn", token)
                if (!token) {
                    return res.status(401).json({
                        code: response_code.UNAUTHORIZED,
                        message: "Authorization token is missing"
                    });
                }

                try {
                    const headerObj = new headerAuth();
                    const decoded = await headerObj.getUserFromToken(token);
                    console.log(decoded)
                    if (req.requestedModule === 'admin') {
                        req.owner_id = decoded.admin_id
                    } else {
                        req.owner_id = decoded.user_id;
                    }
                    req.owner = decoded;
                    next();
                } catch (error) {
                    console.log(error);

                    return res.status(401).json({
                        code: response_code.UNAUTHORIZED,
                        message: "Invalid Access Token"
                    });
                }
            }

        } catch (error) {
            return res.status(500).json({
                code: response_code.UNAUTHORIZED,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    }
}

module.exports = new headerAuth();