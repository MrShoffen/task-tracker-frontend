import {
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    useTheme
} from "@mui/material";
import {MenuIcon} from "../../assets/icons/MenuIcon.jsx";
import * as React from "react";
import {useState} from "react";
import {deskColorsPalette} from "../../services/util/Utils.jsx";
import {Galka} from "../../assets/icons/Galka.jsx";
import {sendEditDesk} from "../../services/fetch/tasks/desk/SendEditDesk.js";
import {DeleteTask} from "../../assets/icons/DeleteTask.jsx";
import {sendDeleteDesk} from "../../services/fetch/tasks/desk/SendDeleteDesk.js";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";


export function DeskMenu({desk}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const {deleteDesk, userHasPermission, updateDeskField} = useTaskOperations();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleMenuClose();
    };


    const handleColorChange = async (newColor) => {
        try {
            updateDeskField(desk.id, 'color', newColor);
            await sendEditDesk(desk.api.links.updateDeskColor.href,
                {newColor: newColor}
            );
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteDesk = async () => {
        try {
            deleteDesk(desk);
            await sendDeleteDesk(desk.api.links.deleteDesk.href);
        } catch (error) {
            console.log(error);
        }
        handleMenuClose()
    }

    return (<>
            {(userHasPermission("UPDATE_DESK_COLOR")
                    || userHasPermission("DELETE_DESK")
                ) &&
                <>
                    <IconButton
                        disableRipple
                        onClick={handleMenuClick}
                        sx={{
                            width: '17px',
                            height: '17px',
                            p: 0,
                            position: 'absolute',
                            right: '14px',
                            top: '23px'
                        }}>
                        <MenuIcon color={theme.palette.taskName} size={"17px"}/>

                    </IconButton>

                    <Popper
                        id="edit-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        placement="right"
                        sx={{zIndex: 1300,}}
                    >
                        <ClickAwayListener onClickAway={handleMenuClose}>
                            <Paper
                                elevation={1}
                                sx={{
                                    width: '175px',
                                    border: '1px solid',
                                    borderColor: 'action.selected',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    backgroundColor: 'menuPopup',
                                    '&:hover': {
                                        cursor: 'pointer',
                                    }
                                }}
                            >
                                <List disablePadding dense>
                                    {userHasPermission("UPDATE_DESK_COLOR") &&
                                        <ListItem
                                            disableGutters
                                            onClick={handleEditClick}
                                            sx={{px: 1, py: 1}}
                                        >
                                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <ListItemText sx={{mb: '5px',}} primary="Цвет доски"/>
                                                <Box sx={{display: 'flex', gap: '3px', ml: '1px'}}>
                                                    {Object.entries(deskColorsPalette()).map(([name, color]) => (
                                                        <Box
                                                            key={color}
                                                            sx={{
                                                                backgroundColor: color,
                                                                height: '17px',
                                                                width: '17px',
                                                                borderRadius: '50%',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.2s',
                                                                '&:hover': {
                                                                    transform: 'scale(1.1)',
                                                                    boxShadow: 1
                                                                }
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleColorChange(name);
                                                            }}
                                                        >
                                                            {desk.color === name &&
                                                                <Box sx={{ml: '3px', mt: '-5px'}}>
                                                                    <Galka color={theme.palette.taskName}/>
                                                                </Box>
                                                            }
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    }
                                    {userHasPermission("DELETE_DESK") &&
                                        <>
                                            <Divider/>
                                            <ListItem
                                                button={"true"}
                                                disableGutters
                                                onClick={handleDeleteDesk}
                                                sx={{px: 1, py: 1}}
                                            >
                                                <ListItemIcon sx={{m: 0, minWidth: '24px !important'}}>
                                                    <DeleteTask color={theme.palette.taskName} size="16px"/>
                                                </ListItemIcon>
                                                <ListItemText sx={{m: 0}} primary="Удалить доску"/>
                                            </ListItem>
                                        </>}
                                </List>

                            </Paper>
                        </ClickAwayListener>
                    </Popper>
                </>
            }
        </>
    )
}