import localConfig from "./local";
import prodConfig from "./prod";

let config = localConfig;

if (process.env.REACT_APP_NOT_SECRET_CODE == "prod") {
    config = prodConfig;
}

/**
 * Return random string
 * @return {String} random string
 */
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Define configuration data
 */
config.loginPassword = process.env.REACT_APP_LOGIN_PASSWORD || makeid(16);
config.cookiePasswordCacheKey = 'crawl-credential';
config.credentialExpiredTime = 100; //Unit: minutes
config.goToPage = '/app/main';
config.goToLogin = '/login';

export default config;