import {API_BASE_URL, API_CONTEXT} from "../../../../UrlConstants.jsx";
import {tryToRefreshJwt} from "../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../exception/UnauthorizedException.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";



export const sendGrantPermission = async (uap, permCreateDto) => {
    console.log("--------------------")
    const url = API_BASE_URL + API_CONTEXT + "/workspaces/" + uap.id + "/permissions/by-email";
    console.log(url, permCreateDto);
    let response = await fetch( url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(permCreateDto),
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access')) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendGrantPermission(uap, permCreateDto);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}
