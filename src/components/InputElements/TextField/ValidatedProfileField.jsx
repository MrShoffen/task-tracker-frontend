import ValidatedTextField from "./ValidatedTextField.jsx";
import * as React from "react";
import {useEffect} from "react";


export default function ValidatedProfileField({name, setName,  label='Название', id}) {

    const validateUsername = (value) => {
        setName(value);
    }

    useEffect(() => {
        validateUsername(name);
    }, [name])

    return (

        <ValidatedTextField
            id={id}
            label={label}
            placeholder={"что угодно"}
            type="text"

            value={name}
            onChange={(e) => validateUsername(e.target.value)}
        />
    )
}