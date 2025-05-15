import Typography from "@mui/material/Typography";
import {Backdrop, Box, Card, CircularProgress} from "@mui/material";
import * as React from "react";
import {TaskStack} from "../Task/TaskStack.jsx";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {useState} from "react";


export function TaskDesk({desk}) {

    const [contentIsLoading, setContentIsLoading] = useState(false);


    return (
        <Card
            elevation={0}
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
            <Backdrop
                sx={
                    (theme) => ({
                        color: '#fff',
                        zIndex: theme.zIndex.drawer + 1,
                        position: 'absolute'
                    })
                }
                open={contentIsLoading}
            >
                <CircularProgress sx={{width: '20px', height: '20px'}} color="inherit"/>
            </Backdrop>
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
                    // zIndex: 200,
                }}
            />
            <EditableDeskName desk={desk} hovered={true}/>
            <TaskStack
                tasks={desk.tasks}
                taskCreationLink={desk.api.links.createTask.href}
                setContentIsLoading={setContentIsLoading}
            />


        </Card>
    )
}