import {Backdrop, Box, Card, CircularProgress} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {NewTaskBadge} from "../Task/NewTaskBadge.jsx";
import {Task} from "../Task/Task.jsx";
import {deskColor} from "../../services/util/Utils.js";
import {DeskMenu} from "./DeskMenu.jsx";


export function TaskDesk({desk}) {

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
                    borderRadius: 40,
                    position: 'absolute',
                    height: '90px',
                    // zIndex: 200,
                }}
            />
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <EditableDeskName desk={currentDesk} hovered={true}/>
                <DeskMenu desk={currentDesk} updateDeskColor={updateDeskColor}/>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minHeight: 0,
                }}
            >
                {userHasPermission("CREATE_TASK") &&
                    <NewTaskBadge taskCreationLink={currentDesk.api.links.createTask.href}
                                  addNewTask={addNewTask}
                    />
                }

                {currentDesk.tasks
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


        </Card>
    )
}