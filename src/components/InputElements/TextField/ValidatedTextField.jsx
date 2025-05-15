import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {IconButton, InputAdornment} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";


export default function ValidatedTextField({id, label, value, onChange, helperText, placeholder, disabled = false}) {

    const [showPassword, setShowPassword] = React.useState(false);
    const handlePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormControl variant='outlined' style={{
            marginBottom: 10,
            // width: '100%'
            width: '300px',
            // alignSelf: 'center',
        }}>

            <TextField
                id={id}
                name={id}
                label={label}
                size={"small"}
                value={value}
                error={helperText}
                onChange={onChange}
                disabled={disabled}
                // helperText={helperText}
                placeholder={placeholder}
                type={!id.startsWith("password") ? 'text' : (showPassword ? "text" : "password")}
                slotProps={{


                    // inputLabel: {
                    //     sx: {fontSize: 12},
                    // },
                    input: {
                        endAdornment: (
                            id.startsWith("password") &&
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handlePasswordVisibility}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }

                }}
            />
        </FormControl>
    )
}
