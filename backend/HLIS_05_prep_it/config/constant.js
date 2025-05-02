const encryptLib = require("cryptlib");
let constants = {
    // encryptionKey: encryptLib.getHashSha256("xza548sa3vcr641b5ng5nhy9mlo64r6k", 32),
    // encryptionIV: "5ng5nhy9mlo64r6k",
    mailer_email: process.env.MAILER_EMAIL,
    mailer_password: process.env.MAILER_PASSWORD,
    from_email: process.env.MAILER_EMAIL, 
    host_mail: "smtp.gmail.com",
    port_base_url: "http://localhost:3000/",
    mailer_config: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD
        }
    }
}

module.exports = constants;