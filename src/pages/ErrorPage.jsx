import React, {useEffect} from 'react'
import Container from "@mui/material/Container";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";


const ErrorPage = () => {

    const navigate = useNavigate();
    const {showWarn} = useNotification();
    useEffect(() => {
        navigate("/profile");
        showWarn("Страница не найдена");
    }, []);

    return (

        <Container disableGutters>
            <Box className={"errorContainer"} sx={{mt: 15}}>
                <Typography variant="h1" sx={{width: "100%", textAlign: 'center', marginBottom: 0}}>404</Typography>
                <Typography variant="h3" style={{width: "100%", textAlign: 'center', marginBottom: 0}}>Page Not
                    Found</Typography>
            </Box>
        </Container>

    )
}

export default ErrorPage