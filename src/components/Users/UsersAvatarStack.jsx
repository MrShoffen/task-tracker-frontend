import {Box, IconButton} from "@mui/material";
import * as React from "react";
import {useAuthContext} from "../../context/Auth/AuthContext.jsx";
import {UserAvatar} from "./UserAvatar.jsx";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";


export function UsersAvatarStack({users}) {
    const {auth} = useAuthContext();
    if(!users){
        return null;
    }

    const overflow = users.length - 4;

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
            <UserAvatar userInfo={users.find(user => user.info.email === auth.user.email).info}
            />

            {users
                .filter(user => user.info.email !== auth.user.email)
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

            <IconButton sx={{
                width: '30px',
                height: '30px',
                ml: 1,
                mt: '5px',
                color: 'success.main',
                // border: '2px solid',

                // borderColor: 'success.main',
            }}>
                <AddIcon sx={{fontSize: '30px'}}/>
            </IconButton>
        </Box>
    )
}