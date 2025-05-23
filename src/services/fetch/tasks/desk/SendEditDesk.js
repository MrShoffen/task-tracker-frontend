import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {API_BASE_URL} from "../../../../../UrlConstants.jsx";


export const sendEditDesk = async (url, editData) => {
    console.log('updating desk ', url, ' ', editData)
    let response = await fetch(API_BASE_URL + url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(editData),
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access')) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendEditDesk(url, editData);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}
