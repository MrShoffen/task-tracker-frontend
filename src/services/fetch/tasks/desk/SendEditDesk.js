import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {API_BASE_URL, API_CONTEXT} from "../../../../../UrlConstants.jsx";


export const sendEditDesk = async (type, desk, editData) => {
    const url = API_BASE_URL + API_CONTEXT + "/workspaces/" + desk.workspaceId + "/desks/" + desk.id + "/" + type;

    console.log('updating desk ', url, ' ', editData)
    let response = await fetch( url, {
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
                return await sendEditDesk(type, desk, editData);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }

    return await response.json();
}
