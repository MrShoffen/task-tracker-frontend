import {Backdrop, Box, Card, CircularProgress} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {NewTaskBadge} from "../Task/NewTaskBadge.jsx";
import {Task} from "../Task/Task.jsx";
import {deskColor} from "../../services/util/Utils.js";
import {DeskMenu} from "./DeskMenu.jsx";


export function TaskDesk({desk, sx}) {

    const [contentIsLoading, setContentIsLoading] = useState(false);

    const [currentDesk, setCurrentDesk] = useState(desk);

    const {userHasPermission} = useTaskOperations();


    const addNewTask = (newTask) => {
        setCurrentDesk(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));
    }

    const updateDeskColor = (newDeskColor) => {
        setCurrentDesk(prev => (
            {
                ...prev,
                color: newDeskColor
            }
        ))
    }

    return (
        <Card
            elevation={0}
            sx={{
                boxShadow: 1,
                borderRadius: 3,
                position: 'relative',
                width: '300px',
                backgroundColor: deskColor(currentDesk.color),
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 120px)', // Ограничение максимальной высоты
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
                    backgroundColor: deskColor(currentDesk.color),
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
                <EditableDeskName desk={currentDesk} hovered={true}/>
                <DeskMenu desk={currentDesk} updateDeskColor={updateDeskColor}/>
                {userHasPermission("CREATE_TASK") &&
                    <NewTaskBadge taskCreationLink={currentDesk.api.links.createTask.href}
                                  addNewTask={addNewTask}
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

                    {currentDesk.tasks && currentDesk.tasks
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
    )
}