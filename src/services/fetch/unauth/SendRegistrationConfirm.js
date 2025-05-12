import {API_REGISTRATION} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";


export const sendRegistrationConfirm = async (confirmationId) => {

    const params = new URLSearchParams({confirm: confirmationId});

    const url = `${API_REGISTRATION}?${params.toString()}`;

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