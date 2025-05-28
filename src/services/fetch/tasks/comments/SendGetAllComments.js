import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {API_ALL_WORKSPACES, API_BASE_URL, API_CONTEXT} from "../../../../../UrlConstants.jsx";

export const sendGetAllComments = async (task, limit=20, offset=0) => {

    const url = API_BASE_URL + API_CONTEXT + "/workspaces/" + task.workspaceId + "/desks/" + task.deskId + "/tasks/" + task.id + "/comments?limit=" + limit + "&offset=" + offset;

    let response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401) {
            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
               return await sendGetAllComments(task);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }

    }

    return await response.json();

}