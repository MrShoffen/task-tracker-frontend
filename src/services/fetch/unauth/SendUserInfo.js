import {API_USER_INFO_UNAUTH} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";
import {tryToRefreshJwt} from "../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";


export const sendUserInfo = async (userId) => {
    console.log('fetching user information');
    let response = await fetch(
        API_USER_INFO_UNAUTH + '?id=' + userId

        , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401) {
            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendUserInfo(userId);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}