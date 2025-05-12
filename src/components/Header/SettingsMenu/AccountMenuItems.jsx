import {Divider, ListItemIcon, MenuItem} from "@mui/material";
import {AccountCircle, GitHub, Help, Logout, Settings} from "@mui/icons-material";
import {sendLogout} from "../../../services/fetch/auth/user/SendLogout.js";
import {useAuthContext} from "../../../context/Auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../../context/Notification/NotificationProvider.jsx";


export const accountMenuItems = (openProfileModal, openSecurityModal) => {
    const {logout} = useAuthContext();
    const navigate = useNavigate();
    const {showInfo} = useNotification();

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


    return (
        <>
            <MenuItem onClick={openProfileModal}>
                <ListItemIcon>
                    <AccountCircle fontSize="small"/>
                </ListItemIcon> Настройки профиля
            </MenuItem>
            <MenuItem onClick={openSecurityModal}>
                <ListItemIcon>
                    <Settings fontSize="small"/>
                </ListItemIcon>
                Настройки безопасности
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() =>navigate("/help")}>
                <ListItemIcon>
                    <Help fontSize="small"/>
                </ListItemIcon>
                Помощь
            </MenuItem>
            <MenuItem
                component="a"
                href="https://github.com/MrShoffen/cloud-storage-rest-api"
                target="_blank"
                rel="noopener noreferrer"
                sx={{'&:hover': {textDecoration: 'none', color: 'inherit',}}}
            >
                <ListItemIcon>
                    <GitHub fontSize="small"/>
                </ListItemIcon>
                Исходный код проекта
            </MenuItem>
            <Divider/>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <Logout fontSize="small"/>
                </ListItemIcon>
                Выход
            </MenuItem>
        </>
    )
}