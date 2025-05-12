import {API_MOVE_FILES} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";


export const sendMoveObject = async (source, target) => {


    const params = new URLSearchParams({from: source, path: target});

    const url = `${API_MOVE_FILES}?${params.toString()}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });


    if (!response.ok) {
        const error = await response.json();
        throwSpecifyException(error);
    }

    return await response.json();

}