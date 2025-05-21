import {Box, CircularProgress} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTaskOperations} from "../context/Tasks/TaskLoadProvider.jsx";
import WorkspaceHeader from "../components/Workspace/WorkspaceHeader.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {TaskDesk} from "../components/Desk/TaskDesk.jsx";
import {NewDeskBadge} from "../components/Desk/NewDeskBadge.jsx";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {createPortal} from "react-dom";
import {calculateNewDeskOrderIndex} from "../services/util/Utils.jsx";
import {sendEditDesk} from "../services/fetch/tasks/desk/SendEditDesk.js";

export default function WorkspacesPage() {
    const {
        fullWorkspaceInformation,
        updateDeskOrder,
        workspaces,
        loadFullWorkspace,
        loadAllWorkspaces
    } = useTaskOperations();

    const navigate = useNavigate();
    const location = useLocation();
    const {showWarn} = useNotification();

    const [onConcreteWs, setOnConcreteWs] = useState(false);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const [draggingDesk, setDraggingDesk] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

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

    useEffect(() => {
        checkAndLoadWorkspace();
    }, [location.pathname]);

    function handleDragStart(event) {
        // console.log("DRAG START ", event)
        if (event.active.data.current?.type === "desk") {
            setDraggingDesk(event.active.data.current.desk);
        }
    }

    async function handleDragEnd(event) {
        console.log('in handle drop')
        const {active, over} = event;
        if (!over) {
            return;
        }

        const activeDeskId = active.id;
        const overDeskId = over.id;

        if (activeDeskId === overDeskId) {
            return;
        }

        const activeDeskIndex = fullWorkspaceInformation.desks.findIndex(d => d.id === activeDeskId);
        const overDeskIndex = fullWorkspaceInformation.desks.findIndex(d => d.id === overDeskId);

        const deskWithUpdatedOrder = calculateNewDeskOrderIndex(activeDeskIndex, overDeskIndex, fullWorkspaceInformation.desks);
        updateDeskOrder(activeDeskIndex, deskWithUpdatedOrder);
        try {
            await sendEditDesk(deskWithUpdatedOrder.api.links.updateDeskOrder.href,
            {
                updatedIndex: deskWithUpdatedOrder.orderIndex
            })
        } catch (error){
            showWarn(error.message);
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
                        sensors={sensors}
                        // collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
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
                                    <TaskDesk desk={draggingDesk}/>
                                }
                            </DragOverlay>, document.body)
                        }
                    </DndContext>
                </Box>
            </Box>
        </Box>
    )
}