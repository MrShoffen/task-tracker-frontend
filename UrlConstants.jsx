const isProduction = import.meta.env.MODE === "production"; // Определяем режим окружения


export const API_BASE_URL = isProduction ? "" :
        "http://192.168.0.190:8080"
    // "http://localhost:8080"
;

export const API_CONTEXT = '/api/v1';

//unauth
export const API_REGISTRATION = API_BASE_URL + API_CONTEXT + '/auth/sign-up';

export const API_LOGIN = API_BASE_URL + API_CONTEXT + '/auth/login';
export const API_LOGOUT = API_BASE_URL + API_CONTEXT + '/auth/logout';

export const API_FILES = API_BASE_URL + API_CONTEXT + '/resources';
export const API_FILES_LIST = API_FILES + '/files';
export const API_MOVE_FILES = API_FILES + '/move';
export const API_COPY_FILES = API_FILES + '/copy';
export const API_DOWNLOAD_FILES  = API_FILES + '/download';
export const API_UPLOAD_FILES  = API_FILES+ '/upload';
export const API_FILES_PREVIEW  = API_FILES + '/preview';
export const API_FILES_SEARCH  = API_FILES + '/search';


export const API_USER_INFO = API_BASE_URL + API_CONTEXT + '/users/me';


//autofill cities api and image upload api

export const API_IMAGE_UPLOAD = isProduction ? '/image-upload-api' : 'http://192.168.0.190:8079/image-upload-api';

export const API_PREVIEW = isProduction ? '/preview/' : 'http://192.168.0.125:9000/user-files/';