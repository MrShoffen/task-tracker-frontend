import * as React from "react";
import {useState} from "react";
import {Box, ClickAwayListener, IconButton, Paper, Popper} from "@mui/material";
import {useCustomThemeContext} from "../../context/GlobalThemeContext/CustomThemeProvider.jsx";
import {darkStickerColor, lightStickerColor, stickerColor} from "../../services/util/Utils.jsx";
import Typography from "@mui/material/Typography";


export function ColorMenu({selectedColor, setSelectedColor}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const {isDarkMode} = useCustomThemeContext();

    const colorPalette = () => {
        return !isDarkMode ? lightStickerColor : darkStickerColor;
    }

    const handleHover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            onMouseEnter={handleHover}
            onMouseLeave={handleMenuClose}
        >
            <IconButton
                disableRipple
                sx={{p: 0, ml: '5px'}}>
                <Box sx={{
                    backgroundColor: stickerColor(selectedColor),
                    width: '16px', height: '16px', borderRadius: '50%'
                }}/>
            </IconButton>
            <Popper
                id="edit-menu"
                anchorEl={anchorEl}
                open={open}
                onMouseLeave={handleMenuClose}
                onClose={handleMenuClose}
                placement="bottom"
                sx={{zIndex: 1310,}}
            >
                <ClickAwayListener onClickAway={handleMenuClose}>
                    <Paper
                        elevation={5}
                        sx={{
                            width: '100px',
                            height: '75px',
                            border: '1px solid',
                            borderColor: 'action.selected',
                            borderRadius: 3,
                            backgroundColor: 'menuPopup',
                            cursor: 'pointer',
                        }}
                    >
                        <Typography sx={{mt: '3px', userSelect: 'none', color: 'taskName'}} textAlign="center"
                                    fontSize="0.8rem"
                                    fontWeight="500">
                            Цвет
                        </Typography>

                        {Object.entries(colorPalette()).map(([name, color]) => (
                            <IconButton
                                disableRipple
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedColor(name);
                                    handleMenuClose();
                                }}
                                sx={{m: '4px', p: 0}}>
                                <Box sx={{
                                    backgroundColor: color,
                                    width: '16px', height: '16px', borderRadius: '50%'
                                }}/>
                            </IconButton>
                        ))}
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    )
}