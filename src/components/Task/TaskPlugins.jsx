import {Box, IconButton, useTheme} from "@mui/material";
import * as React from "react";
import {CommentsIcon} from "../../assets/icons/Comments.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {Sticker} from "../Sticker/Sticker.jsx";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {AddStickerIcon} from "../../assets/icons/AddStickerIcon.jsx";
import {StickerMenu} from "../Sticker/StickerMenu.jsx";

export function TaskPlugins({task, hovered}) {
    const theme = useTheme();
    const {userHasPermission} = useTaskOperations();

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
                        sx={{
                            borderRadius: '7px',
                            border: '1px solid',
                            borderColor: 'transparent',
                            backgroundColor: 'rgba(99,213,26,0.28)',
                            p: '2px',
                            pr: '17px',
                            ':hover': {
                                borderColor: 'rgba(121,206,105,0.68)',
                            }
                        }}>

                        <Box sx={{p: '2px', backgroundColor: 'rgba(48,200,111,0.83)', borderRadius: '5px',}}>
                            <IconButton disableRipple
                                        sx={{
                                            width: '16px',
                                            opacity: 1, height: '16px',
                                            p: 0,
                                        }}>
                                <CommentsIcon color={'rgb(255,255,255,0.9)'}/>
                            </IconButton>
                        </Box>
                    </Box>
                }

                <Sticker sticker={{
                    color: "BLUE",
                    name: 'fjfjj jajsf',
                    image: "Bookmark"
                }}/>
                <Sticker sticker={{
                    color: "GREEN",
                    name: 'ferw sdfghf',
                    image: "Video"
                }}/>
                <Sticker sticker={{
                    color: "CYAN",
                    name: 'rere wer wer',
                    image: 'Fire'
                }}/>
                <Sticker sticker={{
                    color: "YELLOW",
                    name: 'fdgfs sdf f',
                    image: 'Geo'
                }}/>

                <Sticker sticker={{
                    color: "GREY",
                    name: 'ade g df ff f',
                    image: 'Idea'
                }}/>

                <Sticker sticker={{
                    color: "PURPLE",
                    name: 'red label here',
                    image: 'Cloud'
                }}/>

                <Sticker sticker={{
                    color: "RED",
                    name: 'Высокий приоритет',
                    image: 'Priority'
                }}/>


                <StickerMenu task={task} hovered={hovered}/>
            </Box>
        </Box>
    )
}