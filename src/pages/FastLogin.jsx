import {useAuthContext} from "../context/Auth/AuthContext.jsx";
import {Card, CircularProgress, Container} from "@mui/material";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
import {API_IMAGE_UPLOAD} from "../UrlConstants.jsx";
import {sendRegistrationForm} from "../services/fetch/unauth/SendRegistrationForm.js";
import {sendLoginForm} from "../services/fetch/unauth/SendLoginForm.js";


export default function FastLogin() {

    const {login, auth} = useAuthContext();


    const [loginInProgress] = useState(false);
    const [registrationInProgress, setRegistrationInProgress] = useState(true);

    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");

    async function fetchFastLogin() {
        const responseCat = await fetch("https://api.thecatapi.com/v1/images/search", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const cat = await responseCat.json();


        let catUrl = cat[0].url;
        const params = new URLSearchParams({image: catUrl});
        const imgBb = API_IMAGE_UPLOAD + '/url';
        const url = `${imgBb}?${params.toString()}`;

        const response = await fetch(url, {
            method: 'POST',
        });


        const finalImage = await response.json();


        setImage(finalImage.imageUrl);
        setUsername(finalImage.username);
        setRegistrationInProgress(false);
    }


    async function registerFake() {
        const registerData = {username: username, password: username, avatarUrl: image, storagePlan: 'STANDARD'};

        await sendRegistrationForm(registerData);


        const loginData = {username: username, password: username};

        setTimeout(async () => {
            const profile = await sendLoginForm(loginData);
            login(profile);
        }, 1000)


    }

    useEffect(() => {
        if(!auth.isAuthenticated) {
            fetchFastLogin()
        }
    }, []); // Пустой массив зависимостей

    useEffect(() => {
        if (username && image) {
            setRegistrationInProgress(false);
            registerFake();
        }

    }, [username, image])


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