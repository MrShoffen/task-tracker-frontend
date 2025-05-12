import {API_FILES_PREVIEW} from "../../../../UrlConstants.jsx";

export const sendGetPreview = async (path) => {

    const params = new URLSearchParams({path: path});

    const fetchUrl = `${API_FILES_PREVIEW}?${params.toString()}`;

    const response = await fetch(fetchUrl, {
        method: 'GET',
        credentials: 'include',
    });


    if (!response.ok) {

        return;
    }

    return await response.text();

}