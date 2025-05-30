import {Box, IconButton, useTheme} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import {stickerBgColor, stickerColor} from "../../services/util/Utils.jsx";
import {StickerImage} from "../../assets/icons/stickers/StickerUtils.jsx";
import {StickerInfo} from "./StickerInfo.jsx";
import CloseIcon from '@mui/icons-material/Close';
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {sendDeleteSticker} from "../../services/fetch/tasks/sticker/SendDeleteSticker.js";
import {useDraggable} from "@dnd-kit/core";

export function Sticker({sticker, deskId}) {
    const theme = useTheme();

    const {
        setNodeRef,
        listeners,
    } = useDraggable({
        id: sticker.id,
        data: {
            type: "sticker",
            sticker
        },
        disabled: false
    })


    const [hovered, setHovered] = React.useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const { userHasPermission} = useTaskOperations();

    const handleOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    async function handleDelete(event) {
        event.stopPropagation();
        try {
            // deleteSticker(deskId, sticker);
            await sendDeleteSticker(sticker)
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <Box
            ref={setNodeRef}
            {...listeners}
            onClick={handleOpen}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                borderRadius: '7px',
                border: '1px solid',
                position: 'relative',
                display: 'flex',
                height: '27px',
                borderColor: open ? 'action.active' : 'action.selected',
                backgroundColor: stickerBgColor(sticker.color),
                p: '2px',
                ':hover': {
                    borderColor: open ? 'action.active' : stickerColor(sticker.color),
                }
            }}>
            <Box sx={{
                p: '2px', mr: '3px',
                backgroundColor: stickerColor(sticker.color),
                borderRadius: '5px',
            }}>
                <StickerImage image={sticker.icon} color={theme.palette.stickerName}/>
            </Box>
            <Typography sx={theme => ({
                pt: '2px',
                maxWidth: '185px',
                filter: theme.palette.mode === 'light' && 'brightness(0.7)',
                color: stickerColor(sticker.color),
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                userSelect: 'none',
                textOverflow: 'ellipsis',
                mr: '3px'
            })} variant='body2' fontSize={'0.7rem'}>
                {sticker.name}
            </Typography>

            <StickerInfo open={open} anchorEl={anchorEl} sticker={sticker} handleClose={handleClose}/>
            {hovered && userHasPermission("DELETE_STICKERS") &&
                <IconButton disableRipple
                            onClick={handleDelete}
                            sx={{
                                position: 'absolute',
                                // borderRadius: '5px',
                                backgroundColor: 'error.light',
                                border: '1px solid',
                                borderColor: 'action.disabled',
                                p: '0px',
                                right: -10,
                                top: -10,
                                zIndex: 3000
                            }}
                >
                    <CloseIcon sx={{
                        color: 'rgb(228,228,228)',
                        fontSize: '0.95rem',

                    }}/>
                </IconButton>
            }
        </Box>
    )
}