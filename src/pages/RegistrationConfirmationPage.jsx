import {Box, Button, Card, Link, Tooltip, Zoom} from "@mui/material";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ValidatedEmailTextField from "../components/InputElements/TextField/ValidatedEmailTextField.jsx";
import ValidatedPasswordField from "../components/InputElements/TextField/ValidatedPasswordField.jsx";
import AnimatedElement from "../components/InputElements/AnimatedElement.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {sendLoginForm} from "../services/fetch/unauth/SendLoginForm.js";
import {useAuthContext} from "../context/Auth/AuthContext.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import UnauthorizedException from "../exception/UnauthorizedException.jsx";
import NotFoundException from "../exception/NotFoundException.jsx";
import {sendRegistrationConfirm} from "../services/fetch/unauth/SendRegistrationConfirm.js";


export const RegistrationConfirmationPage = () => {
    const {login} = useAuthContext();

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const {showError, showInfo, showWarn} = useNotification();

    const handleSubmit = async () => {
        if (usernameError || passwordError) {
            return
        }

        const requestData = {username, password,};

        try {
            setLoading(true);
            const profile = await sendLoginForm(requestData);
            login(profile);
            showInfo("Вход успшено выполнен", 4000);
        } catch (error) {
            switch (true) {
                case error instanceof UnauthorizedException:
                    showWarn(error.message);
                    setUsernameError(error.message);
                    break;

                case error instanceof NotFoundException:
                    showWarn(error.message);
                    setUsernameError(error.message);
                    break;
                default:
                    showError("Ошибка при попытке входа. Попробуйте позже");
                    console.log('Unknown validationError occurred! ');
            }
        }
        setLoading(false);
    };


    const validationError = usernameError || passwordError || !password || !username;

    const location = useLocation();

    // 🔽 Извлечь параметр confirmation из URL
    useEffect(() => {
        const func = async () => {
            const params = new URLSearchParams(location.search);
            const confirmationId = params.get('confirmationId');

            if (confirmationId) {
                console.log("Получен confirmation ID:", confirmationId);
                const response = await sendRegistrationConfirm(confirmationId);
                console.log(response);
            }
        }
        func();
    }, [location]);

    return (
        <Card variant="outlined"
              sx={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  boxShadow: 3,
                  position: 'fixed',
                  left: '50%',
                  transform: 'translate(-50%, 0%)',
                  top: '350px',
                  // backgroundColor: 'searchInput',
                  alignSelf: 'center',
                  borderRadius: 1,
                  width: '400px',
                  height: '330px',
                  transition: 'height 0.5s ease',
              }}>

            <Typography variant="h4" sx={{textAlign: 'center', mb: 2, mt: 3}}>
                Вход
            </Typography>


        </Card>
    )
}

