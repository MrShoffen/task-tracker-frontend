import {TaskDesk} from "./TaskDesk.jsx";
import {Box} from "@mui/material";

export function DeskStack({desks}) {

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "row",
            m: 2,
            gap: 1.5
        }}>
            {desks
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map(desk =>
                <TaskDesk key={desk.id} desk={desk}/>)
            }
        </Box>
    )

}