import {Box, Card, IconButton, useTheme} from "@mui/material";

import * as React from "react";
import {taskColor} from "../../services/util/Utils.jsx";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {EditableTaskName} from "./EditableTaskName.jsx";
import {TaskMenu} from "./TaskMenu.jsx";
import {TaskCover} from "./TaskCover.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

export function Task({task, setContentIsLoading}) {
    const [hovered, setHovered] = React.useState(false);
    const theme = useTheme();

    const {updateTaskCompletion} = useTaskOperations();


    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
        rect
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task
        }
    })

    const style = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
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

    // if (isDragging) {
    //     return (
    //         <div
    //             ref={setNodeRef}
    //             style={style}
    //         >
    //             <Card
    //                 elevation={1}
    //                 onMouseEnter={() => setHovered(true)}
    //                 onMouseLeave={() => setHovered(false)}
    //                 sx={{
    //                     mb: '10px',
    //                     ml: '7px',
    //                     flex: 1,
    //                     border: '1px dashed',
    //                     borderColor: 'taskName',
    //                     borderRadius: 2,
    //                     position: 'relative',
    //                     minWidth: '286px',
    //                     maxWidth: '286px',
    //                     height: `${rect.current?.height}px`, // Ограничение максимальной высоты
    //                     transition: 'none',
    //                     backgroundColor: 'transparent',
    //                     display: 'flex',
    //                 }}></Card></div>
    //     )
    // }

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
                    mb: '10px',
                    ml: '7px',
                    // mb: '5px',
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
                    backgroundColor: isDragging ? 'black' : taskColor(task.color),
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

            </Card>
        </div>
    )
}