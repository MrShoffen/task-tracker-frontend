import {useAuthContext} from "../context/Auth/AuthContext.jsx";
import {Card, CircularProgress, Container} from "@mui/material";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
import {sendRegistrationForm} from "../services/fetch/unauth/SendRegistrationForm.js";
import {sendLoginForm} from "../services/fetch/unauth/SendLoginForm.js";
import {API_IMAGE_UPLOAD} from "../../UrlConstants.jsx";
import {useNavigate} from "react-router-dom";
import {sendRegistrationConfirm} from "../services/fetch/unauth/SendRegistrationConfirm.js";


function getSecureRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues); // Браузерный API
    return Array.from(randomValues, (num) =>
        chars[num % chars.length]
    ).join('');
}

export default function FastLogin() {

    const {login, auth} = useAuthContext();

    const navigate = useNavigate();
    const [loginInProgress] = useState(false);
    const [registrationInProgress, setRegistrationInProgress] = useState(true);

    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");

    async function fetchFastLogin() {


        // setImage(finalImage.imageUrl);
        setUsername(getSecureRandomString(10) + '@test.ru');
        setRegistrationInProgress(false);
    }


    async function registerFake() {
        const registerData = {email: username, password: username, avatarUrl: image};

        const newVar = await sendRegistrationForm(registerData);

        const link = new URL(newVar.link);
        // const link = await newVar.json();
        const confirmId = link.search.replace("?confirmationId=", "");
        console.log(confirmId);

        const confirm = await sendRegistrationConfirm(confirmId);
        console.log(confirm);

        // window.location.href = newVar.link;


        const loginData = {email: username, password: username};

        console.log(loginData);

        setTimeout(async () => {
            const profile = await sendLoginForm(loginData);
            login(profile);
        }, 1000)


    }

    useEffect(() => {
        if (!auth.isAuthenticated) {
            fetchFastLogin()
        }
    }, []); // Пустой массив зависимостей

    useEffect(() => {
        if (username) {
            setRegistrationInProgress(false);
            registerFake();
        }

    }, [username])


    return (
        <Container
            disableGutters
            // maxWidth="md"
            sx={{
                p: 1,
                mt: 8,
                width: '100%',
                // p: { xs: 0, md: 0 }, // Отступы только на десктопе
                // maxWidth: { md: 'md' } // Ограничение ширины на больших экранах
            }}
        >


            <Card
                elevation={0}
                sx={{
                    backgroundColor: "searchInput",
                    width: "100%",

                    height: "100vh",
                    boxShadow: 4,
                    borderRadius: 2,
                    p: 2,
                    position: "relative",
                    alignItems: "center",
                    alignSelf: "center",
                    // Адаптивные отступы внутри карточки
                }}
            >
                {loginInProgress && <Typography>Logging in</Typography>}


                <Box
                    sx={{
                        textAlign: 'center',
                        position: 'absolute',
                        transform: 'translateX(-50%)',
                        top: 20,
                        left: '50%'
                    }}

                >
                    <Typography variant="h5">
                        {registrationInProgress ? "Регистрируем аккаунт..." : "Входим в аккаунт"}
                    </Typography> <CircularProgress
                    sx={{width: 20, mt: 2}}/>
                </Box>

                {image &&
                    <Box component="img" src={image}
                         sx={{
                             height: 300,
                             border: '2px solid',
                             borderRadius: 2,
                             borderColor: 'success.main',
                             position: 'absolute',
                             transform: 'translateX(-50%)',
                             top: 160,
                             left: '50%'
                         }}
                    />
                }

                {username !== "" &&
                    <Box
                        sx={{
                            textAlign: 'center',
                            position: 'absolute',
                            transform: 'translateX(-50%)',
                            top: 470,
                            left: '50%'
                        }}
                    >
                        <Typography variant="h7">
                            Имя пользователя: {username}
                        </Typography>
                    </Box>
                }


            </Card>
        </Container>
    )
}