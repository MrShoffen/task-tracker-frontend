import {UserAvatar} from "./UserAvatar.jsx";
import * as React from "react";
import {useState} from "react";
import {Box, ClickAwayListener, Divider, Paper, Popper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {formatDate} from "../../services/util/Utils.jsx";


export function UserInfo({sx = {}, createdAt, user, label = "Автор задачи"}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleAvatarClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);


    return (
        <>
            {user &&
                <>
                    <UserAvatar
                        handleMenuClick={handleAvatarClick}
                        sx={{
                            position: 'bottom',
                            width: '25px',
                            height: '25px',
                            right: '5px',
                            bottom: '7px',
                            fontWeight: '400',
                            fontSize: '0.7rem',
                            ...sx
                            // opacity: hovered ? 0.5 : 1
                        }}
                        userInfo={user}/>
                    {
                        // hovered &&
                        <Popper
                            id="edit-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            placement="auto"
                            sx={{
                                zIndex: 1800,
                                p: '4px'
                            }}

                        >
                            <ClickAwayListener onClickAway={handleMenuClose}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        width: '200px',
                                        // height: '130px',
                                        border: '1px solid',
                                        borderColor: 'action.disabled',
                                        borderRadius: 2,
                                        backgroundColor: 'menuPopup',
                                    }}
                                >
                                    <Typography sx={{mt: '3px', userSelect: 'none', color: 'taskName'}}
                                                textAlign="center"
                                                fontSize="0.8rem"
                                                fontWeight="500">
                                        {label}
                                    </Typography>

                                    <Box display='flex' flexDirection='column'
                                    >
                                        <Box display="flex" flexDirection="row"
                                             sx={{backgroundColor: 'action.disabled'}}
                                        >
                                            <UserAvatar
                                                sx={{
                                                    width: '25px',
                                                    height: '25px',
                                                    fontWeight: '400',
                                                    fontSize: '0.7rem',
                                                    m: '5px',
                                                    // opacity: hovered ? 0.5 : 1
                                                }}
                                                userInfo={user}/>

                                            <Typography sx={{
                                                mt: '7px',
                                                maxWidth: '155px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                userSelect: 'none', color: 'taskName'
                                            }} textAlign="center"
                                                        fontSize="0.8rem"
                                                        fontWeight="500">
                                                {user.email}
                                                {/*dfffffffffffffffffffffffffffffffffffffffff*/}
                                            </Typography>
                                        </Box>
                                        <Box mb='2px' display="flex" flexDirection="row" gap='5px' pl='36px'>
                                            {user.firstName &&
                                                <Typography sx={{
                                                    maxWidth: '85px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    alignSelf: 'start',
                                                    textOverflow: 'ellipsis',
                                                    userSelect: 'none', color: 'taskName'
                                                }} textAlign="center"
                                                            fontSize="0.8rem"
                                                            fontWeight="400">
                                                    {user.firstName}
                                                    {/*ffffffffffffffffffffffffffffffffff*/}
                                                </Typography>
                                            }

                                            {user.lastName &&
                                                <Typography sx={{
                                                    maxWidth: '85px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    alignSelf: 'start',
                                                    textOverflow: 'ellipsis',
                                                    userSelect: 'none', color: 'taskName'
                                                }} textAlign="center"
                                                            fontSize="0.8rem"
                                                            fontWeight="400">
                                                    {user.lastName}
                                                    {/*ffffffffffffffffffffffffff*/}
                                                </Typography>
                                            }
                                        </Box>

                                        <Box mb='2px' display="flex" flexDirection="row" gap='5px' pl='36px'>

                                            {user.region &&
                                                <Typography sx={{
                                                    maxWidth: '85px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    alignSelf: 'start',
                                                    textOverflow: 'ellipsis',
                                                    userSelect: 'none', color: 'taskName'
                                                }} textAlign="center"
                                                            fontSize="0.8rem"
                                                            fontWeight="400">
                                                    {user.region}
                                                    {/*ffffffffffffffffffffffffffffffffff*/}
                                                </Typography>
                                            }

                                            {user.country &&
                                                <Typography sx={{
                                                    maxWidth: '85px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    alignSelf: 'start',
                                                    textOverflow: 'ellipsis',
                                                    userSelect: 'none', color: 'taskName'
                                                }} textAlign="center"
                                                            fontSize="0.8rem"
                                                            fontWeight="400">
                                                    {user.country}
                                                    {/*ffffffffffffffffffffffffff*/}
                                                </Typography>
                                            }
                                        </Box>
                                        {createdAt &&
                                            <>
                                                <Divider/>
                                                <Box mb='2px' mt={'4px'} display="flex" flexDirection="row" gap='5px'
                                                     pl='8px'>
                                                    <Typography sx={{
                                                        alignSelf: 'start',
                                                        userSelect: 'none', color: 'taskName'
                                                    }} textAlign="center"
                                                                fontSize="0.8rem"
                                                                fontWeight="400">
                                                        {'Дата: ' + formatDate(createdAt)}
                                                    </Typography>
                                                </Box>
                                            </>}

                                    </Box>

                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                    }
                </>
            }
        </>
    )
}