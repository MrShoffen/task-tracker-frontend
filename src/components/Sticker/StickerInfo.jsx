import * as React from "react";
import {useEffect, useState} from "react";
import {Box, ClickAwayListener, Divider, Paper, Popper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {formatDate} from "../../services/util/Utils.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {UserAvatar} from "../Users/UserAvatar.jsx";


export function StickerInfo({sx = {}, sticker, handleClose, open, anchorEl}) {
    const {usersInWs} = useTaskOperations();



    const [user, setUser] = React.useState(null);

    async function loadUser() {
        const alreadySavedUser = usersInWs.findIndex(user => user.id === sticker.userId);
        console.log('loading user in sticker')
        if (alreadySavedUser !== -1) {
            setUser(usersInWs[alreadySavedUser]);
        }
    }

    useEffect(() => {
        if (open) {
            loadUser();
        }
    }, [open]);


    return (
        <>
            {user &&
                <>
                    {
                        // hovered &&
                        <Popper
                            id="edit-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            placement="auto"
                            sx={{
                                zIndex: 1800,
                                p: '4px'
                            }}

                        >
                            <ClickAwayListener onClickAway={handleClose}>
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
                                        Автор стикера
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

                                        <Divider/>
                                        <Box mb='2px' mt={'4px'} display="flex" flexDirection="row" gap='5px' pl='8px'>
                                            <Typography sx={{
                                                alignSelf: 'start',
                                                userSelect: 'none', color: 'taskName'
                                            }} textAlign="center"
                                                        fontSize="0.8rem"
                                                        fontWeight="400">
                                                {'Дата: ' + formatDate(sticker.createdAt)}
                                            </Typography>
                                        </Box>
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