import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import * as React from "react";
import DeskIcon from '@mui/icons-material/Desk';
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {useNavigate} from "react-router-dom";
import UnauthorizedException from "../../exception/UnauthorizedException.jsx";
import NotFoundException from "../../exception/NotFoundException.jsx";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";

export default function WorkspaceListElement({workspace}) {
    const {showError, showInfo, showWarn} = useNotification();

    const {loadFullWorkspace} = useTaskOperations();
    const navigate = useNavigate()
    const loadFullWorkspaceDetails = () => {

    }

    function handleClick() {
      navigate('workspaces/' + workspace.id);
    }

    return (

        <ListItemButton
            sx={{
                pl: 3,
                maxHeight: 33
            }}
            onClick={handleClick}
            selected={location.pathname === ('/workspaces/' + workspace.id)}
        >
            <ListItemIcon>
                <DeskIcon sx={{fontSize: "16px"}}/>
            </ListItemIcon>
            <ListItemText primary={workspace.name} sx={{
                opacity: open ? 1 : 0,
                '& .MuiTypography-root': {
                    ml: -4,
                    fontSize: '0.8rem',
                }
            }}/>
        </ListItemButton>
    )

}