import {
    Box,
    Card,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper, useTheme
} from "@mui/material";
import * as React from "react";
import {taskColor} from "../../services/util/Utils.js";

import {useState} from "react";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {EditableTaskName} from "./EditableTaskName.jsx";
import {MenuIcon} from "../../assets/icons/MenuIcon.jsx";
import {TaskMenu} from "./TaskMenu.jsx";
import {TaskCover} from "./TaskCover.jsx";

export function Task({task, setContentIsLoading}) {
    const [hovered, setHovered] = React.useState(false);
    const theme = useTheme();

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
                // boxShadow: !hovered && 'none',
                border: '1px solid',
                borderColor: !hovered ? taskColor(task.color) : 'action.disabled',
                // borderColor: 'action.disabled',
                borderRadius: 2,
                position: 'relative',
                minWidth: '286px',
                maxWidth: '286px',
                transition: 'none',
                backdropFilter: 'blur(9px)',
                WebkitBackdropFilter: 'blur(9px)',
                backgroundColor: taskColor(task.color),
                display: 'flex',
                flexDirection: 'column',
                ':hover': {
                    cursor: 'pointer',
                }
            }}>
            {task.coverUrl && <TaskCover coverUrl={task.coverUrl}/>}

            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <IconButton
                    onClick={handleCompletionClick}
                    sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1, mt: 1.2,}}>
                    {!taskCompleted
                        ? <UncheckedIcon color={theme.palette.taskName} size={"17px"}/>
                        : <CheckedIcon size="17px"/>
                    }
                </IconButton>

                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <EditableTaskName
                        task={task}
                        hovered={hovered}
                        taskCompleted={taskCompleted}
                    />
                </Box>

                <TaskMenu
                    task={task}
                    hovered={hovered}
                    taskCompleted={taskCompleted}
                    setContentIsLoading={setContentIsLoading}
                />
            </Box>

        </Card>
    )
}