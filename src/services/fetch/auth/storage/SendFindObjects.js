import {API_FILES_SEARCH} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../../exception/ThrowSpecifyException.jsx";


export const sendFindObjects = async (folderName = "", objectToFind) => {


    const params = new URLSearchParams({path: folderName, name: objectToFind});

    const url = `${API_FILES_SEARCH}?${params.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });


    if (!response.ok) {
        const error = await response.json();
        throwSpecifyException(error);
    }

    return await response.json();

}