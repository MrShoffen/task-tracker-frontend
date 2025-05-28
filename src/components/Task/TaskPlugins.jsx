import {Box, IconButton, useTheme} from "@mui/material";
import * as React from "react";
import {CommentsIcon} from "../../assets/icons/Comments.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {Sticker} from "../Sticker/Sticker.jsx";
import {StickerMenu} from "../Sticker/StickerMenu.jsx";
import {stickerBgColor, stickerColor} from "../../services/util/Utils.jsx";
import Typography from "@mui/material/Typography";

export function TaskPlugins({task, hovered}) {
    const theme = useTheme();
    const {
        userHasPermission,
        openChat,
        closeChat
    } = useTaskOperations();


    function handleChatOpen() {
        openChat(task);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                maxWidth: '200px',
                flexDirection: 'row',
                opacity: !task.completed ? 1 : (!hovered ? 0.5 : 1),
                mb: 1, mt: -0.5
            }}
        >
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                {userHasPermission("CREATE_READ_COMMENTS") &&

                    <Box
                        onClick={handleChatOpen}
                        sx={{
                            borderRadius: '7px',
                            border: '1px solid',
                            height: '27px',

                            borderColor: 'transparent',
                            backgroundColor: stickerBgColor('GREEN'),
                            display: 'flex',
                            p: '2px',
                            ':hover': {
                                borderColor: stickerColor('GREEN'),
                            }
                        }}>

                        <Box sx={{
                            p: '2px',
                            mr: '3px',
                            backgroundColor: stickerColor('GREEN'),
                            borderRadius: '5px',
                        }}>
                            <CommentsIcon color={theme.palette.stickerName}/>
                        </Box>
                        <Typography sx={theme => ({
                            pt: '2px',
                            maxWidth: '185px',
                            filter: theme.palette.mode === 'light' && 'brightness(0.7)',
                            color: stickerColor('GREEN'),
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            userSelect: 'none',
                            textOverflow: 'ellipsis',
                            mr: '3px'
                        })} variant='body2' fontSize={'0.7rem'}>
                            Комментарии
                        </Typography>
                    </Box>
                }
                {task.stickers.map(sticker =>
                    <Sticker key={sticker.id} sticker={sticker} deskId={task.deskId}/>)
                }
                {userHasPermission("CREATE_STICKERS") &&
                    <StickerMenu task={task} hovered={hovered}/>
                }
            </Box>
        </Box>
    )
}