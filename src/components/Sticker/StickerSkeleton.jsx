import {Box, IconButton, useTheme} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {stickerBgColor, stickerColor} from "../../services/util/Utils.jsx";
import {StickerImage} from "../../assets/icons/stickers/StickerUtils.jsx";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export function StickerSkeleton({sticker, isCopying = false}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                borderRadius: '7px',
                border: '1px solid',
                position: 'relative',
                display: 'flex',
                height: '27px',
                borderColor: isCopying ? 'action.active' : 'action.selected',
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

            {isCopying &&
                <ContentCopyIcon
                    sx={{
                        backgroundColor: 'desk',
                        borderRadius: '5px',
                        width: '30px',
                        top: '13px',
                        left: '-13px',
                        height: '30px',
                        p: '5px',
                        border: '1px solid',
                        borderColor: 'action.selected',
                        position: 'absolute',
                        color: 'taskName',
                    }}
                />
            }
        </Box>
    )
}