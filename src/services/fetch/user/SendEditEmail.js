import {API_UPDATE_EMAIL} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";
import {tryToRefreshJwt} from "../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";


export const sendEditEmail = async (editData) => {
    let response = await fetch(API_UPDATE_EMAIL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(editData),
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access') ) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                await sendEditEmail(editData);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }
}
