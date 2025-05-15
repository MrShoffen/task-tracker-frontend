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
import * as PropTypes from "prop-types";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {DeleteCover} from "../../assets/icons/DeleteCover.jsx";
import {deskColorsPalette} from "../../services/util/Utils.js";
import {Galka} from "../../assets/icons/Galka.jsx";
import {sendEditDesk} from "../../services/fetch/tasks/desk/SendEditDesk.js";

function UploadIcon(props) {
    return null;
}

UploadIcon.propTypes = {
    color: PropTypes.string,
    size: PropTypes.string
};

export function DeskMenu({desk,  updateDeskColor}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleMenuClose(); // Закрываем меню
    };


    const handleColorChange = async (newColor) => {
        try {
            const updatedTask = await sendEditDesk(desk.api.links.updateDeskColor.href,
                {
                    newColor: newColor
                }
            );
            updateDeskColor(newColor);
        } catch (error) {
            console.log(error);
        }
    }

    return (<>

            <IconButton
                disableRipple
                onClick={handleMenuClick}
                sx={{
                    width: '17px',
                    height: '17px',
                    p: 0,
                    ml: -3.1,
                    mt: 1
                }}>
                <MenuIcon color={theme.palette.taskName} size={"17px"}/>

            </IconButton>

            <Popper
                id="edit-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                placement="right"
                sx={{
                    zIndex: 1300, // Убедитесь, что поверх других элементов
                }}

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
                            <ListItem
                                disableGutters
                                onClick={handleEditClick}
                                sx={{
                                    px: 1,
                                    py: 1
                                }}
                            >
                                <Box
                                    sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                                >
                                    <ListItemText sx={{mb: '5px',}} primary="Цвет задачи"/>


                                    <Box sx={{
                                        display: 'flex',
                                        gap: '3px', // Расстояние между кружками
                                        ml: '1px'   // Отступ от текста
                                    }}>
                                        {Object.entries(deskColorsPalette()).map(([name, color]) => (
                                            <Box
                                                key={color}
                                                sx={{
                                                    backgroundColor: color,
                                                    height: '17px',
                                                    width: '17px',
                                                    borderRadius: '50%', // Делаем круглую форму
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
                                                    console.log('Selected color:', name);
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

                            <Divider/>
                            <ListItem
                                button={"true"}
                                disableGutters
                                sx={{
                                    px: 1,
                                    py: 1
                                }}
                            >
                                <ListItemIcon sx={{
                                    m: 0,
                                    minWidth: '24px !important'
                                }}
                                >
                                    <DeleteCover color={theme.palette.taskName} size="16px"/>

                                </ListItemIcon>
                                <ListItemText sx={{m: 0}} primary="Удалить обложку"/>
                            </ListItem>
                        </List>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    )
}