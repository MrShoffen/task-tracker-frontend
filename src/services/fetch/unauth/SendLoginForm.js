import {API_LOGIN, API_USER_INFO} from "../../../../UrlConstants.jsx";
import {throwSpecifyException} from "../../../exception/ThrowSpecifyException.jsx";


export const sendLoginForm = async (loginData) => {

    const response = await fetch(API_LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(loginData),
    });

    console.log(response);

    if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throwSpecifyException(error);
    }

    const myInfo = await fetch(API_USER_INFO, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }
    );

    return await myInfo.json();

}