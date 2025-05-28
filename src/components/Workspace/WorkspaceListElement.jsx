import {Box, IconButton, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import DeskIcon from '@mui/icons-material/Desk';
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {DeleteTask} from "../../assets/icons/DeleteTask.jsx";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {sendDeleteWs} from "../../services/fetch/tasks/ws/SendDeleteWs.js";

export default function WorkspaceListElement({workspace}) {
    const {showInfo, showWarn} = useNotification();
    const [hovered, setHovered] = React.useState(false);

    const [attemptToDelete, setAttemptToDelete] = useState(false);

    const {deleteWorkspace} = useTaskOperations();

    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setAttemptToDelete(true);
    };

    const handleConfirmDelete = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        try {
            await sendDeleteWs(workspace)
            showInfo("Пространство удалено");
            deleteWorkspace(workspace);
        } catch (error) {
            showWarn(error.message);
        }
        setDeleting(false);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setAttemptToDelete(false);
    };

    function handleClick() {
        navigate('workspaces/' + workspace.id);
    }

    return (

        <ListItemButton
            disabled={deleting}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setAttemptToDelete(false);
            }}

            sx={{
                pl: 3,
                maxHeight: 33,
                '&.Mui-selected': {
                    border: '1px solid',
                    borderLeft: 'none',
                    borderRight: 'none'
                }
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
                    maxWidth: '150px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }
            }}/>
            <Box>
                {hovered && !attemptToDelete && location.pathname !== ('/workspaces/' + workspace.id) &&

                    <IconButton disableRipple
                                onClick={handleDeleteClick}
                                sx={{
                                    width: '16px',
                                    opacity: 1, height: '16px',
                                    p: 0,
                                    mr: -1.6
                                }}>
                        <DeleteTask color={'rgba(193,9,9,0.9)'}/>
                    </IconButton>
                }

                {hovered && attemptToDelete && location.pathname !== ('/workspaces/' + workspace.id) &&
                    <Box sx={{mr: -1.6}}>
                        <IconButton disableRipple
                                    onClick={handleConfirmDelete}
                                    sx={{
                                        width: '15px',
                                        opacity: 1, height: '15px',
                                        p: 1,
                                        mr: 1,
                                        color: 'error.main'

                                    }}>
                            <CheckCircleOutlineIcon sx={{fontSize: '18px'}}/>
                        </IconButton>
                        <IconButton disableRipple
                                    onClick={handleCancelDelete}
                                    sx={{
                                        width: '15px',
                                        opacity: 1, height: '15px',
                                        p: 1,
                                        color: 'success.main'

                                    }}>
                            <DoDisturbIcon sx={{fontSize: '18px'}}/>
                        </IconButton>
                    </Box>
                }
            </Box>
        </ListItemButton>
    )

}