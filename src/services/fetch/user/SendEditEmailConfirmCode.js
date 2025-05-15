import {API_REGISTRATION, API_UPDATE_EMAIL} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";
import {tryToRefreshJwt} from "../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";


export const sendEditEmailConfirm = async (code) => {

    const params = new URLSearchParams({confirm: code});

    const url = `${API_UPDATE_EMAIL}?${params.toString()}`;
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access') ) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                await sendEditEmailConfirm(code);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }
}
