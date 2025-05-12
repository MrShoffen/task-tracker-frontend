import ValidatedTextField from "./ValidatedTextField.jsx";
import * as React from "react";
import {useEffect} from "react";


export default function ValidatedFileName({filename, setFilename, filenameError, setFilenameError, label='Название'}) {

    const validateUsername = (value) => {
        let isValid = true;
        let errMessage = '';

        if (value && value.length === 0) {
            errMessage = 'Имя пользователя не должно быть пустым. ';
            isValid = false;
        }

        if (value && value.length > 250) {
            errMessage = 'Имя пользователя не должно быть больше 250 символов. ';
            isValid = false;
        }

        if (value && !/^[^/\\:*?"<>|]+$/.test(value)) {
            errMessage += 'Недопустимые символы в имени. ';
            isValid = false;
        }

        if (isValid) {
            setFilenameError('');
        } else {
            setFilenameError(errMessage);
        }
        setFilename(value);
    }

    useEffect(() => {
        validateUsername(filename);
    }, [filename])

    return (

        <ValidatedTextField
            id="filename"
            label={label}

            type="text"

            value={filename}
            onChange={(e) => validateUsername(e.target.value)}
            error={filenameError}
            helperText={filenameError}
        />
    )
}