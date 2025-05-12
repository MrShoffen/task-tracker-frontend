import ForbiddenException from "../../../../exception/ForbiddenException.jsx";
import {API_USER_INFO} from "../../../../../UrlConstants.jsx";


export const checkSession = async () => {

    const response = await fetch(API_USER_INFO, {
        method: 'GET',
        credentials: 'include'
    });
    console.log('Checking session');

    if (!response.ok) {
        const error = await response.json();
        throw new ForbiddenException(error.detail);
    }

    return await response.json();
}