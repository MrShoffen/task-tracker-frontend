import React from "react";
import Box from "@mui/material/Box";
import {Slide} from "@mui/material";

export default function AnimatedElement({children, condition, direction='right'}) {
    const nodeRef = React.useRef(null)

    return (
        <Slide
            nodeRef={nodeRef}
            in={condition}
            timeout={300}
            direction={direction}
            unmountOnExit
            mountOnEnter
        >
            <Box ref={nodeRef}>
                {children}
            </Box>
        </Slide>
    )
}