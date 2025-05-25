import * as React from "react";
import {useState} from "react";
import {ClickAwayListener, IconButton, Paper, Popper, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import {allStickerIcons, StickerImage} from "../../assets/icons/stickers/StickerUtils.jsx";


export function IconsMenu({selectedIcon, setSelectedIcon}) {


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const handleHover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                onClick={handleHover}
                // onMouseLeave={handleMenuClose}
                disableRipple
                sx={{p: 0, ml: '5px'}}>
                <StickerImage image={selectedIcon} color={theme.palette.taskName}/>

            </IconButton>
            <Popper
                id="edit-menu"
                anchorEl={anchorEl}
                open={open}
                onMouseLeave={handleMenuClose}

                onClose={handleMenuClose}
                placement="auto"
                sx={{
                    zIndex: 1310,
                }}

            >
                <ClickAwayListener onClickAway={handleMenuClose}>
                    <Paper
                        elevation={5}
                        sx={{
                            width: '145px',
                            height: '125px',
                            border: '1px solid',
                            borderColor: 'action.selected',
                            borderRadius: 3,
                            backgroundColor: 'menuPopup',
                            '&:hover': {
                                cursor: 'pointer',
                            }
                        }}
                    >
                        <Typography sx={{mt: '3px',userSelect: 'none', color: 'taskName'}} textAlign="center" fontSize="0.8rem"
                                    fontWeight="500">
                            Иконка
                        </Typography>

                        {allStickerIcons.map(stickerName =>
                            <IconButton
                                disableRipple
                                onClick={() => {
                                    setSelectedIcon(stickerName);
                                    handleMenuClose();
                                }}
                                sx={{m: '2px', p: 0}}>
                                <StickerImage image={stickerName} color={theme.palette.taskName}/>
                            </IconButton>
                            )}
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    )
}