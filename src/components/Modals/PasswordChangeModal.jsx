import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import * as React from "react";
import {useState} from "react";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {sendEditUser} from "../../services/fetch/user/SendEditUser.js";
import UnauthorizedException from "../../exception/UnauthorizedException.jsx";
import {useNavigate} from "react-router-dom";
import {Box, Button, Card, IconButton, Modal, Slide, Tooltip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import ValidatedPasswordField from "../InputElements/TextField/ValidatedPasswordField.jsx";
import AnimatedElement from "../InputElements/AnimatedElement.jsx";
import ValidatedPasswordConfirmField from "../InputElements/TextField/ValidatedPasswordConfirmField.jsx";
import {sendEditPassword} from "../../services/fetch/user/SendEditPassword.js";

export default function PasswordChangeModal({open, onClose}) {
    const {auth, logout} = useAuthContext();

    const [oldPassword, setOldPassword] = React.useState('');
    const [oldPasswordError, setOldPasswordError] = React.useState('');

    const [newPassword, setNewPassword] = React.useState('')
    const [newPasswordError, setNewPasswordError] = React.useState('');

    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState('');


    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {showSuccess, showWarn} = useNotification();
    const handleSave = async () => {
        try {
            setLoading(true);
            const editInformation = {oldPassword: oldPassword, newPassword: newPassword}
            await sendEditPassword(editInformation);
            logout();
            setTimeout(() => {
                navigate("/login");
                showSuccess("Пароль изменен", 4000);
            }, 400);
        } catch (error) {
            console.log(error);
            switch (true) {
                case error instanceof UnauthorizedException:
                    setOldPasswordError(error.message);
                    showWarn(error.message);
                    break;
                default:
                    console.log('Unknown error occurred! ');
            }
        }
        setLoading(false);
        setNewPassword('')
        setConfirmPassword('')
    };


    const handlePasswordClick = () => {
        setChangeConfirmModal(true);
    };

    const handlePasswordCancel = () => {
        setChangeConfirmModal(false);
    };

    const handlePasswordConfirm = async () => {
        setChangeConfirmModal(false);
        await handleSave();
    };

    const [changeConfirmModal, setChangeConfirmModal] = useState(false);


    const clearFields = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('')
    };

    if (auth.isAuthenticated) {
        return (
            <>
                <Modal open={open} onClose={() => {
                    onClose();
                    clearFields()
                }}>
                    <Slide in={open} direction={'right'} style={{transform: "translate(-50%, 0%)", marginTop: "70px",}}>
                        <Card variant="outlined"
                              sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  width: {sm: '400px', xs: '100%'},
                                  maxWidth: {sm: '330px', xs: '90%'},
                                  padding: 2,
                                  gap: 2,
                                  margin: 'auto',
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

                            <Typography variant="h5" textAlign="center" sx={{width: '100%', mb: 1}}>
                                Смена пароля
                            </Typography>


                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2,}}>

                                <Tooltip
                                    title={oldPasswordError}
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
                                        <ValidatedPasswordField
                                            password={oldPassword}
                                            setPassword={setOldPassword}
                                            passwordError={oldPasswordError}
                                            setPasswordError={setOldPasswordError}
                                            label="Текущий пароль"
                                        />
                                    </Box>
                                </Tooltip>


                                <Tooltip
                                    title={newPasswordError}
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
                                        <AnimatedElement condition={!oldPasswordError && oldPassword.length > 0}>
                                            <ValidatedPasswordField
                                                password={newPassword}
                                                setPassword={setNewPassword}
                                                passwordError={newPasswordError}
                                                setPasswordError={setNewPasswordError}
                                                label="Новый пароль"
                                            />
                                        </AnimatedElement>
                                    </Box>
                                </Tooltip>

                                <AnimatedElement
                                    condition={!oldPasswordError && oldPassword.length > 0 && !newPasswordError && newPassword.length > 0}>
                                    <ValidatedPasswordConfirmField
                                        confirmPassword={confirmPassword}
                                        setConfirmPassword={setConfirmPassword}
                                        confirmPasswordError={confirmPasswordError}
                                        setConfirmPasswordError={setConfirmPasswordError}
                                        originalPassword={newPassword}
                                        label="Подтверждение пароля"
                                    />
                                </AnimatedElement>

                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button size="small" variant="outlined" onClick={() => {
                                        onClose();
                                        clearFields()
                                    }}>
                                        Отмена
                                    </Button>

                                    <Button variant="contained" size="small" onClick={handlePasswordClick}
                                            loading={loading}
                                            disabled={oldPasswordError || oldPassword.length === 0 || newPasswordError || newPassword.length === 0 || confirmPasswordError || confirmPassword.length === 0}
                                    >
                                        Сменить пароль
                                    </Button>
                                </Box>
                            </Box>
                        </Card>
                    </Slide>

                </Modal>


                <Modal
                    open={changeConfirmModal}
                    onClose={handlePasswordCancel}
                    aria-labelledby="confirm-delete-modal"
                    aria-describedby="confirm-delete-modal-description"
                >
                    <Slide in={changeConfirmModal} direction={'down'} style={{margin: 'auto', marginTop: "170px",}}>
                        <Card variant="outlined"
                              sx={{
                                  backgroundColor: "background.paper",
                                  width: 300,
                                  boxShadow: 24,
                                  p: 4,
                                  borderRadius: 2,
                              }}
                        >
                            <Typography
                                component="h2"
                                variant="h6"
                                sx={{textAlign: "center", mb: 1}}
                            >
                                Вы уверены, что хотите сменить пароль?
                            </Typography>
                            <Typography variant="body2" sx={{mb: 2, color: 'text.secondary'}}>
                                После смены пароля необходимо будет снова зайти в аккаунт. Все активные сессии будут
                                завершены.
                            </Typography>
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Button variant="outlined" onClick={handlePasswordCancel}>
                                    Нет
                                </Button>
                                <Button variant="contained" color="error" onClick={handlePasswordConfirm}>
                                    Да
                                </Button>
                            </Box>
                        </Card>
                    </Slide>
                </Modal>
            </>
        )
    }
};