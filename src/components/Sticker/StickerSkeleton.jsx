import {Box, IconButton, useTheme} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {stickerBgColor, stickerColor} from "../../services/util/Utils.jsx";
import {StickerImage} from "../../assets/icons/stickers/StickerUtils.jsx";

export function StickerSkeleton({sticker}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                borderRadius: '7px',
                border: '1px solid',
                position: 'relative',
                display: 'flex',
                height: '27px',
                borderColor: 'action.selected',
                backgroundColor: stickerBgColor(sticker.color),
                p: '2px',

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
        </Box>
    )
}