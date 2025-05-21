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

export function Task({task, setContentIsLoading}) {
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


    const {updateTaskCompletion} = useTaskOperations();


    const style = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        paddingBottom: '10px'
    };

    const handleCompletionClick = async () => {
        try {
            const updatedTask = await sendEditTask(task.api.links.updateTaskCompletion.href,
                {completed: !task.completed});
            updateTaskCompletion(updatedTask);
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
                    // mt: '10px',
                    // mb: '10px',
                    ml: '7px',
                    // mb: '5px',
                    flex: 1,
                    border: isDragging ? '1px dashed' : '1px solid',
                    borderColor: isDragging ? 'info.main' : !hovered ? taskColor(task.color) : 'action.disabled',
                    borderRadius: 2,
                    position: 'relative',
                    minWidth: '286px',
                    maxWidth: '286px',
                    transition: 'none',
                    backgroundColor: isDragging ? 'rgba(174,174,174,0.21)' : taskColor(task.color),
                    // backgroundColor: isDragging ? 'rgba(117,117,117,0.31)' : taskColor(task.color),
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
                            />
                        </Box>

                        <TaskMenu
                            task={task}
                            hovered={hovered}
                            setContentIsLoading={setContentIsLoading}
                        />
                    </Box>
                </Box>
            </Card>
        </div>
    )
}