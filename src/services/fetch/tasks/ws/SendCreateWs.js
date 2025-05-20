import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {API_ALL_WORKSPACES, API_BASE_URL} from "../../../../../UrlConstants.jsx";


export const sendCreateWs = async (createWsDto) => {
    let response = await fetch(API_ALL_WORKSPACES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(createWsDto)
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access')) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendCreateWs(createWsDto);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}
