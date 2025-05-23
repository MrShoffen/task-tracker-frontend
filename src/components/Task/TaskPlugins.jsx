import {Box, IconButton, useTheme} from "@mui/material";
import * as React from "react";
import {CommentsIcon} from "../../assets/icons/Comments.jsx";

export function TaskPlugins({task, hovered}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                opacity: !task.completed ? 1 : (!hovered ? 0.5 : 1),
                mb: 1, mt: -0.5
            }}
        >

            <Box
                sx={{
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: 'transparent',
                    backgroundColor: 'rgba(99,213,26,0.28)',
                    p: '2px',
                    ml: 1,
                    pr: '17px',
                    ':hover': {
                        borderColor: 'rgba(121,206,105,0.68)',

                    }
                }}>
                <Box
                    sx={{
                        p: '2px',
                        backgroundColor: 'rgba(48,200,111,0.83)',
                        borderRadius: '5px',

                    }}
                >
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

            {/*<IconButton*/}
            {/*    sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1, }}>*/}
            {/*    <UncheckedIcon color={theme.palette.taskName} size={"17px"}/>*/}
            {/*</IconButton>*/}
        </Box>
    )
}