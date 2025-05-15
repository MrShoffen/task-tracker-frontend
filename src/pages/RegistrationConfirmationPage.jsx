import {Button, Card, CircularProgress} from "@mui/material";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuthContext} from "../context/Auth/AuthContext.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import UnauthorizedException from "../exception/UnauthorizedException.jsx";
import {sendRegistrationConfirm} from "../services/fetch/unauth/SendRegistrationConfirm.js";


export const RegistrationConfirmationPage = () => {
    const {login} = useAuthContext();

    const [confirmationInProgress, setConfirmationInProgress] = useState(true);
    const [confirmationError, setConfirmationError] = useState('');

    const {showError} = useNotification();

    const location = useLocation();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    useEffect(() => {
        const func = async () => {
            const params = new URLSearchParams(location.search);
            const confirmationId = params.get('confirmationId');

            setEmail(localStorage.getItem("email"));
            setPass(localStorage.getItem("pass"));
            localStorage.removeItem("pass");
            localStorage.removeItem("email");

            if (confirmationId && confirmationInProgress) {
                console.log("Получен confirmation ID:", confirmationId);

                try {
                    await sendRegistrationConfirm(confirmationId);
                } catch (error) {
                    switch (true) {
                        case error instanceof UnauthorizedException:
                            setConfirmationError(error.message);
                            break;
                        default:
                            showError("Не удалось подвтердить. Попробуйте позже");
                            console.log('Unknown error occurred! ');
                    }
                }
                setConfirmationInProgress(false);
            }
        }
        if (confirmationInProgress) {
            setTimeout(() => func(), 1500);
        }
    }, [location]);
    const navigate = useNavigate()
    function handleAutoLogin() {
        const loginData = {
            email: email,
            password: pass
        }

        navigate("/login", {state: loginData});
    }

    return (
        <Card variant="outlined"
              sx={{
                  padding: 2,
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
                {confirmationInProgress ? 'Проверка ссылки...' :
                    confirmationError ? 'Ошибка' : 'Успешно!'}
            </Typography>

            {confirmationInProgress ? <CircularProgress
                    sx={{width: 20, mt: 2}}/> :
                <>
                    <Typography variant="body1" sx={{textAlign: 'center', mb: 5}}>
                        {confirmationError
                            ? confirmationError
                            : 'Почта подтверждена. Теперь Вы можете войти в аккаунт'}
                    </Typography>
                    {!confirmationError &&
                        <Button
                            loadingPosition="center"
                            fullWidth
                            type="submit"
                            variant="contained"
                            onClick={handleAutoLogin}
                            sx={{
                                width: '300px',
                                alignSelf: 'center',
                            }}
                        >
                            Войти
                        </Button>
                    }

                </>
            }


        </Card>
    )
}

