import ValidatedTextField from "./ValidatedTextField.jsx";
import * as React from "react";
import {useEffect} from "react";


export default function ValidatedEmailTextField({username, setUsername, usernameError, setUsernameError, label='Email', disabled = false}) {

    const validateUsername = (value) => {
        let isValid = true;
        let errMessage = '';

        if (value && value.length < 5) {
            errMessage = 'Почта должна быть длинее 4 символов. ';
            isValid = false;
        }
        if (value && !/^(?!\.)[A-Za-z0-9+_.-]+(?<!\.)@(?!\.)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value)) {
            errMessage += 'Некорректный формат email. ';
            isValid = false;
        }
        if (value && value.length > 200) {
            errMessage += 'Почта должна быть короче 200 символов. ';
            isValid = false;
        }


        if (isValid) {
            setUsernameError('');
        } else {
            setUsernameError(errMessage);
        }
        setUsername(value);
    }

    useEffect(() => {
        validateUsername(username);
    }, [username])

    return (

        <ValidatedTextField
            id="username"
            label={label}
            placeholder="Латинские буквы и цифры "
            type="text"
            disabled = {disabled}
            value={username}
            onChange={(e) => validateUsername(e.target.value)}
            error={usernameError}
            helperText={usernameError}
        />
    )
}