import {API_REFRESH_JWT} from "../../../../UrlConstants.jsx";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";


export const tryToRefreshJwt = async () => {

    const response = await fetch(API_REFRESH_JWT, {
        method: 'POST',
        credentials: 'include'
    });
    console.log('Trying to refresh JWT');

    if (!response.ok) {
        const error = await response.json();
        throw new UnauthorizedException(error.detail);
    }
}