import {Box, Card, IconButton, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {EditableTaskName} from "./EditableTaskName.jsx";


export function Task({task}) {
    const [hovered, setHovered] = React.useState(false);

    const [taskCompleted, setTaskCompleted] = React.useState(task.completed);

    const handleCompletionClick = async () => {
        try {
            const profile = await sendEditTask(task.api.links.updateTaskCompletion.href,
                {completed: !taskCompleted});
            setTaskCompleted(prev => !prev);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Card
            elevation={1}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                m: 'auto',
                flex: 1,
                // boxShadow: 1,
                border: '1px solid',
                borderColor: 'action.disabled',
                borderRadius: 2,
                position: 'relative',
                minWidth: '286px',
                maxWidth: '286px',
                backdropFilter: 'blur(9px)',
                WebkitBackdropFilter: 'blur(9px)',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                ':hover': {
                    cursor: 'pointer',
                }
            }}>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <IconButton
                    onClick={handleCompletionClick}
                    sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1, mt: 1.2,}}>
                    {!taskCompleted
                        ? <UncheckedIcon color={"rgb(99,99,99)"} size={"17px"}/>
                        : <CheckedIcon size="17px"/>
                    }
                </IconButton>
                <EditableTaskName
                    task={task}
                    hovered={hovered}
                    taskCompleted={taskCompleted}
                />
            </Box>

        </Card>
    )
}