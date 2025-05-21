const isProduction = import.meta.env.MODE === "production"; // Определяем режим окружения


export const API_BASE_URL =
        "http://localhost:8080"
    // "http://localhost:8080"
;

export const API_CONTEXT = '/api/v1';

//unauth
export const API_REGISTRATION = API_BASE_URL + API_CONTEXT + '/auth/sign-up';
export const API_LOGIN = API_BASE_URL + API_CONTEXT + '/auth/sign-in';
export const API_REFRESH_JWT = API_BASE_URL + API_CONTEXT + '/auth/refresh';
export const API_LOGOUT = API_BASE_URL + API_CONTEXT + '/auth/logout';

export const API_UPDATE_PASSWORD = API_BASE_URL + API_CONTEXT + '/auth/credentials/password';
export const API_UPDATE_EMAIL = API_BASE_URL + API_CONTEXT + '/auth/credentials/email';

export const API_USER_INFO = API_BASE_URL + API_CONTEXT + '/users/me';
export const API_USER_INFORMATION_UPDATE = API_USER_INFO + "/information";
export const API_USER_AVATAR_UPDATE = API_USER_INFO + "/avatar";


export const API_ALL_WORKSPACES = API_BASE_URL + API_CONTEXT + '/workspaces';


//autofill cities api and image upload api

export const API_IMAGE_UPLOAD = isProduction ? '/image-upload-api' : 'http://192.168.0.190:8079/image-upload-api';

export const API_PREVIEW = isProduction ? '/preview/' : 'http://192.168.0.125:9000/user-files/';