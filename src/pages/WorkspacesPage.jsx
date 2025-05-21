import {Box, CircularProgress} from "@mui/material";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTaskOperations} from "../context/Tasks/TaskLoadProvider.jsx";
import WorkspaceHeader from "../components/Workspace/WorkspaceHeader.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {TaskDesk} from "../components/Desk/TaskDesk.jsx";
import {Task} from "../components/Task/Task.jsx";


import {NewDeskBadge} from "../components/Desk/NewDeskBadge.jsx";
import {
    closestCenter, closestCorners,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, horizontalListSortingStrategy, rectSwappingStrategy, SortableContext} from "@dnd-kit/sortable";
import {restrictToHorizontalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {createPortal} from "react-dom";
import {calculateNewOrderIndex} from "../services/util/Utils.jsx";
import {sendEditDesk} from "../services/fetch/tasks/desk/SendEditDesk.js";

export default function WorkspacesPage() {
    const {
        fullWorkspaceInformation,
        updateDeskOrder,
        workspaces,
        loadFullWorkspace,
        moveTaskToAnotherDesk,
        loadAllWorkspaces
    } = useTaskOperations();

    const navigate = useNavigate();
    const location = useLocation();
    const {showWarn} = useNotification();

    const [onConcreteWs, setOnConcreteWs] = useState(false);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const [draggingDesk, setDraggingDesk] = useState(null);
    const [draggingTask, setDraggingTask] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

    useEffect(() => {
        checkAndLoadWorkspace();
    }, [location.pathname]);

    async function checkAndLoadWorkspace() {

        const workspaceId = location.pathname.replace("/workspaces/", '');
        try {
            setWorkspaceLoading(true);
            setOnConcreteWs(true);
            let loadedWorkspaces = workspaces;
            if (loadedWorkspaces.length === 0) {
                loadedWorkspaces = await loadAllWorkspaces();
            }

            const currentWs = loadedWorkspaces.find(ws => ws.id === workspaceId);
            console.log('current workspace', currentWs);
            // if (currentWs !== null) {
            const content = await loadFullWorkspace(currentWs);
            console.log(content);
            setWorkspaceLoading(false);
            // }
        } catch (error) {
            console.log(error);
            navigate("/profile");
            showWarn("Страница не найдена");
        }

    }

    function handleDragStart(event) {
        // console.log("DRAG START ", event)
        if (event.active.data.current?.type === "desk") {
            setDraggingDesk(event.active.data.current.desk);
        }
        if (event.active.data.current?.type === "task") {
            setDraggingTask(event.active.data.current.task);
        }
    }

    async function handleDragEnd(event) {
        setDraggingTask(null);
        setDraggingDesk(null);
        setLastMovedTaskId(null);
        console.log('in handle drop')
        const {active, over} = event;
        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const isActiveTask = active.data.current?.type === "task";
        const isOverTask = over.data.current?.type === "task";
        if (isActiveTask && isOverTask) {
            const activeTask = active.data.current.task;
            const overTask = over.data.current.task;
            const workingDeskI = fullWorkspaceInformation
                .desks
                .findIndex(d => d.id === overTask.deskId);

            const workingDesk = fullWorkspaceInformation.desks[workingDeskI];

            console.log('working desk', workingDesk)
            // const activeDeskIndex = fullWorkspaceInformation.desks.get() findIndex(d => d.id === activeId);
            // const overDeskIndex = fullWorkspaceInformation.desks.findIndex(d => d.id === overId);
            console.log('after drop active ', activeTask)
            console.log('after drop over ', overTask)
            return;
        }

        if (active.data.current?.type === 'desk' &&
            over.data.current?.type === 'desk') {

            const activeDeskIndex = fullWorkspaceInformation.desks.findIndex(d => d.id === activeId);
            const overDeskIndex = fullWorkspaceInformation.desks.findIndex(d => d.id === overId);

            const deskWithUpdatedOrder = calculateNewOrderIndex(activeDeskIndex, overDeskIndex, fullWorkspaceInformation.desks);
            updateDeskOrder(activeDeskIndex, deskWithUpdatedOrder);
            try {
                await sendEditDesk(deskWithUpdatedOrder.api.links.updateDeskOrder.href,
                    {
                        updatedIndex: deskWithUpdatedOrder.orderIndex
                    })
            } catch (error) {
                showWarn(error.message);
            }
        }
    }
    const [lastMovedTaskId, setLastMovedTaskId] = useState(null);
    function onDragOver(event) {
        const {active, over} = event;
        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const isActiveTask = active.data.current?.type === "task";
        const isOverTask = over.data.current?.type === "task";

        if (!isActiveTask) {
            return;
        }

        if (isActiveTask && isOverTask) {
            const activeTask = active.data.current.task;
            const overTask = over.data.current.task;
            if (activeTask.deskId === overTask.deskId) {
                return;
            }
            if(activeTask.id === overTask.id){
                return
            }

            const targetDesk = fullWorkspaceInformation.desks.find(d => d.id === overTask.deskId);
            if (targetDesk?.tasks.some(t => t.id === activeTask.id)) return;
            moveTaskToAnotherDesk(activeTask, overTask.deskId);
            console.log('active task ', activeTask)
            console.log('over task ', overTask)
            return;
        }
    }

    if (!onConcreteWs) {
        return (
            <Box></Box>
        )
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden'
        }}>
            {/* Хедер - фиксированная высота */}
            {workspaceLoading ? (
                <Box sx={{
                    height: '65px',
                    backgroundColor: 'header',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'action.selected',
                    px: 2,
                    boxShadow: 3,
                    flexShrink: 0
                }}>
                    <CircularProgress/>
                </Box>
            ) : (
                <WorkspaceHeader workspace={fullWorkspaceInformation}/>
            )}

            {/* Основной контент с горизонтальным скроллом */}
            <Box sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    px: 2,
                    py: 2
                }}>
                    <DndContext
                        modifiers={[restrictToWindowEdges]}

                        sensors={sensors}
                        // collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={onDragOver}
                        // modifiers={[restrictToHorizontalAxis]}
                    >
                        <Box sx={{
                            display: 'inline-flex',
                            gap: 1.5,
                            alignItems: 'flex-start',
                            height: 'fit-content'
                        }}>
                            <SortableContext
                                // strategy={horizontalListSortingStrategy}
                                items={fullWorkspaceInformation.desks.map(d => d.id)}>
                                {fullWorkspaceInformation?.desks
                                    ?.sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map(desk => (
                                        <TaskDesk
                                            key={desk.id}
                                            desk={desk}
                                            sx={{
                                                flexShrink: 0
                                            }}
                                        />
                                    ))}
                            </SortableContext>
                            <NewDeskBadge/>
                        </Box>
                        {createPortal(
                            <DragOverlay>
                                {draggingDesk &&
                                    <TaskDesk desk={draggingDesk}/>}

                                {draggingTask &&
                                    <Task task={draggingTask}/>}
                            </DragOverlay>, document.body)
                        }
                    </DndContext>
                </Box>
            </Box>
        </Box>
    )
}