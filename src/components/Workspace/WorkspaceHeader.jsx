import {Box, IconButton} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import {UsersAvatarStack} from "../Users/UsersAvatarStack.jsx";
import WorkspaceEditModal from "../Modals/WorkspaceEditModal.jsx";

export default function WorkspaceHeader({workspace}) {

    const [workspaceEditOpen, setWorkspaceEditOpen] = React.useState(false);
    const handleWorkspaceOpen = () => {
        setWorkspaceEditOpen(true);
    }
    const closeWsModal = () => {
        setWorkspaceEditOpen(false);
    }
    return (
        <Box sx={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
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
            <Typography variant="h6" sx={{
                ml: 2, width: '250px', textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {workspace.name}
            </Typography>
            <IconButton
                onClick={handleWorkspaceOpen}
                sx={{ml: 1, mr: 2}}>
                <SettingsIcon/>
            </IconButton>

            <UsersAvatarStack users={workspace.usersAndPermissions}/>

            <WorkspaceEditModal workspace={workspace} onClose={closeWsModal} open={workspaceEditOpen}/>
        </Box>
    )
}