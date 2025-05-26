import {Box, Card, IconButton, useTheme} from "@mui/material";

import * as React from "react";
import {darkTaskColor, lightTaskColor} from "../../services/util/Utils.jsx";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {EditableTaskName} from "./EditableTaskName.jsx";
import {TaskMenu} from "./TaskMenu.jsx";
import {TaskCover} from "./TaskCover.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useCustomThemeContext} from "../../context/GlobalThemeContext/CustomThemeProvider.jsx";
import {TaskPlugins} from "./TaskPlugins.jsx";
import {UserAvatar} from "../Users/UserAvatar.jsx";
import {UserInfo} from "../Users/UserInfo.jsx";
import {useEffect} from "react";

export function Task({task, setContentIsLoading, disableDragging}) {
    const [hovered, setHovered] = React.useState(false);
    const theme = useTheme();
    const {isDarkMode} = useCustomThemeContext();
    const taskColor = (taskColor) => {
        return !isDarkMode ? lightTaskColor[taskColor] : darkTaskColor[taskColor];
    }


    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task
        }
    })

    const {updateTaskField, usersInWs, userHasPermission} = useTaskOperations();

    const style = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        paddingBottom: '10px'
    };

    function loadUser() {
        const alreadySavedUser = usersInWs.findIndex(user => user.id === task.userId);
        if (alreadySavedUser !== -1) {
            return usersInWs[alreadySavedUser];
        }
    }

    const handleCompletionClick = async () => {
        if (!userHasPermission("UPDATE_TASK_COMPLETION")) {
            return;
        }
        try {
            updateTaskField(task.deskId, task.id, 'completed', !task.completed);
            await sendEditTask(task.api.links.updateTaskCompletion.href,
                {completed: !task.completed});
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <Card
                elevation={1}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    ml: '7px',
                    flex: 1,
                    border: isDragging ? '1px dashed' : '1px solid',
                    borderColor: isDragging ? 'info.main' : !hovered ? taskColor(task.color) : 'action.disabled',
                    borderRadius: 2,
                    position: 'relative',
                    minWidth: '286px',
                    maxWidth: '286px',
                    transition: 'none',
                    backgroundColor: isDragging ? 'rgba(174,174,174,0.21)' : taskColor(task.color),
                    display: 'flex',
                    fontSize: '10px',
                    flexDirection: 'column',
                    ':hover': {
                        cursor: 'pointer',
                    }
                }}>
                {/*<Box sx={{display: 'flex', flexDirection: 'column'}}*/}
                {/*>*/}
                {/*    <span>*/}
                {/*{'taskOrder ' + task.orderIndex}</span>*/}
                {/*    <span> {'taskId  ' + task.id}</span>*/}
                {/*    <span>  {'deskId  ' + task.deskId}</span>*/}
                {/*</Box>*/}
                <Box
                    sx={{
                        opacity: isDragging ? 0 : 1
                    }}
                >
                    {task.coverUrl && <TaskCover coverUrl={task.coverUrl}/>}

                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <IconButton
                            onClick={handleCompletionClick}
                            sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1, mt: 1.2,}}>
                            {!task.completed
                                ? <UncheckedIcon color={theme.palette.taskName} size={"17px"}/>
                                : <CheckedIcon size="17px"/>
                            }
                        </IconButton>

                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                            <EditableTaskName
                                task={task}
                                hovered={hovered}
                                taskCompleted={task.completed}
                                disableDragging={disableDragging}
                            />
                            <TaskPlugins task={task} hovered={hovered}/>
                        </Box>
                        {(userHasPermission("UPDATE_TASK_COLOR")
                                || userHasPermission("UPDATE_TASK_COVER")
                                || userHasPermission("DELETE_TASK")
                            ) &&
                            <TaskMenu
                                task={task}
                                hovered={hovered}
                                setContentIsLoading={setContentIsLoading}
                            />}
                    </Box>

                </Box>
                <UserInfo
                    sx={{
                        position: 'absolute',
                        width: '25px',
                        height: '25px',
                        right: '5px',
                        bottom: '7px',
                        fontWeight: '400',
                        fontSize: '0.7rem',
                        opacity: !task.completed ? 1 : (!hovered ? 0.5 : 1),
                    }}
                    user={loadUser()}
                    createdAt={task.createdAt}
                />

            </Card>
        </div>
    )
}