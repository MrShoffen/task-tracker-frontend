import {Backdrop, Box, Card, CircularProgress} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {NewTaskBadge} from "../Task/NewTaskBadge.jsx";
import {Task} from "../Task/Task.jsx";
import {deskColor} from "../../services/util/Utils.jsx";
import {DeskMenu} from "./DeskMenu.jsx";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"

export function TaskDesk({desk, sx}) {

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: desk.id,
        data: {
            type: "desk",
            desk
        }
    })

    const style = {
        // transition,
        transform: CSS.Transform.toString(transform),
        height: 'calc(100vh - 120px)',
    }

    const [contentIsLoading, setContentIsLoading] = useState(false);

    const {userHasPermission} = useTaskOperations();

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}>
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        border: '2px dashed',
                        borderColor: 'taskName',
                        width: '300px',
                        backgroundColor: 'rgba(174,174,174,0.21)',
                        height: 'calc(100vh - 124px)', // Ограничение максимальной высоты
                    }}>
                </Card>

            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <Card
                elevation={0}
                sx={{
                    boxShadow: 1,
                    borderRadius: 3,
                    position: 'relative',
                    width: '300px',
                    backgroundColor: deskColor(desk.color),
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100vh - 124px)', // Ограничение максимальной высоты
                    ...sx
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
                        backgroundColor: deskColor(desk.color),
                        height: '15px',
                    }}
                />
                <Box
                    sx={{
                        backgroundColor: 'desk',
                        width: '360px',
                        top: '8px',
                        left: '-30px',
                        borderRadius: 12.5,
                        position: 'absolute',
                        height: '9000px',
                        // zIndex: 200,
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    pb: 1.5

                    // flexShrink: 0, // Фиксированная высота
                }}>
                    <EditableDeskName desk={desk} hovered={true}/>
                    <DeskMenu desk={desk}/>
                    {userHasPermission("CREATE_TASK") &&
                        <NewTaskBadge taskCreationLink={desk.api.links.createTask.href}
                        />
                    }

                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Скрываем переполнение
                    position: 'relative',
                }}>
                    {/* Внутренний контейнер с прокруткой */}
                    <Box sx={{
                        overflowY: 'auto',
                        flex: 1,
                        '&::-webkit-scrollbar': {
                            width: '7px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'action.disabled',
                            borderRadius: '3px',
                            visibility: 'hidden', // Скрываем по умолчанию
                            transition: 'visibility 0.6s ease',
                        },
                        '&:hover::-webkit-scrollbar-thumb': {
                            visibility: 'visible', // Показываем при наведении на область прокрутки
                        }


                    }}>

                        {desk.tasks && desk.tasks
                            .sort((a, b) => b.orderIndex - a.orderIndex)
                            .map(task =>
                                <Task
                                    key={task.id}
                                    task={task}
                                    setContentIsLoading={setContentIsLoading}
                                />
                            )
                        }
                    </Box>
                </Box>

            </Card>
        </div>
    )
}