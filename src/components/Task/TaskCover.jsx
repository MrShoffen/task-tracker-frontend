import {Box} from "@mui/material";
import * as React from "react";

export const TaskCover = ({coverUrl}) => {

    return(
        <Box sx={{
            position: 'relative',
            width: '270px',
            height: '160px',
            margin: 'auto',
            mt: '6px',
            borderRadius: 2,
            overflow: 'hidden',
            userSelect: 'none'
        }}>
            <Box
                component="img"
                src={coverUrl}
                alt="Background"
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(3px)',
                    transform: 'scale(1.5)',
                    zIndex: 0,
                    opacity: 0.7,
                    pointerEvents: 'none'

                }}
            />
            <Box
                component="img"
                src={coverUrl}
                alt="Task cover"
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />
        </Box>
    )
}