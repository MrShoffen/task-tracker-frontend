import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";
import {API_IMAGE_UPLOAD} from "../../../../UrlConstants.jsx";


export const uploadAvatar = async (formData) => {

    const response = await fetch(API_IMAGE_UPLOAD, {
        method: 'POST',

        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throwSpecifyException(error);
    }

    return await response.json();
}
