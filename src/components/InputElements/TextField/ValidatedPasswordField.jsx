import ValidatedTextField from "./ValidatedTextField.jsx";
import * as React from "react";
import {useEffect} from "react";


export default function ValidatedPasswordField({password, setPassword,
                                               passwordError, setPasswordError,
                                               label='Пароль'}) {
    const validatePassword = (value) => {
        let isValid = true;
        let errMessage = '';

        if (value && value.length < 5) {
            errMessage = 'Пароль должен быть длинее 4 символов. ';
            isValid = false;
        }
        if (value && !/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>[\]/`~+=-_';]*$/.test(value)) {
            errMessage += 'Недопустимые символы в пароле ';
            isValid = false;
        }
        if (value && value.length > 20) {
            errMessage += 'Пароль должен быть короче 20 символов. ';
            isValid = false;
        }

        if (isValid) {
            setPasswordError('');
        } else {
            setPasswordError(errMessage);
        }
        setPassword(value);
        localStorage.setItem('password', value);

    }

    useEffect(() => {
        validatePassword(password);
    },[password]);

    return (
        <ValidatedTextField
            id="password"
            label={label}
            type="password"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
            helperText={passwordError}

        />
    )
}