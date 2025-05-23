import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import * as React from "react";
import {useState} from "react";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import UnauthorizedException from "../../exception/UnauthorizedException.jsx";
import {Box, Button, Card, IconButton, Modal, Slide, Tooltip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import ValidatedEmailTextField from "../InputElements/TextField/ValidatedEmailTextField.jsx";
import {sendEditEmail} from "../../services/fetch/user/SendEditEmail.js";
import ConflictException from "../../exception/ConflictException.jsx";
import AnimatedElement from "../InputElements/AnimatedElement.jsx";
import ValidatedProfileField from "../InputElements/TextField/ValidatedProfileField.jsx";
import {sendEditEmailConfirm} from "../../services/fetch/user/SendEditEmailConfirmCode.js";
import {checkJwt} from "../../services/fetch/jwt/CheckJwt.js";

export default function EmailChangeModal({open, onClose}) {
    const {auth, login} = useAuthContext();

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const [loading, setLoading] = useState(false);

    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState('');

    const {showSuccess, showWarn} = useNotification();
    const handleEmailConfirmationSendCode = async () => {
        try {
            setLoading(true);
            const editInformation = {newEmail: username}
            await sendEditEmail(editInformation);
            setCodeSent(true);

        } catch (error) {
            console.log(error);
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
                    console.log('Unknown error occurred! ');
            }
        }
        setLoading(false);
    };

    const [approvingLoading, setApprovingLoading] = useState(false);

    const approveCode = async () => {
        setApprovingLoading(true);
        try {
            setLoading(true);
            await sendEditEmailConfirm(code);
            const user = await checkJwt();
            if (user !== auth.user) {
                login(user);
            }
            clearFields();
            onClose();
            showSuccess("Почта обновлена!", 3000);
        } catch (error) {
            console.log(error);
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
                    console.log('Unknown error occurred! ');
            }
        }
        setApprovingLoading(false);
    }


    const clearFields = () => {
        setUsername('')
        setLoading(false);
        setApprovingLoading(false);
        setCodeSent(false);
        setCode('');
    };

    if (auth.isAuthenticated) {
        return (
                <Modal open={open} onClose={() => {
                    onClose();
                    clearFields()
                }}>
                        <Card variant="outlined"
                              sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  width: {sm: '400px', xs: '100%'},
                                  maxWidth: {sm: '330px', xs: '90%'},
                                  padding: 2,
                                  gap: 2,
                                  margin: 'auto',
                                  marginTop: "70px",
                                  backgroundColor: "modal",
                                  backdropFilter: 'blur(16px)',
                                  WebkitBackdropFilter: 'blur(16px)',
                                  boxShadow: 5,
                                  borderRadius: 2,
                                  position: "relative",
                              }}
                        >


                            <IconButton
                                aria-label="close"
                                size="small"
                                onClick={() => {
                                    onClose();
                                    clearFields()
                                }}
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    width: '25px',
                                    height: '25px',
                                }}
                            >
                                <CloseIcon sx={{fontSize: '25px'}}/>
                            </IconButton>

                            <Typography variant="h6" textAlign="center" sx={{width: '100%', mb: 1}}>
                                Смена почты
                            </Typography>


                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1,}}>

                                <Tooltip
                                    title={usernameError}
                                    placement="bottom"
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
                                                borderRadius: 2,
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
                                            label="Новый Email"
                                            disabled={codeSent}
                                        />
                                    </Box>
                                </Tooltip>


                                <Box display={codeSent ? 'none' : 'flex'} justifyContent="flex-end" gap={2}>
                                    <Button size="small" variant="outlined" onClick={() => {
                                        onClose();
                                        clearFields()
                                    }}>
                                        Отмена
                                    </Button>

                                    <Button variant="contained" size="small" onClick={handleEmailConfirmationSendCode}
                                            loading={loading}
                                            disabled={codeSent || username.length === 0 || usernameError !== ''}
                                    >
                                        Получить код
                                    </Button>
                                </Box>

                                <AnimatedElement condition={codeSent}>
                                    <Typography sx={{fontSize: '0.9rem', mb: '3px'}}>
                                        На новую почту был отправлен код для подтверждения. Код действителен в течении
                                        10 минут
                                    </Typography>
                                    <ValidatedProfileField
                                        label={"Код подтверждения"}
                                        name={code}
                                        setName={setCode}
                                        id={"code"}
                                    />


                                    <Box display="flex" justifyContent="flex-end" gap={2}>
                                        <Button size="small" variant="outlined" onClick={() => {
                                            onClose();
                                            clearFields()
                                        }}>
                                            Отмена
                                        </Button>

                                        <Button variant="contained" size="small" onClick={approveCode}
                                                loading={approvingLoading}
                                                disabled={code === '' || code.length !== 4}
                                        >
                                            Подтвердить
                                        </Button>
                                    </Box>
                                </AnimatedElement>

                            </Box>
                        </Card>
                </Modal>
        )
    }
};