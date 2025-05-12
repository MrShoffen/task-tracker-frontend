import {Divider, ListItemIcon, MenuItem} from "@mui/material";
import {GitHub, Help} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


export const authenticationMenuItems = () => {
    const navigate = useNavigate();

    return (
        <>
            <MenuItem onClick={() => {
                navigate("/login");
            }}>
                <ListItemIcon>
                    <LoginIcon fontSize="small"/>
                </ListItemIcon> Вход
            </MenuItem>
            <MenuItem onClick={() => {
                navigate("/registration");
            }}>
                <ListItemIcon>
                    <PersonAddIcon fontSize="small"/>
                </ListItemIcon>
                Регистрация
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() =>navigate("/help")}>

                <ListItemIcon>
                    <Help fontSize="small"/>
                </ListItemIcon>
                Помощь
            </MenuItem>
            <MenuItem component="a" href="https://github.com/MrShoffen/cloud-storage-rest-api"
                      target="_blank" rel="noopener noreferrer"
                      sx={{'&:hover': {textDecoration: 'none', color: 'inherit',}}}
            >
                <ListItemIcon>
                    <GitHub fontSize="small"/>
                </ListItemIcon>
                Исходный код проекта
            </MenuItem>
        </>
    )
}