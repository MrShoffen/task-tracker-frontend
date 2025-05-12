import {Box, Button, Card, Link, Tooltip, Zoom} from "@mui/material";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import ValidatedEmailTextField from "../components/InputElements/TextField/ValidatedEmailTextField.jsx";
import ValidatedPasswordField from "../components/InputElements/TextField/ValidatedPasswordField.jsx";
import AnimatedElement from "../components/InputElements/AnimatedElement.jsx";
import {useNavigate} from "react-router-dom";
import {sendLoginForm} from "../services/fetch/unauth/SendLoginForm.js";
import {useAuthContext} from "../context/Auth/AuthContext.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import UnauthorizedException from "../exception/UnauthorizedException.jsx";
import NotFoundException from "../exception/NotFoundException.jsx";


export const LoginPage = () => {
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

            <form onSubmit={handleSubmit}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>

                    <Tooltip
                        title={usernameError}
                        placement="right"
                        arrow
                        slotProps={{
                            arrow: {
                                sx: {
                                    color: 'error.main', // светло-красный фон
                                }
                            },
                            tooltip: {
                                sx: {
                                    fontSize: 13,
                                    backgroundColor: 'error.main', // светло-красный фон
                                    // color: '#d32f2f',            // красный текст
                                    border: 'error.dark',  // красная рамка
                                    borderRadius: 2
                                }
                            }
                        }}
                    >
                        <Box>
                            <ValidatedEmailTextField
                                username={username}
                                setUsername={setUsername}
                                usernameError={usernameError}
                                setUsernameError={setUsernameError}
                            />
                        </Box>
                    </Tooltip>

                    <Tooltip
                        title={passwordError}
                        placement="right"
                        arrow
                        slotProps={{
                            arrow: {
                                sx: {
                                    color: 'error.main', // светло-красный фон
                                }
                            },
                            tooltip: {
                                sx: {
                                    fontSize: 13,
                                    backgroundColor: 'error.main', // светло-красный фон
                                    // color: '#d32f2f',            // красный текст
                                    border: 'error.dark',  // красная рамка
                                    borderRadius: 2
                                }
                            }
                        }}
                    >
                        <Box>
                            <ValidatedPasswordField
                                password={password}
                                setPassword={setPassword}
                                passwordError={passwordError}
                                setPasswordError={setPasswordError}
                            />

                        </Box>
                    </Tooltip>

                    <Button
                        loadingPosition="center"
                        fullWidth
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={validationError}
                        sx={{
                            width: '300px',
                            alignSelf: 'center',
                        }}
                    >
                        Войти
                    </Button>


                    <Typography variant="body1" component="p"
                                sx={{
                                    position: 'absolute',
                                    left: 0,
                                    width: '100%',
                                    bottom: 15,
                                    textAlign: 'center'
                                }}>
                        Еще нет аккаунта?{' '}
                        <Link sx={{color: '#1976d2', cursor: 'pointer'}}
                              onClick={() => navigate("/registration")}>
                            Регистрация
                        </Link>
                    </Typography>


                </Box>
            </form>
        </Card>
    )
}

