import * as React from "react";
import {useState} from "react";
import {Box, ClickAwayListener, IconButton, Paper, Popper, useTheme} from "@mui/material";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {AddStickerIcon} from "../../assets/icons/AddStickerIcon.jsx";
import Typography from "@mui/material/Typography";
import {IconsMenu} from "./IconsMenu.jsx";
import {ColorMenu} from "./ColorMenu.jsx";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TextField from "@mui/material/TextField";
import {sendCreateSticker} from "../../services/fetch/tasks/sticker/SendCreateSticker.js";


export function StickerMenu({task, hovered}) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const [selectedIcon, setSelectedIcon] = useState("Stick");
    const [selectedColor, setSelectedColor] = useState("RED");
    const [stickerText, setStickerText] = useState('');

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setStickerText('');
        setAnchorEl(null);
    };


    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleConfirm();
        } else if (e.key === 'Escape') {
            handleMenuClose();
        }
    };

    const disabledG = stickerText.trim().length === 0;

    function handleChange(e) {
        const t = e.target.value;
        if (t.trim().length > 64) {
            return
        }
        setStickerText(t);
    }

    async function handleConfirm() {
        try {
            const newSticker = await sendCreateSticker(task, {
                name: stickerText,
                color: selectedColor,
                icon: selectedIcon
            });
            // addNewSticker(task.deskId, newSticker);
        } catch (error) {
            console.log(error.message);
        }
        handleMenuClose();
    }

    return (
        <>
            {(hovered || anchorEl) &&
                <IconButton
                    disableRipple
                    onClick={handleMenuClick}
                    sx={{p: 0}}>
                    <AddStickerIcon color={theme.palette.taskName}/>

                </IconButton>
            }
            <Popper
                // disablePortal
                id="edit-menu"
                onClick={e => e.stopPropagation()}
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                placement="bottom"
                sx={{
                    zIndex: 1300,
                }}

            >
                <ClickAwayListener onClickAway={handleMenuClose}>
                    <Paper
                        elevation={1}
                        sx={{
                            width: '175px',
                            height: '50px',
                            border: '1px solid',
                            borderColor: 'action.disabled',
                            borderRadius: 3,
                            backgroundColor: 'menuPopup',
                        }}
                    >
                        <Typography sx={{mt: '3px', userSelect: 'none', color: 'taskName'}} textAlign="center"
                                    fontSize="0.8rem"
                                    fontWeight="500">
                            Добавить стикер
                        </Typography>

                        {/*{allStickerIcons.map(stickerName =>*/}
                        {/*<StickerImage image={stickerName} color={theme.palette.taskName}/>)}*/}
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <IconsMenu selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon}/>
                            <ColorMenu selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>

                            <TextField
                                autoFocus
                                value={stickerText}
                                placeholder='Имя'
                                onKeyDown={handleKeyDown}
                                onChange={handleChange}
                                size="small"
                                sx={{
                                    width: '100px',
                                    ml: '5px',
                                    mt: '2px',
                                    '& .MuiInputBase-input': {
                                        fontSize: '0.7rem',
                                        p: '2px 4px',
                                    }
                                }}
                            />

                            <IconButton
                                disabled={disabledG}
                                // onClick={handle}
                                onClick={handleConfirm}
                                sx={{
                                    width: '18px',
                                    height: '18px',
                                    ml: '4px',
                                    mt: '3px',
                                    color: 'info.main'
                                }}>
                                <CheckCircleOutlineIcon sx={{fontSize: '20px'}}/>
                            </IconButton>
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    )
}