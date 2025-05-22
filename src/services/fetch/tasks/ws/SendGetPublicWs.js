import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {API_ALL_WORKSPACES, API_BASE_URL, API_CONTEXT} from "../../../../../UrlConstants.jsx";

export const sendGetPublicWs = async (fullWsLink) => {
    let response = await fetch(
        API_BASE_URL + API_CONTEXT + '/public-workspaces/' + fullWsLink + '/full',
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401) {
            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendGetPublicWs(fullWsLink);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }

    }

    return await response.json();

}