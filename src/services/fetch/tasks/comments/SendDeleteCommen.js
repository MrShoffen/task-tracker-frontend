import {tryToRefreshJwt} from "../../jwt/RefreshJwt.js";
import UnauthorizedException from "../../../../exception/UnauthorizedException.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";
import {API_BASE_URL, API_CONTEXT} from "../../../../../UrlConstants.jsx";


export const sendDeleteComment = async (comment) => {
    console.log("----------deleting-comment----------")
    const url = API_BASE_URL + API_CONTEXT + "/workspaces/" + comment.workspaceId + "/desks/" + comment.taskId + "/tasks/" + comment.taskId + "/comments/" + comment.id;

    console.log(url);
    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.status === 401 && error.detail.includes('access')) {

            console.log("access is expired, trying to refresh...");
            try {
                await tryToRefreshJwt();
                console.log('successfully refreshed - back to logic')
                await sendDeleteComment(comment);
            } catch (in_error) {
                throw new UnauthorizedException(in_error.detail);
            }
        } else {
            throwSpecifyException(error);
        }
    }
}
