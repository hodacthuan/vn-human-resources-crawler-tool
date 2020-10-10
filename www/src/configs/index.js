import localConfig from "./local";
import prodConfig from "./prod";

let config = localConfig;

if (process.env.REACT_APP_NOT_SECRET_CODE == "prod") {
    config = prodConfig;
}

config.settingPassword = 'jocoCrawl123';
config.cookiePasswordCacheKey = 'crawl-credential';
config.credentialExpiredTime = 100; //Unit: minutes
config.goToPage = '/app/main';
config.goToLogin = '/login';

export default config;