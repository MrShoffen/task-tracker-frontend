import {
    Backdrop, Box, CircularProgress,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper, useTheme
} from "@mui/material";
import {MenuIcon} from "../../assets/icons/MenuIcon.jsx";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {UploadCover} from "../../assets/icons/UploadCover.jsx";
import * as React from "react";
import {useRef, useState} from "react";
import * as PropTypes from "prop-types";
import {uploadImage} from "../../services/fetch/unauth/UploadImage.js";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {DeleteCover} from "../../assets/icons/DeleteCover.jsx";
import {taskColorsPalette} from "../../services/util/Utils.js";
import {Galka} from "../../assets/icons/Galka.jsx";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {DeleteTask} from "../../assets/icons/DeleteTask.jsx";
import {sendDeleteDesk} from "../../services/fetch/tasks/desk/SendDeleteDesk.js";
import {sendDeleteTask} from "../../services/fetch/tasks/task/SendDeleteTask.js";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";

function UploadIcon(props) {
    return null;
}

UploadIcon.propTypes = {
    color: PropTypes.string,
    size: PropTypes.string
};

export function TaskMenu({task, hovered, setContentIsLoading}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const {deleteTask, updateTaskColor} = useTaskOperations();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleMenuClose(); // Закрываем меню
    };

    const fileInputRef = useRef(null);

    const {showWarn} = useNotification();

    const validateCover = (file) => {
        const acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (!acceptedFileTypes.includes(file.type)) {
            showWarn("Поддерживается только jpg, png или gif");
            return false;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showWarn("Файл слишком большой");
            return false;
        }
        return true;
    }

    const handleCoverUpload = async (e) => {
        handleMenuClose();
        const file = e.target.files[0];

        if (file && validateCover(file)) {
            setContentIsLoading(true);
            // setContentIsLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('image', file);

            try {
                const uploadedImage = await uploadImage(formData);
                const updatedTask = await sendEditTask(task.api.links.updateTaskCover.href,
                    {
                        newCoverUrl: uploadedImage.imageUrl
                    }
                );
                // updateTask(updatedTask); //todo обновить
            } catch (error) {
                console.log(error);
            }
        }
        setTimeout(() => setContentIsLoading(false), 1000);
    };

    const handleCoverDelete = async (e) => {
        handleMenuClose();
        const updatedTask = await sendEditTask(task.api.links.updateTaskCover.href,
            {
                newCoverUrl: null
            }
        );
        // updateTask(updatedTask); //todo обновить
    }

    const handleColorChange = async (newColor) => {
        try {
            const updatedTask = await sendEditTask(task.api.links.updateTaskColor.href,
                {
                    newColor: newColor
                }
            );
            updateTaskColor(updatedTask);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async () => {
        try {
            await sendDeleteTask(task.api.links.deleteTask.href);
            deleteTask(task);
            // deleteDesk(desk);
        } catch (error) {
            console.log(error);
        }
        handleMenuClose()
    }

    return (<>

            <IconButton
                disableRipple
                onClick={handleMenuClick}
                sx={{
                    width: '17px',
                    height: '17px',
                    opacity: !task.completed ? 1 : (!hovered ? 0.5 : 1),
                    p: 0,
                    ml: -2.8,
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
                                button={"true"}
                                disableGutters
                                onClick={() => fileInputRef.current.click()}
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
                                    <UploadCover color={theme.palette.taskName} size="16px"/>
                                </ListItemIcon>
                                <ListItemText sx={{m: 0}} primary="Загрузить обложку"/>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    style={{display: "none"}}
                                    id="cover-upload"
                                    onChange={handleCoverUpload}
                                />
                            </ListItem>

                            {task.coverUrl &&
                                <ListItem
                                    button={"true"}
                                    disableGutters
                                    onClick={handleCoverDelete}
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
                            }
                            <Divider/>
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
                                        {Object.entries(taskColorsPalette()).map(([name, color]) => (
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
                                                {task.color === name &&
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
                                onClick={handleDelete}
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
                                    <DeleteTask color={theme.palette.taskName}/>

                                </ListItemIcon>
                                <ListItemText sx={{m: 0}} primary="Удалить задачу"/>
                            </ListItem>
                        </List>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    )
}