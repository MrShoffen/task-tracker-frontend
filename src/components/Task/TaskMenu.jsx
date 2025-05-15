import {
    Backdrop, CircularProgress,
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
import {uploadAvatar} from "../../services/fetch/unauth/UploadAvatar.js";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";

function UploadIcon(props) {
    return null;
}

UploadIcon.propTypes = {
    color: PropTypes.string,
    size: PropTypes.string
};

export function TaskMenu({task, hovered, taskCompleted, setContentIsLoading}) {
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

    const fileInputRef = useRef(null);

    const validateCover = (file) => {
        const acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (!acceptedFileTypes.includes(file.type)) {
            alert("wrong type")
            return false;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("wrong size");
            return false;
        }
        return true;
    }

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];

        if (file && validateCover(file)) {
            setContentIsLoading(true);
            // setContentIsLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('image', file);

            try {
                const avatar = await uploadAvatar(formData);
                const updatedTask = await sendEditTask(task.api.links.updateTaskCover.href,
                    {
                        newCoverUrl: avatar.imageUrl
                    }
                );
                console.log(avatar);
            } catch (error) {
                console.log(error);
            }
        }
        setTimeout(() => setContentIsLoading(false), 1000);
    };

    return (<>

            <IconButton
                disableRipple
                onClick={handleMenuClick}
                sx={{
                    width: '17px',
                    height: '17px',
                    opacity: !taskCompleted ? 1 : (!hovered ? 0.5 : 1),
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
                                button
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


                            <ListItem
                                button
                                disableGutters
                                onClick={handleEditClick}
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
                                    <EditIcon sx={{m: 0, width: '16px'}} fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText sx={{m: 0}} primary="Редактировать"/>
                            </ListItem>

                            <ListItem
                                button
                                disableGutters
                                onClick={handleEditClick}
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
                                    <EditIcon sx={{m: 0, width: '16px'}} fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText sx={{m: 0}} primary="Редактировать"/>
                            </ListItem>

                        </List>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    )
}