import {Box, CircularProgress} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTaskOperations} from "../context/Tasks/TaskLoadProvider.jsx";
import WorkspaceHeader from "../components/Workspace/WorkspaceHeader.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {TaskDesk} from "../components/Desk/TaskDesk.jsx";
import {Task} from "../components/Task/Task.jsx";


import {NewDeskBadge} from "../components/Desk/NewDeskBadge.jsx";
import {DndContext, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors} from "@dnd-kit/core";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import {calculateNewOrderIndex, calculateNewOrderIndexReversed} from "../services/util/Utils.jsx";
import {sendEditDesk} from "../services/fetch/tasks/desk/SendEditDesk.js";
import {sendEditTask} from "../services/fetch/tasks/task/SendEditTask.js";
import {Sticker} from "../components/Sticker/Sticker.jsx";
import {StickerSkeleton} from "../components/Sticker/StickerSkeleton.jsx";

export default function WorkspacesPage() {
    const {
        fullWorkspaceInformation,
        updateDeskOrder,
        workspaces,
        userHasPermission,
        moveTaskToAnotherDesk,
        loadAllWorkspaces,
        updateTaskOrder,
        updateTaskField,
        loadFullWs
    } = useTaskOperations();

    const navigate = useNavigate();
    const location = useLocation();
    const {showWarn} = useNotification();

    const [onConcreteWs, setOnConcreteWs] = useState(false);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const [draggingDesk, setDraggingDesk] = useState(null);
    const [draggingTask, setDraggingTask] = useState(null);
    const [draggingSticker, setDraggingSticker] = useState(null);
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
            // const fullWs = await loadFullWorkspace(currentWs);
            const fullWs = await loadFullWs(workspaceId);
            console.log(fullWs);
            setWorkspaceLoading(false);
        } catch (error) {
            console.log(error);
            navigate("/profile");
            showWarn("Страница не найдена");
        }

    }

    function handleDragStart(event) {
        console.log(event.active.data.current?.type)

        if (event.active.data.current?.type === "sticker") {
            setDraggingSticker(event.active.data.current.sticker);
        }

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
        setDraggingSticker(null);
        setSourceDesk(null);

        const {active, over} = event;
        if (!over) {
            return;
        }
        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
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
                            updateTaskField(updatedTask2.deskId, updatedTask2.id, 'api', updatedTask2.api);
                            updateTaskField(updatedTask2.deskId, updatedTask2.id, 'orderIndex', updatedTask2.orderIndex);
                        }
                    )
                return;
            }
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

            const activeTIndex = workingDesk.tasks.findIndex(t => t.id === activeTask.id);
            const overTIndex = workingDesk.tasks.findIndex(t => t.id === overTask.id);

            const newOrderTask = calculateNewOrderIndexReversed(activeTIndex, overTIndex, workingDesk.tasks);
            // console.error(newOrderTask.orderIndex)

            try {
                if (sourceDesk === activeTask.deskId) {
                    if (!userHasPermission("UPDATE_TASK_ORDER")) {
                        return;
                    }
                    updateTaskOrder(workingDeskI, activeTIndex, newOrderTask);

                    const nTsk = await sendEditTask(activeTask.api.links.updateTaskOrder.href,
                        {
                            updatedIndex: newOrderTask.orderIndex
                        });
                    updateTaskField(nTsk.deskId, nTsk.id, 'orderIndex', nTsk.orderIndex);

                } else {
                    updateTaskOrder(workingDeskI, activeTIndex, newOrderTask);

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
                            updateTaskField(updatedTask2.deskId, updatedTask2.id, 'api', updatedTask2.api);
                            updateTaskField(updatedTask2.deskId, updatedTask2.id, 'orderIndex', updatedTask2.orderIndex);
                        })
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
                        updateTaskField(updatedTask2.deskId, updatedTask2.id, 'api', updatedTask2.api);
                    }
                )

        }

        if (active.data.current?.type === 'desk' &&
            over.data.current?.type === 'desk') {
            if (!userHasPermission("UPDATE_DESK_ORDER")) {
                return;
            }
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
            console.log('tur')
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
            if (targetDesk.id !== sourceDesk.id && !userHasPermission("UPDATE_TASK_DESK")) {
                return;
            }
            if (targetDesk?.tasks.some(t => t.id === activeTask.id)) return;
            moveTaskToAnotherDesk(activeTask, overTask.deskId);
            return;
        }

        if (isActiveTask && over.data.current?.type === 'desk') {
            if (sourceDesk === overId) {
                return;
            }
            if (!userHasPermission("UPDATE_TASK_DESK")) {
                return;
            }

            const workingDesk = fullWorkspaceInformation.desks.find(d => d.id === overId);
            if (workingDesk.tasks.length !== 0) {
                return;
            }

            const activeTask = active.data.current.task;
            moveTaskToAnotherDesk(activeTask, workingDesk.id);
        }
    }

    const [disableDnd, setDisableDnd] = useState(false);

    if (!onConcreteWs) {
        return (<Box></Box>)
    }

    return (
        <Box

            sx={theme => ({
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                ...(fullWorkspaceInformation.coverUrl !== null && {
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        zIndex: 0,
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${fullWorkspaceInformation.coverUrl})`, // Путь к изображению
                        backgroundSize: 'cover', // или 'contain' в зависимости от потребностей
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed', // Фиксированный фон при скролле
                        filter: theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none'
                    }
                })

            })

            }>
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
                        sensors={sensors}
                        collisionDetection={pointerWithin}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={onDragOver}
                    >
                        <Box sx={{
                            display: 'inline-flex',
                            gap: 1.5,
                            alignItems: 'flex-start',
                            height: 'fit-content'
                        }}>
                            <SortableContext
                                disabled={disableDnd}
                                strategy={horizontalListSortingStrategy}
                                items={fullWorkspaceInformation.desks.map(d => d.id)}>
                                {fullWorkspaceInformation?.desks
                                    ?.sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map(desk => (
                                        <TaskDesk
                                            key={desk.id}
                                            desk={desk}
                                            disableDragging={setDisableDnd}
                                        />
                                    ))}
                            </SortableContext>
                            {userHasPermission("CREATE_DESK") && <NewDeskBadge/>}
                        </Box>
                        {createPortal(
                            <DragOverlay>
                                {draggingDesk &&
                                    <TaskDesk desk={draggingDesk}/>}

                                {draggingTask &&
                                    <Task task={draggingTask}/>}

                                {draggingSticker &&
                                    <StickerSkeleton sticker={draggingSticker}/>}
                            </DragOverlay>, document.body)
                        }
                    </DndContext>
                </Box>
            </Box>

        </Box>
    )
}