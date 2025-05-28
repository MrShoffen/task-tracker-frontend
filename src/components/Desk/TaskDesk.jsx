import {Backdrop, Box, Card, CircularProgress} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {NewTaskBadge} from "../Task/NewTaskBadge.jsx";
import {Task} from "../Task/Task.jsx";
import {deskColor} from "../../services/util/Utils.jsx";
import {DeskMenu} from "./DeskMenu.jsx";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import {API_BASE_URL, API_CONTEXT} from "../../../UrlConstants.jsx";

export function TaskDesk({desk, sx, disableDragging}) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        isDragging,
    } = useSortable({
        id: desk.id,
        data: {
            type: "desk",
            desk
        }
    })

    const [disableTaskDragging, setDisableTaskDragging] = useState(false);

    function setDraggingTask(bool){
        setDisableTaskDragging(bool);
        disableDragging(bool);
    }

    const [contentIsLoading, setContentIsLoading] = useState(false);

    const {userHasPermission} = useTaskOperations();

    const style = {
        transform: CSS.Translate.toString(transform),
        height: 'calc(100vh - 120px)',
    }

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
                        border: '1px dashed',
                        borderColor: 'taskName',
                        width: '300px',
                        backgroundColor: 'rgba(174,174,174,0.21)',
                        height: 'calc(100vh - 105px)',
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
        >
            <Card
                {...listeners}
                elevation={0}
                sx={{
                    boxShadow: 1,
                    borderRadius: 3,
                    position: 'relative',
                    width: '300px',
                    backgroundColor: deskColor(desk.color),
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100vh - 115px)',
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
                        height: '100%',
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    pb: 1.5,
                    // minHeight: '50px'
                }}>
                    <EditableDeskName desk={desk} hovered={true} disableDragging={disableDragging}/>
                    <DeskMenu desk={desk}/>
                    {userHasPermission("CREATE_TASK") &&
                        <NewTaskBadge taskCreationLink={API_BASE_URL + API_CONTEXT + "/workspaces/" + desk.workspaceId + "/desks/" + desk.id + '/tasks'}
                        />
                    }

                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <Box sx={{
                        overflowY: 'auto',
                        // flex: 1,
                        '&::-webkit-scrollbar': {
                            width: '7px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'action.disabled',
                            borderRadius: '3px',
                            visibility: 'hidden',
                            transition: 'visibility 0.6s ease',
                        },
                        '&:hover::-webkit-scrollbar-thumb': {
                            visibility: 'visible',
                        }
                    }}>
                        <SortableContext items={desk.tasks.map(t => t.id)}
                                         strategy={verticalListSortingStrategy}
                                         disabled={disableTaskDragging }
                        >
                            {desk.tasks && desk.tasks
                                .sort((a, b) => b.orderIndex - a.orderIndex)
                                .map(task =>
                                    <Task
                                        key={task.id}
                                        task={task}
                                        disableDragging={setDraggingTask}
                                        setContentIsLoading={setContentIsLoading}
                                    />
                                )
                            }
                        </SortableContext>
                    </Box>
                </Box>

            </Card>
        </div>
    )
}