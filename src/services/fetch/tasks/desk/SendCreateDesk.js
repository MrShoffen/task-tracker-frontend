import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {API_BASE_URL, API_CONTEXT} from "../../../../../UrlConstants.jsx";


export const sendCreateDesk = async (workspace, createDeskDto) => {
    console.log("--------------------")
    const url = API_BASE_URL + API_CONTEXT + "/workspaces/" + workspace.id + "/desks";
    console.log(url, createDeskDto);
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(createDeskDto),
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access')) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                return await sendCreateDesk(workspace, createDeskDto);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}
