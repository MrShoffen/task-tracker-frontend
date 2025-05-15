import {Box, Button, Card, Divider, Link, ToggleButton, ToggleButtonGroup, Tooltip, Zoom} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import ValidatedEmailTextField from "../components/InputElements/TextField/ValidatedEmailTextField.jsx";
import ValidatedPasswordField from "../components/InputElements/TextField/ValidatedPasswordField.jsx";
import AnimatedElement from "../components/InputElements/AnimatedElement.jsx";
import {useNavigate} from "react-router-dom";
import ValidatedAvatarInput from "../components/InputElements/AvatarInput/ValidatedAvatarInput.jsx";
import ValidatedPasswordConfirmField from "../components/InputElements/TextField/ValidatedPasswordConfirmField.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {sendRegistrationForm} from "../services/fetch/unauth/SendRegistrationForm.js";
import ConflictException from "../exception/ConflictException.jsx";
import UnauthorizedException from "../exception/UnauthorizedException.jsx";

const FlipCard = ({isFlipped, front, back, height = 530, width = 400}) => {

    return (
        <Box
            sx={{
                perspective: '1500px',
                width: `400px`,
                height: `500px`,
                position: 'fixed',
                left: '50%',
                transform: 'translate(-50%, 0%)',
                top: '350px',
                // backgroundColor: 'searchInput',
                alignSelf: 'center',

            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.8s',
                    top: '-35px',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT SIDE */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {front}
                </Box>

                {/* BACK SIDE */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {back}
                </Box>
            </Box>
        </Box>
    );
};


export const RegistrationPage = () => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [email, setEmail] = useState('')
    const [usernameError, setUsernameError] = useState('');

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [registrationLoading, setRegistrationLoading] = useState(false);

    const navigate = useNavigate();
    const {showError, showWarn, showSuccess} = useNotification();

    const [isFlipped, setIsFlipped] = useState(false);

    const [confirmationLink, setConfirmationLink] = useState('');

    const handleSubmit = async () => {
        if (usernameError || passwordError || confirmPasswordError) {
            return;
        }

        const requestData = {email, password, avatarUrl};

        try {
            setRegistrationLoading(true);
            const response = await sendRegistrationForm(requestData);
            setConfirmationLink(response.link);
            setIsFlipped(true)
            localStorage.setItem("email", email);
            localStorage.setItem("pass", password);
            // showSuccess("Регистрация успешно выполнена", 5000);
        } catch (error) {
            switch (true) {
                case error instanceof ConflictException:
                    showWarn(error.message);
                    setUsernameError(error.message);
                    break;
               case error instanceof UnauthorizedException:
                   showWarn(error.message);
                   setUsernameError(error.message);
                   break;
                default:
                    showError("Не удалось зарегистрироваться. Попробуйте позже");
                    console.log('Unknown error occurred! ');
            }
        }
        setRegistrationLoading(false);
    };

    const shouldShowPasswordField = !usernameError && email.length > 0;
    const shouldShowValidatePasswordField = !passwordError && shouldShowPasswordField && password.length > 0;
    const shouldShowButton = shouldShowValidatePasswordField && !confirmPasswordError && confirmPassword.length > 0;

    return (
        <FlipCard
            isFlipped={isFlipped}
            front={
                <Card variant="outlined"
                      sx={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          boxShadow: 3,
                          borderRadius: 2,
                          width: '400px',
                          height: '530px',
                          backgroundColor: 'background.paper',
                      }}
                >

                    <Typography component="h1" variant="h4" sx={{textAlign: 'center', mb: 2, mt: 3}}>

                        Регистрация
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2,}}>

                            <ValidatedAvatarInput
                                setAvatarUrl={setAvatarUrl}
                                avatarLoading={avatarLoading}
                                setAvatarLoading={setAvatarLoading}
                            />

                            <Divider sx={{m: 1.5, mt: -0.8, mb: 1}}/>

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
                                        username={email}
                                        setUsername={setEmail}
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

                            <Tooltip
                                title={confirmPasswordError}
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
                                    <ValidatedPasswordConfirmField
                                        confirmPassword={confirmPassword}
                                        setConfirmPassword={setConfirmPassword}
                                        confirmPasswordError={confirmPasswordError}
                                        setConfirmPasswordError={setConfirmPasswordError}
                                        originalPassword={password}
                                    />
                                </Box>
                            </Tooltip>


                            <Button
                                fullWidth
                                // type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!shouldShowButton}
                                loading={registrationLoading || avatarLoading}
                                loadingPosition="center"
                                sx={{width: '300px', alignSelf: 'center'}}
                            >
                                Зарегистрироваться
                            </Button>


                            <Typography variant="body1" component="p"
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            width: '100%',
                                            bottom: 15,
                                            textAlign: 'center'
                                        }}>
                                Уже зарегистрированы?{' '}
                                <Link sx={{color: '#1976d2', cursor: 'pointer'}}
                                      onClick={() => navigate("/login")}>
                                    Войти
                                </Link>
                            </Typography>
                        </Box>
                    </form>

                </Card>
            }
            back={
                <Card variant="outlined"
                      sx={{
                          padding: 4,
                          boxShadow: 3,
                          position: 'fixed',
                          alignSelf: 'center',
                          borderRadius: 2,
                          width: '400px',
                          height: '530px',
                          backgroundColor: 'background.paper',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column'
                      }}
                >
                    <Typography variant="h5" sx={{mb: 10, mt: -10}}>
                        Подтверждение регистрации!
                    </Typography>
                    <Typography variant="body1" sx={{textAlign: 'center', mb: 5}}>
                        На Вашу почту отправлено письмо для подтвреждения почты. Пройдите по ссылке из письма для
                        подтверждения. Скорее всего, письмо попало в папку "Спам"
                    </Typography>
                    <Typography variant="body21" sx={{textAlign: 'center', mt: 2}}>
                        Или можете пройти по этой <a href={confirmationLink}> ссылке </a>- она такая же как в почте :)
                    </Typography>

                </Card>
            }
        />
    )
}