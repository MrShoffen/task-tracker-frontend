import Typography from "@mui/material/Typography";
import {Box, Card} from "@mui/material";
import * as React from "react";
import {TaskStack} from "../Task/TaskStack.jsx";


export function TaskDesk({desk}) {

    return (
        <Card
            sx={{
                flex: 1,
                boxShadow: 1,
                borderRadius: 3,
                position: 'relative',
                maxWidth: '300px',
                minWidth: '300px',
                minHeight: 0,
                height: '100%',
                pb: 1.5,
                backgroundColor: 'desk',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Box
                sx={{
                    backgroundColor: 'rgb(92, 220, 17)',
                    height: '15px',
                }}
            />
            <Box
                sx={{
                    backgroundColor: 'desk',
                    width: '360px',
                    top: '8px',
                    left: '-30px',
                    borderRadius: 40,
                    position: 'absolute',
                    height: '90px',
                    zIndex: 0,
                }}
            />
            <Typography sx={{m: 1, ml: 2, zIndex: 2, fontSize: '18px', fontWeight: '500', alignSelf: 'start'}}>
                {desk.name}
            </Typography>


            <TaskStack tasks={desk.tasks} taskCreationLink={desk.api.links.createTask.href}/>


        </Card>
    )
}