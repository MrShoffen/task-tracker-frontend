import {Box, CircularProgress, Drawer} from "@mui/material";
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
    PointerSensor, pointerWithin,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, horizontalListSortingStrategy, rectSwappingStrategy, SortableContext} from "@dnd-kit/sortable";
import {restrictToHorizontalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {createPortal} from "react-dom";
import {calculateNewOrderIndex, calculateNewOrderIndexReversed} from "../services/util/Utils.jsx";
import {sendEditDesk} from "../services/fetch/tasks/desk/SendEditDesk.js";
import {sendEditTask} from "../services/fetch/tasks/task/SendEditTask.js";

export default function WorkspacesPage() {
    const {
        fullWorkspaceInformation,
        updateDeskOrder,
        workspaces,
        loadFullWorkspace,
        moveTaskToAnotherDesk,
        loadAllWorkspaces,
        updateTaskOrder,
        refreshTask
    } = useTaskOperations();

    const navigate = useNavigate();
    const location = useLocation();
    const {showWarn} = useNotification();

    const [onConcreteWs, setOnConcreteWs] = useState(false);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const [draggingDesk, setDraggingDesk] = useState(null);
    const [draggingTask, setDraggingTask] = useState(null);
    const [sourceDesk, setSourceDesk] = useState(null);
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
            setSourceDesk(event.active.data.current.task.deskId);
        }
    }

    async function handleDragEnd(event) {
        setDraggingTask(null);
        setDraggingDesk(null);
        setSourceDesk(null);
        // setLastMovedTaskId(null);
        console.log('in handle drop')
        const {active, over} = event;
        if (!over) {
            return;
        }
        console.log('after fist')
        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            console.log(activeId, overId)
            console.log('this erra')
            console.log(' desks')


            const isActiveTask = active.data.current?.type === "task";
            const isOverTask = over.data.current?.type === "task";
            if (isActiveTask && isOverTask) {
                const overTask = over.data.current.task;

                if (sourceDesk === overTask.deskId) {
                    return;
                }


                const workingDeskI = fullWorkspaceInformation
                    .desks
                    .findIndex(d => d.id === overTask.deskId);
                const workingDesk = fullWorkspaceInformation.desks[workingDeskI];
                const activeTIndex = workingDesk.tasks.findIndex(t => t.id === activeId);

                const newOrderTask = calculateNewOrderIndexReversed(5, 0, workingDesk.tasks);
                // console.error(newOrderTask.orderIndex)
                updateTaskOrder(workingDeskI, activeTIndex, newOrderTask);
                console.log('fixxx work - new order ', newOrderTask.orderIndex)
                sendEditTask(workingDesk.tasks[activeTIndex].api.links.updateTaskDesk.href,
                    {
                        newDeskId: workingDesk.tasks[activeTIndex].deskId
                    })
                    .then(updatedTask1 =>
                        sendEditTask(updatedTask1.api.links.updateTaskOrder.href,
                            {
                                updatedIndex: workingDesk.tasks[activeTIndex].orderIndex
                            })
                    )
                    .then(updatedTask2 => {
                            refreshTask(updatedTask2);
                            console.log('UPDATED AFTER MOVING IN FIX')
                        }
                    )
                return;
            }
            // return;
        }
        console.log('after sec')

        const isActiveTask = active.data.current?.type === "task";
        const isOverTask = over.data.current?.type === "task";
        if (isActiveTask && isOverTask) {
            console.log('source ', sourceDesk)
            const activeTask = active.data.current.task;
            const overTask = over.data.current.task;
            const workingDeskI = fullWorkspaceInformation
                .desks
                .findIndex(d => d.id === overTask.deskId);

            const workingDesk = fullWorkspaceInformation.desks[workingDeskI];

            const activeTIndex = workingDesk.tasks.findIndex(t => t.id === activeTask.id);
            const overTIndex = workingDesk.tasks.findIndex(t => t.id === overTask.id);

            const newOrderTask = calculateNewOrderIndexReversed(activeTIndex, overTIndex, workingDesk.tasks);
            // console.error(newOrderTask.orderIndex)
            updateTaskOrder(workingDeskI, activeTIndex, newOrderTask);

            try {
                if (sourceDesk === over.data.current.task.deskId) {
                    await sendEditTask(activeTask.api.links.updateTaskOrder.href,
                        {
                            updatedIndex: newOrderTask.orderIndex
                        });
                } else {
                    console.log('heeere')
                    sendEditTask(activeTask.api.links.updateTaskDesk.href,
                        {
                            newDeskId: newOrderTask.deskId
                        })
                        .then(updatedTask1 =>
                            sendEditTask(updatedTask1.api.links.updateTaskOrder.href,
                                {
                                    updatedIndex: newOrderTask.orderIndex
                                })
                        )
                        .then(updatedTask2 => {
                                refreshTask(updatedTask2);
                                console.log('UPDATED AFTER MOVING')
                            }
                        )
                }
            } catch (error) {
                showWarn(error.message);
            }

            return;
        }

        if (isActiveTask && over.data.current?.type === 'desk') {
            const activeTask = active.data.current.task;
            const overDesk = over.data.current.desk;
            const newOrderTask = {
                    ...activeTask,
                    orderIndex: 2001234
                }
            sendEditTask(newOrderTask.api.links.updateTaskDesk.href,
                {
                    newDeskId: overId
                })

                .then(updatedTask2 => {
                        refreshTask(updatedTask2);
                        console.log('UPDATED AFTER MOVING IN Empty desk')
                    }
                )

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
            if (activeTask.id === overTask.id) {
                return
            }

            const targetDesk = fullWorkspaceInformation.desks.find(d => d.id === overTask.deskId);
            if (targetDesk?.tasks.some(t => t.id === activeTask.id)) return;
            moveTaskToAnotherDesk(activeTask, overTask.deskId);
            console.log('active task ', activeTask)
            console.log('over task ', overTask)
            return;
        }

        if (isActiveTask && over.data.current?.type === 'desk') {
            console.log('moving task to desk');
            if (sourceDesk === overId) {
                console.log('same desk shiieeet')
                return;
            }


            const workingDesk = fullWorkspaceInformation.desks.find(d => d.id === overId);
            if (workingDesk.tasks.length !== 0) {
                console.log('not empty desk');
                return;
            }
            console.log('continue to add to empty desk')

            const activeTask = active.data.current.task;

            moveTaskToAnotherDesk(activeTask, workingDesk.id);
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
                        // modifiers={[restrictToWindowEdges]}

                        sensors={sensors}
                        collisionDetection={pointerWithin}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={onDragOver}
                        // modifiers={[restrictToHorizontalAxis]}
                    >
                        <Box sx={{
                            display: 'inline-flex',
                            gap: 1.5,
                            // mr: 200,
                            alignItems: 'flex-start',
                            height: 'fit-content'
                        }}>
                            <SortableContext
                                strategy={horizontalListSortingStrategy}
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