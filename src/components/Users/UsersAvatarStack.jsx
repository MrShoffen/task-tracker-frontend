import {Box, IconButton} from "@mui/material";
import * as React from "react";
import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import {UserAvatar} from "./UserAvatar.jsx";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from '@mui/icons-material/Settings';
import {useState} from "react";
import PermissionsModal from "../Modals/PermissionsModal.jsx";


export function UsersAvatarStack({workspace}) {
    const {auth} = useAuthContext();

    const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
    const handlePermOpen = () => {
        setPermissionsModalOpen(true);
    }
    const closePermModal = () => {
        setPermissionsModalOpen(false);
    }

    if (!workspace) {
        return null;
    }

    const uap = workspace.usersAndPermissions;

    const overflow = uap.length - 4;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
                border: '1px solid',
                borderColor: 'action.disabled',
                borderRadius: 2,
                p: 1
            }}
        >
            <UserAvatar userInfo={uap.find(usr => usr.userId === workspace.userId).info}
            />

            {uap
                .filter(user => user.userId !== workspace.userId)
                .slice(0, 3)
                .map(user =>
                    <UserAvatar userInfo={user.info}
                                sx={{
                                    width: '33px',
                                    height: '33px',
                                    mt: '4px'
                                }}
                    />
                )}
            {
                overflow > 0 &&
                <Typography sx={{
                    backgroundColor: 'rgba(126,126,126,0.67)',
                    p: '2px',
                    mt: '10px',
                    height: '22px',
                    borderRadius: 1,
                    fontSize: '0.9rem'
                }}>
                    +{overflow}
                </Typography>
            }

            <IconButton
                onClick={handlePermOpen}
                sx={{
                    width: '30px',
                    height: '30px',
                    ml: 1,
                    mt: '5px',
                    // border: '2px solid',

                    // borderColor: 'success.main',
                }}>
                <AddIcon sx={{fontSize: '24px'}}/>
            </IconButton>

            <PermissionsModal open={permissionsModalOpen} onClose={closePermModal}
                              workspace={workspace}/>
        </Box>
    )
}