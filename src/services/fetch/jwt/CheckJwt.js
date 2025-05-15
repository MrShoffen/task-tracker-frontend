import {API_USER_INFO} from "../../../../UrlConstants.jsx";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";
import {tryToRefreshJwt} from "./RefreshJwt.js";


export const checkJwt = async () => {

    let response = await fetch(API_USER_INFO, {
        method: 'GET',
        credentials: 'include'
    });
    console.log('Checking session');

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401) {
            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await checkJwt();
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throw new UnauthorizedException(error.detail);
        }

    }

    return await response.json();

}