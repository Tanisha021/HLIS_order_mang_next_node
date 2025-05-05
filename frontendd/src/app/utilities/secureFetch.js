import axios from "axios";
import { encrypt, decrypt } from "./encdec";

export async function secureAxios(url, request_data = {}, method = 'POST', api_key,auth_token=null) {
    try {
        const req = request_data ?? {};
        const encData = encrypt(JSON.stringify(req));

        const headers = {
            "api-key": api_key,
            "Content-Type": "text/plain",
        };
        if(auth_token){
            headers['authorization_token'] = `${auth_token}`;
        }

        const config = {
            method,
            url,
            headers,
            data: encData
        };

        const response = await axios(config);
        const decrypted = decrypt(response.data);
        console.log("decrypted", decrypted);
        return decrypted;

    } catch (error) {
        console.error(error);
        return error;
    }
}
