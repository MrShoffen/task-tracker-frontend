import {API_USER_AVATAR_UPDATE, API_USER_INFORMATION_UPDATE} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";
import {tryToRefreshJwt} from "../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";


export const sendEditAvatar = async (editData) => {
    let response = await fetch(API_USER_AVATAR_UPDATE, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(editData),
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401) {
            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendEditAvatar(editData);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}