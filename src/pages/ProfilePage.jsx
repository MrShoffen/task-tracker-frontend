import {Box, Button, Card, CardContent, Divider, useTheme} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {useAuthContext} from "../context/Auth/AuthContext.jsx";
import ValidatedAvatarInput from "../components/InputElements/AvatarInput/ValidatedAvatarInput.jsx";
import {useNavigate} from "react-router-dom";
import {sendLogout} from "../services/fetch/user/SendLogout.js";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import ValidatedProfileField from "../components/InputElements/TextField/ValidatedProfileField.jsx";
import {sendEditUser} from "../services/fetch/user/SendEditUser.js";
import UnauthorizedException from "../exception/UnauthorizedException.jsx";
import NotFoundException from "../exception/NotFoundException.jsx";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PasswordChangeModal from "../components/Modals/PasswordChangeModal.jsx";
import {sendEditAvatar} from "../services/fetch/user/SendEditAvatar.js";
import EmailChangeModal from "../components/Modals/EmailChangeModal.jsx";
import {uploadImage} from "../services/fetch/unauth/UploadImage.js";
import {checkJwt} from "../services/fetch/jwt/CheckJwt.js";


export default function ProfilePage() {
    const {auth, login, logout} = useAuthContext();

    const navigate = useNavigate();

    const {showError, showInfo, showSuccess, showWarn} = useNotification();
    const [avatarUrl, setAvatarUrl] = useState('');

    const [avatarLoading, setAvatarLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [country, setCountry] = useState('');

    const [email, setEmail] = useState('');

    const [region, setRegion] = useState('');

    useEffect(() => {
        console.log(auth.user)
        setAvatarUrl(auth.isAuthenticated ? auth.user.avatarUrl : '');
        setEmail(auth.user.email);
        setFirstName(auth.user.firstName);
        setLastName(auth.user.lastName);
        setCountry(auth.user.country);
        setRegion(auth.user.region);
    }, [auth.user]);

    const disableProfileSave = auth.user.firstName === firstName && auth.user.lastName === lastName
        && auth.user.country === country && auth.user.region === region;

    const disableAvatarUpdate = auth.user.avatarUrl === avatarUrl;

    const handleLogout = async () => {
        try {
            await sendLogout();
            logout();
            setTimeout(() => {
                navigate("/login");
                showInfo("Выход успешно выполнен", 4000);
            }, 400);
        } catch (error) {
            console.log('Unknown error occurred! ');
        }
    }

    const handleProfileEdit = async () => {
        try {
            const editData = {
                firstName: firstName,
                lastName: lastName,
                country: country,
                region: region,
            }
            const updatedUser = await sendEditUser(editData);
            console.log(updatedUser);
            showSuccess("Данные обновлены!", 2000);
            login(updatedUser)
        } catch (error) {
            switch (true) {
                case error instanceof UnauthorizedException:
                    showWarn(error.message);
                    break;
                case error instanceof NotFoundException:
                    showWarn(error.message);
                    break;
                default:
                    showError("Ошибка. Попробуйте позже");
                    console.log(error);
            }
        }
    }

    const handleAvatarEdit = async () => {
        try {
            const editData = {
                avatarUrl: avatarUrl,
            }
            const updatedUser = await sendEditAvatar(editData);
            console.log(updatedUser);
            showSuccess("Аватар обновлен!", 2000);
            login(updatedUser)
        } catch (error) {
            switch (true) {
                case error instanceof UnauthorizedException:
                    showWarn(error.message);
                    break;
                case error instanceof NotFoundException:
                    showWarn(error.message);
                    break;
                default:
                    showError("Ошибка. Попробуйте позже");
                    console.log(error);
            }
        }
    }

    const [passwordModalOpened, setPasswordModalOpened] = React.useState(false);
    const handlePasswordChange = () => {
        setPasswordModalOpened(true);
    }
    const closePasswordModal = () => {
        setPasswordModalOpened(false);
    }

    const [emailModalOpened, setEmailModalOpened] = React.useState(false);
    const handleEmailChange = () => {
        setEmailModalOpened(true);
    }
    const closeEmailModal = async () => {
        const updatedUser = await checkJwt();
        login(updatedUser)
        setEmailModalOpened(false);
    }


    return (
        <Box sx={{
            flex: 1
        }}>
            <Box sx={{
                height: '65px',
                backgroundColor: 'header',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'action.selected',
                px: 2,
                boxShadow: 3
            }}>
                <Typography variant="h6" sx={{ml: 2}}>Настройки</Typography>
            </Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'left',

                fontSize: '0.9rem',
            }}>

                <Box sx={{
                    p: 2,
                    maxWidth: '1000px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {/* Первый ряд */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: {xs: 'column', md: 'row'}
                    }}>
                        <Card sx={{
                            flex: 1,
                            boxShadow: 1,
                            border: '1px solid',
                            borderRadius: 2,
                            position: 'relative',
                            backdropFilter: 'blur(9px)',
                            WebkitBackdropFilter: 'blur(9px)',
                            backgroundColor: 'card',
                            p: 1,
                            borderColor: 'action.disabled',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            minWidth: 0,
                            minHeight: '260px'
                        }}>
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 10,
                                    '&:hover': {
                                        borderColor: 'error.main',
                                    }
                                }}
                                onClick={handleLogout}
                            >Выход</Button>
                            <Typography variant="h6" sx={{m: 1, alignSelf: 'center'}}>Аккаунт</Typography>

                            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                                <ValidatedAvatarInput
                                    setAvatarUrl={setAvatarUrl}
                                    initialAvatarUrl={avatarUrl}
                                    avatarLoading={avatarLoading}
                                    setAvatarLoading={setAvatarLoading}
                                    multi={1.9}
                                />

                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleAvatarEdit}
                                    sx={{
                                        position: 'absolute',
                                        top: 210,
                                        left: 8
                                    }}
                                    loading={avatarLoading}
                                    disabled={disableAvatarUpdate}
                                >
                                    Сохранить аватар
                                </Button>
                                <Box sx={{ml: 1, display: 'flex', flexDirection: 'column'}}>

                                    <Typography sx={{ml: 2, mt: 1, pr: 3, fontWeight: 500}}
                                                variant="h5">{email}</Typography>

                                    <Divider sx={{mt: 1, mb: 1}}/>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleEmailChange}
                                        sx={{
                                            mb: 1, mt: 1, maxHeight: 40, ml: 0
                                        }}
                                    >
                                        Сменить почту
                                    </Button>

                                    <Button
                                        variant="outlined"

                                        size="small"
                                        onClick={handlePasswordChange}
                                        sx={{
                                            mb: 2, mt: 1, maxHeight: 40, ml: 0
                                        }}
                                    >
                                        Сменить пароль
                                    </Button>

                                </Box>

                                <ManageAccountsIcon
                                    sx={{
                                        position: 'absolute',
                                        color: 'info.light',
                                        fontSize: '230px',
                                        right: -20,
                                        bottom: -39,
                                        display: {xs: 'none', md: 'block'}
                                    }}/>
                            </Box>

                        </Card>
                        <Card sx={{
                            flex: 1,
                            boxShadow: 1,
                            border: '1px solid',
                            borderRadius: 2,
                            position: 'relative',
                            maxWidth: {xs: 'none', md: 350},
                            minHeight: 360,
                            backdropFilter: 'blur(9px)',
                            WebkitBackdropFilter: 'blur(9px)',
                            backgroundColor: 'card',
                            p: 1,
                            gap: 1,
                            pl: 3,
                            borderColor: 'action.disabled',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            minWidth: 0
                        }}>
                            <Typography variant="h6" sx={{m: 1, alignSelf: 'center'}}>Личные данные</Typography>


                            <ValidatedProfileField
                                label={"Имя"}
                                name={firstName}
                                setName={setFirstName}
                                id={"firstName"}
                            />

                            <ValidatedProfileField
                                label={"Фамилия"}
                                name={lastName}
                                setName={setLastName}
                                id={"secondName"}

                            />

                            <ValidatedProfileField
                                label={"Страна"}
                                name={country}
                                setName={setCountry}
                                id={"country"}
                            />

                            <ValidatedProfileField
                                label={"Регион/город"}
                                name={region}
                                setName={setRegion}
                                id={"region"}
                            />

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleProfileEdit}
                                    sx={{
                                        mb: 2, mt: 1
                                    }}
                                    disabled={disableProfileSave}
                                >
                                    Сохранить
                                </Button>
                            </Box>
                        </Card>
                    </Box>

                    {/* Второй ряд */}
                    <Card sx={{
                        boxShadow: 1,
                        borderRadius: 2,
                        backdropFilter: 'blur(9px)',
                        WebkitBackdropFilter: 'blur(9px)',
                        backgroundColor: 'card',
                        border: '1px solid',
                        borderColor: 'action.disabled',
                    }}>
                        <CardContent>
                            {/*Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC*/}
                            {/*"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque*/}
                            {/*laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi*/}
                            {/*architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit*/}
                            {/*aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione*/}
                            {/*voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,*/}
                            {/*consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et*/}
                            {/*dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum*/}
                            {/*exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi*/}
                            {/*consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil*/}
                            {/*molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"*/}

                            {/*1914 translation by H. Rackham*/}
                            {/*"But I must explain to you how all this mistaken idea of denouncing pleasure and praising*/}
                            {/*pain was born and I will give you a complete account of the system, and expound the actual*/}
                            {/*teachings of the great explorer of the truth, the master-builder of human happiness. No one*/}
                            {/*rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who*/}
                            {/*do not know how to pursue pleasure rationally encounter consequences that are extremely*/}
                            {/*painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself,*/}
                            {/*because it is pain, but because occasionally circumstances occur in which toil and pain can*/}
                            {/*procure him some great pleasure. To take a trivial example, which of us ever undertakes*/}
                            {/*laborious physical exercise, except to obtain some advantage from it? But who has any right*/}
                            {/*to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences,*/}
                            {/*or one who avoids a pain that produces no resultant pleasure?"*/}

                            {/*Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC*/}
                            {/*"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium*/}
                            {/*voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati*/}
                            {/*cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id*/}
                            {/*est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam*/}
                            {/*libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod*/}
                            {/*maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.*/}
                            {/*Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut*/}
                            {/*et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a*/}
                            {/*sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis*/}
                            {/*doloribus asperiores repellat."*/}

                            {/*1914 translation by H. Rackham*/}


                            {/*Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC*/}
                            {/*"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque*/}
                            {/*laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi*/}
                            {/*architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit*/}
                            {/*aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione*/}
                            {/*voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,*/}
                            {/*consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et*/}
                            {/*dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum*/}
                            {/*exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi*/}
                            {/*consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil*/}
                            {/*molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"*/}

                            {/*1914 translation by H. Rackham*/}
                            {/*"But I must explain to you how all this mistaken idea of denouncing pleasure and praising*/}
                            {/*pain was born and I will give you a complete account of the system, and expound the actual*/}
                            {/*teachings of the great explorer of the truth, the master-builder of human happiness. No one*/}
                            {/*rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who*/}
                            {/*do not know how to pursue pleasure rationally encounter consequences that are extremely*/}
                            {/*painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself,*/}
                            {/*because it is pain, but because occasionally circumstances occur in which toil and pain can*/}
                            {/*procure him some great pleasure. To take a trivial example, which of us ever undertakes*/}
                            {/*laborious physical exercise, except to obtain some advantage from it? But who has any right*/}
                            {/*to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences,*/}
                            {/*or one who avoids a pain that produces no resultant pleasure?"*/}

                            {/*Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC*/}
                            {/*"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium*/}
                            {/*voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati*/}
                            {/*cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id*/}
                            {/*est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam*/}
                            {/*libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod*/}
                            {/*maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.*/}
                            {/*Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut*/}
                            {/*et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a*/}
                            {/*sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis*/}
                            {/*doloribus asperiores repellat."*/}

                            1914 translation by H. Rackham
                            3</CardContent>
                    </Card>
                </Box>
            </Box>
            <PasswordChangeModal open={passwordModalOpened}
                                 onClose={closePasswordModal}
            />
            <EmailChangeModal open={emailModalOpened}
                              onClose={closeEmailModal}
            />
        </Box>
    )
}